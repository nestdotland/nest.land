import {
  fromFileUrl,
  isAbsolute,
  resolve,
} from "https://x.nest.land/std@0.70.0/path/mod.ts";
import init, {
  tree as extractImports,
  source,
} from "./wasm.js";

const decoder = new TextDecoder("utf-8");

export type Status = "internal" | "external" | "dependency";

export type ImportTree = Array<{
  path: string;
  imports: ImportTree;
  status?: Status;
}>;

export interface ImportTreeAnalysis {
  tree: ImportTree;
  circular: boolean;
  dependencies: string[];
  errors: Array<[string, unknown]>;
  count: number;
  iterator: IterableIterator<string>;
}

export interface TreeOptions {
  fullTree?: boolean;
  onImportFound?: (count: number) => void;
  onImportResolved?: (count: number) => void;
}

await init(source);

/** Build an import tree from a relative path or remote HTTP URL.
 * Analyses simultaneously the constructed tree. */
export async function importTree(
  path: string,
  {
    fullTree = false,
    onImportFound = () => {},
    onImportResolved = () => {},
  }: TreeOptions = {},
): Promise<ImportTreeAnalysis> {
  const markedImports = new Map<string, ImportTree>();

  const dependencies: string[] = [];

  const errors: Array<[string, unknown]> = [];
  let circular = false;
  let count = 0;

  let foundImportsCount = 0;
  let resolvedImportsCount = 0;

  async function createTree(
    url: string,
    parents: string[],
    status: Status,
  ): Promise<ImportTree> {
    if (url.match(/^\[(Circular|Error|Redundant)/)) {
      return [{
        path: url,
        imports: [],
      }];
    }

    if (status === "dependency") dependencies.push(url);

    const depTree: ImportTree = [];
    markedImports.set(url, depTree);

    const src = await fetchData(url);

    const imports_: string[] = extractImports("", src)

    const imports = imports_.map((dep: string) => resolveURL(dep, url));
    
    const statutes = imports_.map((dep) => {
      const status_: Status = (status === "external" || status === "dependency")
        ? "external"
        : (dep.match(/^https?:\/\//) ? "dependency" : "internal");
      return status_
    })

    const resolvedImports: Promise<ImportTree>[] = imports
      .map((dep) => {
        onImportFound(++foundImportsCount);
        if (parents.includes(dep)) {
          circular = true;
          return "[Circular]";
        }
        return dep;
      })
      .map((dep, index) => {
        if (markedImports.has(dep)) {
          return fullTree
            ? Promise.resolve(markedImports.get(dep) as ImportTree)
            : createTree("[Redundant]", [], statutes[index]);
        }
        if (dep !== "[Circular]") count++;
        return createTree(dep, [url, ...parents], statutes[index]);
      });
    const settledImports = await Promise.allSettled(
      resolvedImports,
    );

    for (let i = 0; i < imports.length; i++) {
      onImportResolved(++resolvedImportsCount);
      const subTree = settledImports[i];

      if (subTree.status === "fulfilled") {
        depTree.push({
          path: imports[i],
          imports: subTree.value,
          status: statutes[i],
        });
      } else {
        errors.push([imports[i], subTree.reason]);
        depTree.push({
          path: imports[i],
          imports: [{
            path: `[Error: ${subTree.reason}]`,
            imports: [],
          }],
        });
      }
    }

    return depTree;
  }

  const url = resolveURL(path);
  const tree = [{
    path: url,
    imports: await createTree(url, [], "internal"),
    status: "internal" as Status,
  }];
  return { tree, circular, dependencies, count, iterator: markedImports.keys(), errors };
}

/* Converts a path string to a file URL. */
export function toFileURL(path: string, url = "") {
  if (url.match(/^file:\/\/\//) && (!isAbsolute(path))) {
    return new URL(path, url).href;
  }

  let resolvedPath = (isAbsolute(path) ? path : resolve(path))
    .replace(/\\/g, "/");

  // Windows drive letter must be prefixed with a slash
  if (resolvedPath[0] !== "/") {
    resolvedPath = `/${resolvedPath}`;
  }

  return encodeURI(`file://${resolvedPath}`).replace(
    /[?#]/g,
    encodeURIComponent,
  );
}

/* Resolves any path, relative or HTTP url. */
export function resolveURL(path: string, base = "") {
  if (path.match(/^https?:\/\//)) {
    return path;
  }
  if (base.match(/^https?:\/\//)) {
    return new URL(path, base).href;
  }
  return toFileURL(path, base);
}

/* Fetch data from file: or https: urls */
async function fetchData(url: string) {
  if (url.match(/^https?:\/\//)) {
    const data = await fetch(url);
    return data.text();
  }
  const data = await Deno.readFile(
    resolve(decodeURIComponent(fromFileUrl(url))),
  );
  return decoder.decode(data);
}

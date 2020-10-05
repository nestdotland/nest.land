/** Build an import tree from a relative path or remote HTTP URL.
 * Analyses simultaneously the constructed tree. */
export async function importTree(
  path,
  {
    fullTree = false,
    onImportFound = () => {},
    onImportResolved = () => {},
  } = {}
) {
  const markedImports = new Map();

  const dependencies = [];

  const errors = [];
  let circular = false;
  let count = 0;

  let foundImportsCount = 0;
  let resolvedImportsCount = 0;

  async function createTree(url, parents, status) {
    if (url.match(/^\[(Circular|Error|Redundant)/)) {
      return [
        {
          path: url,
          imports: [],
        },
      ];
    }

    if (status === "dependency") dependencies.push(url);

    const depTree = [];
    markedImports.set(url, depTree);

    const src = await fetchData(url);

    const imports_ = extractImports("", src);

    const imports = imports_.map((dep) => resolveURL(dep, url));

    const statutes = imports_.map((dep) => {
      const status_ =
        status === "external" || status === "dependency"
          ? "external"
          : dep.match(/^https?:\/\//)
          ? "dependency"
          : "internal";
      return status_;
    });

    const resolvedImports = imports
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
            ? Promise.resolve(markedImports.get(dep))
            : createTree("[Redundant]", [], statutes[index]);
        }
        if (dep !== "[Circular]") count++;
        return createTree(dep, [url, ...parents], statutes[index]);
      });
    const settledImports = await Promise.allSettled(resolvedImports);

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
          imports: [
            {
              path: `[Error: ${subTree.reason}]`,
              imports: [],
            },
          ],
        });
      }
    }

    return depTree;
  }

  const url = resolveURL(path);
  const tree = [
    {
      path: url,
      imports: await createTree(url, [], "internal"),
      status: "internal",
    },
  ];
  return {
    tree,
    circular,
    dependencies,
    count,
    iterator: markedImports.keys(),
    errors,
  };
}

/* Resolves any path, relative or HTTP url. */
export function resolveURL(path, base = "") {
  if (path.match(/^https?:\/\//)) {
    return path;
  }
  return new URL(path, base).href;
}

/* Fetch data from file: or https: urls */
async function fetchData(url) {
  const data = await fetch(url);
  return data.text();
}

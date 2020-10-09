/** Build an import tree from a relative path or remote HTTP URL.
 * Analyses simultaneously the constructed tree. */
export async function importTree(
  path,
  {
    allowRedundant = false,
    allowCircular = false,
    onImportFound = () => {},
    onImportResolved = () => {},
  } = {}
) {
  const markedImports = new Map();

  const dependencies = [];

  const errors = [];
  const loops = [];
  let count = 0;

  let foundImportsCount = 0;
  let resolvedImportsCount = 0;

  function isCircular(parents, url) {
    return (
      parents.includes(url) ||
      parents.some((parent1) =>
        markedImports
          .get(parent1)
          .markedParents.some((parent2) => parent2.includes(url))
      )
    );
  }

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
    parents.push(url);

    const depTree = [];
    markedImports.set(url, {
      tree: depTree,
      markedParents: [parents],
    });

    const src = await fetchData(url);

    const rawImports = extractImports("", src);

    const imports = rawImports.map((dep) => resolveURL(dep, url));

    const statutes = rawImports.map((dep) => {
      const newStatus =
        status === "external" || status === "dependency"
          ? "external"
          : dep.match(/^https?:\/\//)
          ? "dependency"
          : "internal";
      return newStatus;
    });

    const resolvedImports = imports.map((dep, index) => {
      onImportFound(++foundImportsCount);
      if (isCircular(parents, dep)) {
        loops.push(dep);
        markedImports.get(dep).markedParents.push(parents);
        return allowCircular
          ? Promise.resolve(markedImports.get(dep).tree)
          : createTree("[Circular]", [], statutes[index]);
      }
      if (markedImports.has(dep)) {
        markedImports.get(dep).markedParents.push(parents);
        return allowRedundant
          ? Promise.resolve(markedImports.get(dep).tree)
          : createTree("[Redundant]", [], statutes[index]);
      }
      count++;
      return createTree(dep, [...parents], statutes[index]);
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
          circular: isCircular(parents, imports[i]),
          redundant: markedImports.has(imports[i]),
        });
      } else {
        errors.push([imports[i], subTree.reason]);
        depTree.push({
          path: imports[i],
          error: `${subTree.reason}`,
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
    loops,
    dependencies,
    count,
    errors,
    imports: [...markedImports.keys()],
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

import { VueTreeList, Tree, TreeNode } from "vue-tree-list";

let ids = 0

export function addTreeToNode(tree, node, depth = 0) {
  if (/* depth	< 5 */true) {
    for (let i = 0; i < tree.length; i++) {
      const newNode = new TreeNode({
        id: `${ids++}`,
        name: tree[i].path,
        dragDisabled: true,
        addTreeNodeDisabled: true,
        addLeafNodeDisabled: true,
        editNodeDisabled: true,
        delNodeDisabled: true,
      })
      node.addChildren(newNode)
      addTreeToNode(tree[i].imports, newNode, depth + 1)
    }
  }
}
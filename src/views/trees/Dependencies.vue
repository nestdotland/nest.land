<template>
  <div>
    <vue-tree-list
      :model="data"
      v-bind:default-expanded="false"
    >
      <template v-slot:leafNameDisplay="slotProps">
        <span>{{ slotProps.model.name }}</span>
      </template>
      <template v-slot:leafNodeIcon="slotProps">
        <span class="icon">
          <font-awesome-icon
            class="icon-margin-right"
            :icon="['fa',getFileIcon(slotProps.model.name)]"
          />
        </span>
      </template>
      <span class="icon" slot="treeNodeIcon"><font-awesome-icon class="icon-margin-right" :icon="['fa', 'external-link-alt']" /></span>
    </vue-tree-list>
  </div>
</template>

<script>
import { VueTreeList, Tree, TreeNode } from "vue-tree-list";
export default {
  name: "DependencyTree",
  components: {
    VueTreeList,
  },
  data() {
    return {
      ids: 1,
      newTree: {},
      data: new Tree([
        {
          name: "Computing the number of dependencies..",
          id: 0,
          pid: 0,
          dragDisabled: true,
          addTreeNodeDisabled: true,
          addLeafNodeDisabled: true,
          editNodeDisabled: true,
          delNodeDisabled: true,
          children: [],
        },
      ]),
    };
  },
  props: {
    dependencies: Array,
  },
  watch: {
    dependencies(deps) {
      this.data.children[0].changeName(deps.length === 0 ? "No external dependencies 🎉" : `${deps.length} external dependencies`)

      for (let i = 0; i < deps.length; i++) {
        const node = new TreeNode({
          id: `${this.ids++}`,
          name: deps[i],
          isLeaf: true,
          dragDisabled: true,
          addTreeNodeDisabled: true,
          addLeafNodeDisabled: true,
          editNodeDisabled: true,
          delNodeDisabled: true,
        })
        this.data.children[0].addChildren(node);
      }
    },
  },
  methods: {
    getFileIcon(fileName = "") {
      const tmpSplit = fileName.split(".");
      const type = tmpSplit.length < 2 ? "dir" : tmpSplit[tmpSplit.length - 1];
      if (type === "dir") return "file";
      if (type === "md") return "book-open";
      return ["png", "jpg", "gif", "jpeg"].includes(type)
        ? "image"
        : "file-code";
    },
  },
};
</script>

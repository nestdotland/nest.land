<template>
  <div>
    <vue-tree-list
      @click="onClick"
      @change-name="onChangeName"
      @delete-node="onDel"
      @add-node="onAddNode"
      :model="data"
      default-tree-node-name="Folder"
      default-leaf-node-name="File"
      v-bind:default-expanded="false"
    >
      <template v-slot:leafNameDisplay="slotProps">
        <span>{{ slotProps.model.name }}</span>
      </template>
      <template v-slot:treeNodeIcon="slotProps">
        <span class="icon">
          <font-awesome-icon
            class="icon-margin-right"
            :icon="['fa',getFileIcon(slotProps.model.name)]"
          />
        </span>
      </template>
      <template v-slot:leafNodeIcon="slotProps">
        <span class="icon">
          <font-awesome-icon
            class="icon-margin-right"
            :icon="['fa',getFileIcon(slotProps.model.name)]"
          />
        </span>
      </template>
      <span class="icon" slot="addTreeNodeIcon"><font-awesome-icon class="icon-margin-right" :icon="['fa', 'folder-plus']" /></span>
      <span class="icon" slot="addLeafNodeIcon"><font-awesome-icon class="icon-margin-right" :icon="['fa', 'file-medical']" /></span>
      <span class="icon" slot="editNodeIcon"><font-awesome-icon class="icon-margin-right" :icon="['fa', 'pen']" /></span>
      <span class="icon" slot="delNodeIcon"><font-awesome-icon class="icon-margin-right" :icon="['fa', 'trash-alt']" /></span>
    </vue-tree-list>
  </div>
</template>

<script>
import { VueTreeList, Tree, TreeNode } from "vue-tree-list";
import { addTreeToNode } from "./addToTree";

export default {
  name: "ImportTree",
  components: {
    VueTreeList,
  },
  data() {
    return {
      ids: 1,
      newTree: {},
      data: new Tree([
        {
          name: "Computing import tree...",
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
    imports: Array,
  },
  watch: {
    imports(tree) {
      const node = new Tree([])
      addTreeToNode(tree, node)
      this.data = node;
    },
  },
  methods: {
    onDel(node) {
      console.log(node);
      node.remove();
    },

    onChangeName(params) {
      console.log(params);
    },

    onAddNode(params) {
      console.log(params);
    },

    onClick(params) {
      console.log(params);
    },
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

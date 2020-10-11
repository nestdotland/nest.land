<template>
  <div class="tree">
    <ul class="tree-list">
      <node-tree
        :node="treeData"
        id="n-0"
        :render="true"
        :raw="raw"
        :importStatus="importStatus"
      ></node-tree>
    </ul>
  </div>
</template>

<script>
import NodeTree from "./NodeTree";

export default {
  props: {
    treeData: Object,
    raw: Boolean,
    importStatus: Boolean,
  },
  components: {
    NodeTree,
  },
};
</script>

<style scoped lang="sass">
.tree
  width: 100%
</style>

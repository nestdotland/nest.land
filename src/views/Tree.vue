<template>
  <v-jstree
    :data="asyncData"
    :async="loadData"
    @item-click="itemClick"
    ref="importTree"
  ></v-jstree>
</template>

<script>
export default {
  name: "Tree",
  data() {
    return {
      asyncData: [],
      loadData(oriNode, resolve) {
        if (oriNode.data.tree !== undefined) {
          const data = oriNode.data.tree.map((subTree) => {
            return {
              text: subTree.path,
              isLeaf: subTree.imports.length === 0,
              tree: subTree.imports,
            };
          });
          resolve(data);
        }
      },
    };
  },
  props: {
    tree: Array,
  },
  watch: {
    tree(tree) {
      console.log("here", this.asyncData);
      this.asyncData.tree = tree;
      this.$refs.importTree.handleAsyncLoad(
        this.asyncData,
        this.$refs.importTree
      );
    },
  },
  async mounted() {
    this.asyncData = [this.$refs.importTree.initializeLoading()];
  },
  methods: {
    itemClick(node) {
      console.log(node.model.text + " clicked !");
    },
  },
};
</script>

<style lang="sass"></style>

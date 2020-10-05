<template>
  <v-jstree :data="asyncData" :async="loadData" whole-row @item-click="itemClick" ref="importTree"></v-jstree>
</template>

<script>
export default {
  name: "Tree",
  data() {
    return {
      asyncData: [],
      loadData(oriNode, resolve) {
        console.log(oriNode.data)
        if (oriNode.data.tree === undefined) {
          console.log("undefined", this.tree)
        } else {
          console.log("hey")
          console.log(oriNode, resolve)
          let id = 0;
          const tree = oriNode.data.tree;
          const data2 = tree.map((subTree) => {
            return {
              text: subTree.path,
              isLeaf: subTree.imports.length === 0,
              tree: subTree.imports,
            }
          })
          resolve(data2)
        }
      }
    }
  },
  props: {
    tree: Array,
  },
  watch: {
    tree(tree) {
      console.log("here", this.asyncData);
      this.asyncData.tree = tree
      this.$refs.importTree.handleAsyncLoad(this.asyncData, this.$refs.importTree);
    },
  },
  async mounted() {
    this.asyncData = [
      this.$refs.importTree.initializeLoading()
    ]
  },
  methods: {
    itemClick(node) {
      console.log(node.model.text + ' clicked !')
    },
  }
};
</script>

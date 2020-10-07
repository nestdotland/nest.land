<template>
  <li class="node-tree">
    
    <input type="checkbox" :id="id" v-if="node.imports.length" @click="() => subRender = true"/>
    <label :for="id" v-if="node.imports.length">
      {{ node.path }}
    </label>

    <div v-else>
      {{ node.path }}
    </div> 

    <ul v-if="node.imports && node.imports.length && render">
      <node v-for="(child, index) in node.imports" :key="`${id}-${index}`" :id="`${id}-${index}`" :node="child" :render="subRender"></node>
    </ul>
  </li>
</template>

<script>
export default {
  name: "node",
  data: () => {
    return {
      subRender: false,
    }
  },
  props: {
    node: Object,
    id: String,
    render: Boolean,
  }
};
</script>
<template>
  <li class="node-tree">
    <!-- <div v-if="node.imports.length"> -->
      <input type="checkbox" :id="id"/>
      <label :for="id">
        {{ node.path }}
      </label>  
    <!-- </div>
    <div v-else>
      {{ node.path }}
    </div> -->
    

    <ul v-if="node.imports && node.imports.length">
      <node v-for="(child, index) in node.imports" :key="`${id}-${index}`" :id="`${id}-${index}`" :node="child"></node>
    </ul>
  </li>
</template>

<script>
export default {
  name: "node",
  props: {
    node: Object,
    id: String
  }
};
</script>
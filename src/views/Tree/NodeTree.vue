<template>
  <li :class="[node.imports.length ? 'node-tree' : 'leaf-tree']">
    <input
      type="checkbox"
      :id="id"
      v-if="node.imports.length"
      @click="() => (subRender = true)"
    />
    <label class="label-tree" :for="id">
      <UrlRegistry :url="node.path" :raw="raw"></UrlRegistry>
      <span class="status-tree" v-if="importStatus"> {{ node.status }} </span>
      <span class="status" v-if="node.error"> error: {{ node.error }} </span>
      <span class="status" v-if="node.circular">
        circular import
      </span>
    </label>

    <ul v-if="node.imports && node.imports.length && render && !node.error">
      <node
        v-for="(child, index) in node.imports"
        :key="`${id}-${index}`"
        :id="`${id}-${index}`"
        :node="child"
        :render="subRender"
      ></node>
    </ul>
  </li>
</template>

<script>
import { parseURL, registryNames } from "./registries";
import UrlRegistry from "./UrlRegistry";

export default {
  name: "node",
  data() {
    return {
      subRender: false,
    };
  },
  components: {
    UrlRegistry,
  },
  props: {
    node: Object,
    id: String,
    render: Boolean,
    raw: Boolean,
    importStatus: Boolean,
  },
};
</script>

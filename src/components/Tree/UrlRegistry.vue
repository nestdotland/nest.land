<template>
  <span>
    <span v-if="!raw && supportedRegistry">
      <span :class="[registry.replace('.', ''), 'registry-label-url']">
        {{ registry }}
      </span>
      <span class="name-label-url"> {{ name }} </span>
      <span class="owner-label-url"> {{ owner }} </span>
      <span class="version-label-url"> {{ version }} </span>
      <span class="relativePath-label-url"> {{ relativePath }} </span>
    </span>
    <span v-else>
      {{ url }}
    </span>
  </span>
</template>

<script>
import { parseURL, registryNames } from "../../modules/hatcher/registries";
export default {
  props: {
    url: String,
    raw: Boolean,
  },
  computed: {
    supportedRegistry() {
      try {
        parseURL(this.url);
        return true;
      } catch (e) {
        return false;
      }
    },
    name() {
      return parseURL(this.url).name;
    },
    owner() {
      return parseURL(this.url).owner;
    },
    version() {
      return parseURL(this.url).version;
    },
    relativePath() {
      return parseURL(this.url).relativePath;
    },
    registry() {
      const registry = parseURL(this.url).registry;
      return registryNames[registry] || registry;
    },
  },
};
</script>

<style lang="sass">
span
  &.registry-label-url
    font-weight: bold
    opacity: 0.7

    &.nestland
      opacity: 1
      background: -webkit-linear-gradient(45deg, #22c1c3, #fdbb2d)
      background-clip: text
      -webkit-background-clip: text
      -webkit-text-fill-color: transparent

  &.name-label-url
    font-weight: bold

  &.owner-label-url
    font-weight: bold

  &.version-label-url
    font-style: italic

  &.relativePath-label-url
    font-style: italic
    opacity: 0.5
</style>

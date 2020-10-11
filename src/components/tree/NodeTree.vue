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
        :raw="raw"
        :importStatus="importStatus"
      ></node>
    </ul>
  </li>
</template>

<script>
import { parseURL, registryNames } from "../../modules/hatcher/registries";
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

<style scoped lang="sass">
li
  list-style: none
  padding-top: .5em
  padding-left: 1.5em
  position: relative

  &::before
    position: absolute
    top: 0
    left: 0
    display: block
    float: left
    content: ''
    width: 1em
    height: 1.5em
    margin: auto
    border-left: 2px solid #ccc
    border-bottom: 2px solid #ccc

  &::after
    position: absolute
    top: 0
    left: 0
    display: block
    float: left
    content: ''
    width: 1em
    height: 100%
    border-left: 2px solid #ccc

  &:last-child:after
    display: none

  &.node-tree
    &::before
      border-image: linear-gradient(to right, #ccc, #22c1c3)
      border-image-slice: 1

    .label-tree
      cursor: pointer

    ul
      visibility: hidden
      opacity: 0
      max-height: 0
      transition: all 0.5s

    input
      &:checked
        & ~ ul
          visibility: visible
          opacity: 1
          max-height: 100%

  &.leaf-tree
    &::before
      border-image: linear-gradient(to right, #ccc, #fdbb2d)
      border-image-slice: 1

    .label-tree
      cursor: default

  span
    &.status-tree
      display: block
      font-size: 0.7em

    &.status
      display: block
      font-size: 0.9em
      font-weight: bold
      color: #c00

      &::before
        color: initial
        opacity: 0.3
        content: 'Status: '

    &.registry-label-tree
      font-weight: bold
      opacity: 0.7

      &.nestland
        opacity: 1
        background: -webkit-linear-gradient(45deg, #22c1c3, #fdbb2d)
        background-clip: text
        -webkit-background-clip: text
        -webkit-text-fill-color: transparent

    &.name-label-tree
      font-weight: bold

    &.owner-label-tree

    &.version-label-tree
      font-style: italic

    &.relativePath-label-tree
      font-style: italic
      opacity: 0.5

  input[type=checkbox]
    display: none
</style>

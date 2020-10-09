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

<style lang="sass">
.tree
  width: 100%

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

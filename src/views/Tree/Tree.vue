<template>
  <div class="tree">
    <ul class="tree-list">
      <node-tree :node="treeData" id="n-0" :render="true"></node-tree>
    </ul>
  </div>
</template>

<script>
import NodeTree from "./NodeTree";

export default {
  props: {
    treeData: Object
  },
  components: {
    NodeTree
  }
};
</script>

<style lang="sass">
.tree
  width: 100%
    
  li
    list-style: none
    padding-top: .5em;
    padding-left: 1.5em
    // font-weight: bold
    position: relative
    // background: #f6f8fb

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
      border-left: 1px solid #ccc
      border-bottom: 1px solid #ccc

    &::after
      position: absolute
      top: 0
      left: 0
      display: block
      float: left
      content: ''
      width: 1em
      height: 100%
      border-left: 1px solid #ccc

    &:last-child:after
      display: none

    &.leaf-tree::before
        border-image: linear-gradient(to right, #ccc, #fdbb2d)
        border-image-slice: 1

    &.node-tree
      &::before
        border-image: linear-gradient(to right, #ccc, #22c1c3)
        border-image-slice: 1

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

          & ~ label 
            &::before
              transform: rotate(90deg)

    span
      display: block
      font-size: 0.9em
      font-weight: normal

      &:before
        opacity: 0.3
        font-weight: bold

      &.status:before
        content: 'status: '

  label 
    position: relative 
    // display: block 
    width: 100% 
    cursor: pointer 
    white-space: nowrap

  input[type=checkbox] 
    display: none 

  label 
    &::before
      // // content: "🞧" 
      // position: absolute 
      // // top: -.5em 
      // left: -1em
      // // transition: all 0.5s 
      // height: .5em
      // width: .5em
      // background-color: #54a6d9
      // border: .1em solid #d5e9f6
      // content: attr(data-level)
      // display: flex
      // border-radius: 50%

</style>
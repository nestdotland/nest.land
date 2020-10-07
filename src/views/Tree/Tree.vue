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

    &:before
      position: absolute
      top: 0
      left: 0
      display: block
      float: left
      content: ''
      width: 1em
      height: 1.5em
      border-left: 1px solid #ccc
      border-bottom: 1px solid #ccc

    &:after
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

    &.node-tree
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
  	  			max-height: 999px 

  	  		& ~ label 
  	  			&::after 
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
  	display: block 
  	width: 100% 
  	cursor: pointer 

  input[type=checkbox] 
  	display: none 

  label 
  	&::after 
  		content: "\25b6" 
  		position: absolute 
  		top: 0 
  		right: 0 
  		transition: all 0.5s 
</style>
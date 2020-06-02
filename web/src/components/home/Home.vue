<template>
  <div>
    <hero></hero>
    <gradient-bar></gradient-bar>
    <intro></intro>
    <!-- <featured-packages></featured-packages>  Disabling for now. Will add back after release when more packages are added.  -->
    <docs></docs>
  </div>
</template>

<script>
import Hero from "./Hero";
import GradientBar from "../GradientBar";
import Intro from "./Intro";
// import FeaturedPackages from "./FeaturedPackages";
import Docs from "./Docs";

export default {
  components: {
    Hero,
    GradientBar,
    Intro,
    // FeaturedPackages,
    Docs
  }
};
</script>

<style scoped>
</style>
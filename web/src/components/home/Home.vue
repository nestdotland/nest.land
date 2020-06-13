<template>
  <div>
    <hero></hero>
    <gradient-bar></gradient-bar>
    <intro></intro>
    <!-- <featured-packages></featured-packages>  Disabling for now. Will add back after release when more packages are added.  -->
    <f-a-q></f-a-q>
    <request-key></request-key>
    <docs></docs>
  </div>
</template>

<script>
import Hero from "./Hero";
import GradientBar from "../GradientBar";
import Intro from "./Intro";
// import FeaturedPackages from "./FeaturedPackages";
import FAQ from "./FAQ";
import RequestKey from "./RequestKey";
import Docs from "./Docs";

export default {
  components: {
    Hero,
    GradientBar,
    Intro,
    // FeaturedPackages,
    FAQ,
    RequestKey,
    Docs,
  },
};
</script>

<style scoped>
</style>
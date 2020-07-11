<template>
  <div>
    <hero></hero>
    <gradient-bar></gradient-bar>
    <intro></intro>
    <!-- <featured-packages></featured-packages>  Disabling for now. Will add back after release when more packages are added.  -->
    <f-a-q></f-a-q>
    <testimonial></testimonial>
    <request-key></request-key>
  </div>
</template>

<script>
import Hero from "./Hero";
import GradientBar from "../GradientBar";
import Intro from "./Intro";
// import FeaturedPackages from "./FeaturedPackages";
import FAQ from "./FAQ";
import Testimonial from "./Testimonial";
import RequestKey from "./RequestKey";

export default {
  components: {
    Hero,
    GradientBar,
    Intro,
    // FeaturedPackages,
    FAQ,
    Testimonial,
    RequestKey,
  },
};
</script>

<style scoped>
</style>
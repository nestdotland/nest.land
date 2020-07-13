<template>
  <div>
    <hero></hero>
    <gradient-bar></gradient-bar>
    <intro></intro>
    <!--<featured-packages></featured-packages> TODO: back-end function to get popular packages -->
    <f-a-q></f-a-q>
    <testimonial></testimonial>
    <request-key></request-key>
  </div>
</template>

<script>
  import Hero from "../components/home/Hero";
  import GradientBar from "../components/GradientBar";
  import Intro from "../components/home/Intro";
  //import FeaturedPackages from "../components/home/FeaturedPackages";
  import FAQ from "../components/home/FAQ";
  import Testimonial from "../components/home/Testimonial";
  import RequestKey from "../components/home/RequestKey";

  export default {
    name: "Home",
    components: {
      Hero,
      GradientBar,
      Intro,
      //FeaturedPackages,
      FAQ,
      Testimonial,
      RequestKey,
    },
  };
</script>
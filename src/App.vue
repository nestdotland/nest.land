<template>
  <div id="app">
    <nest-nav></nest-nav>
    <hero></hero>
    <gradient-bar></gradient-bar>
    <intro></intro>
    <featured-packages></featured-packages>
    <docs></docs>
    <nest-footer></nest-footer>
  </div>
</template>

<script>
import Hero from "./components/Hero";
import NestNav from "./components/Nav";
import GradientBar from "./components/GradientBar";
import Intro from "./components/Intro";
import FeaturedPackages from "./components/FeaturedPackages";
import Docs from "./components/Docs";
import NestFooter from "./components/Footer";

export default {
  name: 'App',
  components: {
    Hero,
    NestNav,
    GradientBar,
    Intro,
    FeaturedPackages,
    Docs,
    NestFooter
  }
}
</script>

<style>

</style>

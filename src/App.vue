<template>
  <div id="app">
    <d-p-m-nav></d-p-m-nav>
    <hero></hero>
    <gradient-bar></gradient-bar>
    <intro></intro>
    <docs></docs>
    <d-p-m-footer></d-p-m-footer>
  </div>
</template>

<script>
import Hero from "./components/Hero";
import DPMNav from "./components/Nav";
import GradientBar from "./components/GradientBar";
import Intro from "./components/Intro";
import Docs from "./components/Docs";
import DPMFooter from "./components/Footer";

export default {
  name: 'App',
  components: {
    Hero,
    DPMNav,
    GradientBar,
    Intro,
    Docs,
    DPMFooter
  }
}
</script>

<style>

</style>

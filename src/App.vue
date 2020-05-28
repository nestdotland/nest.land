<template>
  <div id="app">
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
import GradientBar from "./components/GradientBar";
import Intro from "./components/Intro";
import FeaturedPackages from "./components/FeaturedPackages";
import Docs from "./components/Docs";
import NestFooter from "./components/Footer";

export default {
  name: "App",
  components: {
    Hero,
    GradientBar,
    Intro,
    FeaturedPackages,
    Docs,
    NestFooter
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@800&display=swap");
@import url("https://fonts.googleapis.com/css?family=Inconsolata");

.nest-gradient-hero {
  background: linear-gradient(271deg, #22c1c3, #fdbb2d);
  background-size: 400% 400%;

  -webkit-animation: nestGradient 6s ease infinite;
  -moz-animation: nestGradient 6s ease infinite;
  animation: nestGradient 6s ease infinite;
}

@-webkit-keyframes nestGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@-moz-keyframes nestGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes nestGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

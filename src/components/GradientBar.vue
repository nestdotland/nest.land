<template>
  <hr>
</template>

<script>
  export default {
    name: "GradientBar",
  }
</script>

<style scoped>
  hr {
    background: linear-gradient(271deg, #22c1c3, #fdbb2d);
    background-size: 400% 400%;
    -webkit-animation: nestGradient 6s ease infinite;
    -moz-animation: nestGradient 6s ease infinite;
    animation: nestGradient 6s ease infinite;
    height: 25px;
    margin: 0;
    padding: 0;
  }
</style>
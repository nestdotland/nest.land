<template>
  <div class="hero is-medium is-light is-bold">
    <div class="hero-body">
      <div class="container">
        <h1 class="title is-1" id="hero-text">
          A package manager for
          <span id="deno-text">Deno</span>,
          <br />on the
          <a class="gradient-text" href="https://www.arweave.org/">permaweb</a>
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Hero"
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@800&display=swap");

.gradient-text {
  background: -webkit-linear-gradient(45deg, #22c1c3, #fdbb2d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
#deno-text {
  letter-spacing: -0.025em;
  font-family: "Inter", sans-serif;
  font-weight: 800;
}
</style>
<template>
  <div class="hero is-medium is-light is-bold" style="position: relative">
    <dino-footprints class="footprints is-hidden-mobile"></dino-footprints>
    <div class="hero-head">
      <nest-nav></nest-nav>
    </div>
    <div class="hero-body">
      <div class="container">
        <transition name="slide-up" type="animation" appear>
          <h1 class="title is-1" id="hero-text">
            A package registry for
            <span id="deno-text">Deno</span>,
            <br />on the
            <a class="gradient-text" href="https://www.arweave.org/">permaweb</a>
          </h1>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import DinoFootprints from "../../assets/footprints.svg";
import NestNav from "../Nav";

export default {
  name: "Hero",
  components: {
    DinoFootprints,
    NestNav
  }
};
</script>

<style scoped>
.gradient-text {
  background: -webkit-linear-gradient(45deg, #22c1c3, #fdbb2d);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
#deno-text {
  letter-spacing: -0.025em;
  font-family: "Inter", sans-serif;
  font-weight: 800;
}
.footprints {
  position: absolute;
  bottom: 0;
  right: -40%;
}
</style>
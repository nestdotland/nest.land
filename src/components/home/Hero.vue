<template>
  <div class="hero is-medium is-light is-bold nest-footprints-hero">
    <div class="hero-head">
      <div
        class="notification is-primary is-light"
        v-if="showGhDiscussionsNotification"
      >
        Post about your module(s) or discuss ideas with us on our new
        <a href="https://github.com/nestdotland/nest.land/discussions">
          GitHub Discussions
        </a>
        tab!
      </div>
      <nest-nav></nest-nav>
    </div>
    <div class="hero-body">
      <div class="container">
        <transition name="slide-up" type="animation" appear>
          <h1 class="title is-1" id="hero-text">
            A module registry for
            <!-- <span id="deno-text">Deno</span>, <br /> -->
            <a class="gradient-text" href="https://deno.land/">
              Deno
            </a>

            on the
            <a class="gradient-text" href="https://www.arweave.org/">
              blockchain
            </a>
          </h1>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import NestNav from "../Nav";

export default {
  name: "Hero",
  components: {
    NestNav,
  },
  data() {
    return { showGhDiscussionsNotification: true };
  },
  created() {
    if (
      localStorage.getItem("ghDiscussionsShown") !== null &&
      localStorage.getItem("ghDiscussionsShown") === "true"
    )
      this.showGhDiscussionsNotification = false;
    localStorage.setItem("ghDiscussionsShown", true);
  },
};
</script>

<style lang="sass" scoped>
.gradient-text
  background: -webkit-linear-gradient(45deg, #22c1c3, #fdbb2d)
  background-clip: text
  -webkit-background-clip: text
  -webkit-text-fill-color: transparent

  #deno-text
    letter-spacing: -0.025em
    font-family: "Inter", sans-serif
    font-weight: 800

  .footprints
    position: absolute
    bottom: 0
    right: -40%
</style>

<template>
  <div>
      <div class="hero is-dark is-bold is-large">
          <div class="hero-head">
              <nest-nav></nest-nav>
          </div>
          <div class="hero-body">
              <div class="container">
                  <h1 class="title is-1">
                        Introducing (name_here)
                  </h1>
                  <p class="subtitle">
                      A profit sharing token for <b>nest.land</b>
                  </p>
              </div>
          </div>
      </div>
      <div class="hero is-medium is-light">
          <div class="hero-body">
              <div class="container">
                  <h1 class="title">
                      What is a <i>"PST"</i>?
                  </h1>
              </div>
          </div>
      </div>
      <div class="hero is-medium">
          <div class="hero-body">
              <div class="container">
                  <h1 class="title">
                      How to use them
                  </h1>
              </div>
          </div>
      </div>
      <div class="hero is-medium is-light">
          <div class="hero-body">
              <div class="container">
                  <h1 class="title">
                      Token Metrics
                  </h1>
              </div>
          </div>
      </div>
      <div class="hero is-medium">
          <div class="hero-body">
              <div class="container">
                  <h1 class="title">
                      How to Purchase (name_here)
                  </h1>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import NestNav from "../components/Nav";

export default {
    components: {
        NestNav
    }
}
</script>

<style lang="sass" scoped>

</style>
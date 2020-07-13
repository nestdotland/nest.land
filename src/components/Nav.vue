<template>
  <transition name="slide-down" type="animation" appear>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/">
          <img src="../assets/nest_light.png" />
        </router-link>
        <a
          role="button"
          class="navbar-burger burger"
          :class="burgerClass"
          aria-label="menu"
          aria-expanded="false"
          data-target="main-nav"
          @click="toggleBurger"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="main-nav" class="navbar-menu" :class="burgerClass">
        <div class="navbar-end">
          <router-link
            class="navbar-item has-text-dark"
            to="/gallery"
            active-class="active-link"
            exact
          >The Gallery</router-link>
          <a
             class="navbar-item has-text-dark"
             href="https://docs.nest.land"
             target="_blank"
             rel="noopener noreferrer"
          >Documentation</a>
          <div class="navbar-item">
            <div class="buttons">
              <router-link class="button is-light is-primary" id="get-started-button" to="/#start">
                <strong>Get Started</strong>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </transition>
</template>

<script>
  export default {
    name: "NestNav",
    data() {
      return {
        burgerToggled: false,
        burgerClass: "",
      };
    },
    methods: {
      toggleBurger() {
        if (this.burgerToggled) {
          this.burgerToggled = false;
          this.burgerClass = "";
        } else {
          this.burgerToggled = true;
          this.burgerClass = "is-active";
        }
      },
    },
  };
</script>

<style lang="sass" scoped>

  #get-started-button
    font-family: "Inconsolata", monospace

  .navbar-item:hover,
  .navbar-item:focus,
  .navbar-item:focus-within,
  .navbar-burger
    background: none !important

  .navbar-item.active-link
    border-top: .4rem solid #fdbb2d
    padding-top: .1rem

</style>
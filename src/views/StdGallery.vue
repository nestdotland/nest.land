<template>
  <div class="gallery">
    <div class="hero is-medium is-light nest-footprints-hero">
      <div class="hero-head">
        <nest-nav></nest-nav>
      </div>
      <div class="hero-body">
        <transition name="slide-up" type="animation" appear>
          <div class="container">
            <div class="std-hero">
              <denologo />
              <div class="std-description">
                <h1 class="title is-1">The Std Gallery <span class="std-version">{{ version }}</span></h1>
                <p class="subtitle">This is a mirror of Deno's Standard Modules. The code itself is not maintained, modified, or updated by nest.land. New versions are published when they are released by Deno. <br>These modules do not have external dependencies and they are reviewed by the Deno core team. The intention is to have a standard set of high quality code that all Deno projects can use fearlessly.</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <gradient-bar></gradient-bar>
    <div class="hero is-light is-medium" v-show="modules.length === 0 || loading">
      <div class="hero-body">
        <div class="container">
          <h1 v-show="loading" class="title is-3 has-text-centered">Loading std modules... 🥚</h1>
          <h1
            v-show="modules.length === 0 && !loading"
            class="title is-3 has-text-centered"
          >Error indexing std modules 🥚</h1>
        </div>
      </div>
    </div>
    <div class="hero is-light is-small">
      <div class="hero-body">
        <div class="container">
          <!--<transition-group name="gallery-cards" tag="div" class="columns is-multiline">
            <div class="column is-3" v-for="p in shownPackages" :key="timeToInt(p.createdAt)">
              <card :item="p"></card>
            </div>
          </transition-group>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import NestNav from "../components/Nav";
  import GradientBar from "../components/GradientBar";
  import denologo from "../assets/deno.svg";
  //import Card from "../components/Card";
  //import axios from "axios";

  export default {
    name: "StdGallery",
    components: {
      NestNav,
      GradientBar,
      //Card,
      denologo,
    },
    data () {
      return {
        modules: [],
        searchPhrase: '',
        loading: true,
        version: '1.0.0',
      };
    },
    async created () {

    },
    methods: {
      async getModules () {

      }
    },
  }
</script>

<style lang="sass" scoped>
  .hero.is-light .title
    margin-bottom: .5em

    span.std-version
      font-size: .45em
      vertical-align: super
      font-family: "Inconsolata", monospace

  .title:not(.is-spaced) + .subtitle
    margin: 0

  .hero .container .std-hero
    display: flex
    align-items: center
    justify-content: space-between

    svg
      width: 17%

    .std-description
      width: 78%
</style>
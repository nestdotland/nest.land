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
                <h1 class="title is-1">The std gallery <span class="std-version">{{ version }}</span></h1>
                <p class="subtitle">This is a mirror of <a href="https://deno.land/std" target="_blank" rel="noopener noreferrer">Deno's Standard Modules</a>. The code itself is not maintained, modified, or updated by nest.land. New versions are published when they are released by Deno. <br>These modules do not have external dependencies and they are reviewed by the Deno core team. The intention is to have a standard set of high quality code that all Deno projects can use fearlessly. <br>Read more about it in their <a href="https://github.com/denoland/deno/tree/master/std" target="_blank" rel="noopener noreferrer">repo</a>.</p>
              </div>
            </div>
            <div class="std-info">
              <p>Published by the <span>nest.land team</span> on 05/10/2020</p>
              <div class="select is-light has-light-arrow is-fullwidth">
                <select v-model="version">
                  <option value="1.0.0">1.0.0</option>
                  <option value="0.0.9">0.0.9</option>
                </select>
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

  .subtitle
    text-shadow: -1px 9px 8px rgba(50, 50, 93, .12), 0 5px 15px rgba(0, 0, 0, .18)

  .title:not(.is-spaced) + .subtitle
    margin: 0

  .hero .container .std-hero
    display: flex
    align-items: center
    justify-content: space-between
    margin-bottom: 2em

    @media screen and (max-width: $mobileScreenMaxWidth)
      display: block

    svg
      width: 17%

      @media screen and (max-width: $mobileScreenMaxWidth)
        display: none

    .std-description
      width: 78%

      a
        color: $accentColor

      @media screen and (max-width: $mobileScreenMaxWidth)
        width: 100%

        span.std-version
          display: block

  .std-info 
    display: flex
    align-items: center
    justify-content: space-between

    p
      color: $accentColor

      span
        border-bottom: 1px solid $accentColor

    .select
      width: 120px

</style>
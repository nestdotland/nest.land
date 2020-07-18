<template>
  <div class="gallery">
    <div class="hero is-medium is-light nest-footprints-hero"> 
      <div class="hero-head">
        <nest-nav></nest-nav>
      </div>
      <div class="hero-body">
        <transition name="slide-up" type="animation" appear>
          <div class="container">
            <div class="columns is-vcentered">
              <div class="column is-2">
                <denologo />
              </div>
              <div class="column is-10">
                <div class="std-description">
                  <h1 class="title is-2">Deno Standard Library <span class="std-version">{{ version }}</span></h1>
                  <p class="subtitle">An immutable, decentralized mirror of Deno's Standard Modules</p>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="hero-foot">
        <nav class="tabs is-boxed is-fullwidth">
          <div class="container">
            <ul>
              <li>
                <a href="https://github.com/nestdotland/std" class="no-hover">
                  <font-awesome-icon :icon="['fab', 'github']" />
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
    <gradient-bar></gradient-bar>
    <div class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column is-half">
              <p class="is-uppercase">Latest Publish: 05/10/2020</p>
            </div>
            <div class="column is-half">
              <div class="select is-light has-light-arrow version-select">
                <select v-model="version">
                  <option v-for="stdVersion in versions" :key="stdVersion.id" :value="stdVersion">{{ stdVersion }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column is-3" v-for="mod in modules" :key="mod.id">
              <card :item="compileToModule(mod)" :std="true"></card>
            </div>
          </div>
          <h1 v-show="loading" class="title is-3 has-text-centered">Loading std modules... 🥚</h1>
          <h1
            v-show="modules.length === 0 && !loading"
            class="title is-3 has-text-centered"
          >Error indexing std modules 🥚</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import NestNav from "../components/Nav";
  import GradientBar from "../components/GradientBar";
  import denologo from "../assets/deno.svg";
  import Card from "../components/Card";
  import axios from "axios";
  import * as semverSort from "semver/functions/sort";

  export default {
    name: "StdGallery",
    components: {
      NestNav,
      GradientBar,
      Card,
      denologo,
    },
    data () {
      return {
        modules: [],
        searchPhrase: '',
        loading: true,
        version: "1.0.0",
        versions: [],
      };
    },
    async created () {
      //TODO: replace this to std before merge
      await axios
        .get("https://x.nest.land/api/package/std-test")
        .then(res => {
          this.versions = this.sortPackages(res.data.packageUploadNames);
          this.version = this.versions[0];
        });
      await this.getModules();
      this.loading = false;
    },
    methods: {
      async getModules () {
        //TODO: replace this to std before merge
        await axios
          .get(`https://x.nest.land/api/package/std-test/${ this.version }`)
          .then(res => {
            for(const file in res.data.files) {
              if(file.split("/")[1] === undefined) continue;
              const firstDirName = file.split("/")[1];
              //checking if it is a json/readme/.ts file or is an empty dir and continuing
              if(firstDirName === "README.md" || firstDirName.includes(".ts") || firstDirName.includes(".json") || firstDirName === "" || firstDirName === "..") continue;
              if(!this.modules.includes(firstDirName))
                this.modules.push(firstDirName);
            }
          });
      },
      sortPackages(packageList) {
        for (let i = 0; i < packageList.length; i++) {
          packageList[i] = packageList[i].split("@")[1];
        }
        return semverSort(packageList).reverse();
      },
      compileToModule(mod) {
        return { name: mod, description: `A library by Deno authors for ${ mod }`, version: this.version };
      },
    },
    watch: {
      async version () {
        this.loading = true;
        await this.getModules();
        this.loading = false;
      }
    }
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

  .version-select
    float: right;

  .no-hover:hover
    background: none !important

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
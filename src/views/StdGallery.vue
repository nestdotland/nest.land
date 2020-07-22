<template>
  <div class="gallery">
    <div class="hero is-medium is-light nest-footprints-hero">
      <div class="hero-head">
        <nest-nav />
      </div>
      <div class="hero-body">
        <transition name="slide-up" type="animation" appear>
          <div class="container">
            <div class="columns is-vcentered">
              <div class="column is-2 is-hidden-mobile">
                <denologo />
              </div>
              <div class="column">
                <div class="std-description">
                  <h1 class="title is-2">
                    Deno Standard Library
                    <span class="std-version">{{ version }}</span>
                  </h1>
                  <p class="subtitle">
                    An immutable, decentralized mirror of Deno's Standard
                    Modules
                  </p>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="hero-foot">
        <nav class="tabs is-boxed is-fullwidth has-text-centered">
          <div class="container">
            <ul class="no-flex">
              <li>
                <a class="no-hover" href="https://github.com/nestdotland/std">
                  <font-awesome-icon :icon="['fab', 'github']" />
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
    <gradient-bar />
    <div class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-mobile">
            <div class="column is-half">
              <p class="is-uppercase">
                Latest Publish: {{ latestPublish }} (<span
                  :style="{ color: isOutdated ? '#ff0000' : '#00947e' }"
                  >{{ isOutdated ? 'Outdated' : 'Up to date' }}</span
                >)
              </p>
            </div>
            <div class="column is-half">
              <div class="select is-light has-light-arrow version-select">
                <select v-model="version">
                  <option
                    v-for="stdVersion in versions"
                    :key="stdVersion.id"
                    :value="stdVersion"
                    >{{ stdVersion }}</option
                  >
                </select>
              </div>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column is-3" v-for="mod in modules" :key="mod.id">
              <card :item="compileToModule(mod)" :std="true"></card>
            </div>
          </div>
          <h1 v-show="loading" class="title is-3 has-text-centered">
            Loading std modules... 🥚
          </h1>
          <h1
            v-show="modules.length === 0 && !loading"
            class="title is-3 has-text-centered"
          >
            Error indexing std modules 🥚
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NestNav from '../components/Nav';
import GradientBar from '../components/GradientBar';
import denologo from '../assets/deno.svg';
import Card from '../components/Card';
import axios from 'axios';
import * as semverSort from 'semver/functions/sort';
import moment from 'moment';

export default {
  name: 'StdGallery',
  components: {
    NestNav,
    GradientBar,
    Card,
    denologo,
  },
  data() {
    return {
      modules: [],
      searchPhrase: '',
      loading: true,
      version: '1.0.0',
      latestPublish: '',
      versions: [],
      isOutdated: false,
    };
  },
  async created() {
    await axios.get('https://x.nest.land/api/package/std').then((res) => {
      this.latestPublish = moment(res.data.updatedAt).format('MMM D, YYYY');
      this.versions = this.sortPackages(res.data.packageUploadNames);
      this.version = this.versions[0];
    });
    await this.getModules();
    this.loading = false;
    //an additional check. this returns if the std published on nest.land is up to date with the latest deno std release on deno.land/std
    axios.get('https://deno.land/std/version.ts').then((res) => {
      const latestStdVersion = res.data.match(
        new RegExp('(?<=(export const VERSION = "))(.*)(?=("))', 'g')
      )[0];
      this.isOutdated = latestStdVersion !== this.version;
    });
  },
  methods: {
    async getModules() {
      await axios
        .get(`https://x.nest.land/api/package/std/${this.version}`)
        .then((res) => {
          for (const file in res.data.files) {
            if (file.split('/')[1] === undefined) continue;
            const firstDirName = file.split('/')[1];
            //checking if it is a json/readme/.ts file or is an empty dir and continuing
            if (
              firstDirName === 'README.md' ||
              firstDirName.includes('.ts') ||
              firstDirName.includes('.json') ||
              firstDirName === '' ||
              firstDirName === '..'
            )
              continue;
            if (!this.modules.includes(firstDirName))
              this.modules.push(firstDirName);
          }
        });
    },
    sortPackages(packageList) {
      for (let i = 0; i < packageList.length; i++) {
        packageList[i] = packageList[i].split('@')[1];
      }
      return semverSort(packageList).reverse();
    },
    compileToModule(mod) {
      return {
        name: mod,
        description: `A library by Deno authors for ${mod}`,
        version: this.version,
      };
    },
  },
  computed: {
    currentYear: () => moment().format('YYYY'),
  },
  watch: {
    async version() {
      this.loading = true;
      await this.getModules();
      this.loading = false;
    },
  },
};
</script>

<style lang="sass" scoped>
.no-flex
  display: block

.mit-license-link
  display: inline-block
  padding: 0
  margin: 0
  color: $accentColor !important

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

<template>
  <div class="gallery">
    <div class="hero is-medium is-light">
      <div class="notification is-danger is-light" v-show="errorMessage !== ''">{{ errorMessage }}</div>
      <div class="hero-head">
        <nest-nav></nest-nav>
      </div>
      <div class="hero-body">
        <div class="container has-text-centered">
          <transition name="slide-up" type="animation" appear>
            <h1 class="title is-2">The Gallery</h1>
          </transition>
          <div class="columns is-centered">
            <div class="column is-half">
              <transition name="fade" type="transition" appear>
                <div class="field">
                  <p class="control has-icons-left">
                    <input
                      class="input is-rounded nest-input"
                      type="text"
                      placeholder="Search for packages"
                      v-model="searchPhrase"
                    />
                    <span class="icon is-small is-left">
                      <font-awesome-icon :icon="['fa', 'search']" />
                    </span>
                  </p>
                </div>
              </transition>
            </div>
          </div>
          <p class="subtitle">
            Trying to add a package? See
            <router-link to="/#start">Getting Started</router-link>.
          </p>
        </div>
      </div>
      <div class="hero-foot">
        <nav class="tabs is-boxed is-fullwidth">
          <div class="container">
            <ul>
              <li class="nest-heading">
                <a class="no-hover">100 Packages</a>
              </li>
              <li class="nest-heading">
                <a class="no-hover">90 Authors</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
    <gradient-bar></gradient-bar>
    <div class="hero is-light is-small">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-multiline">
            <div class="column is-3" v-for="p in shownPackages" v-bind:key="p.id">
              <card v-bind:item="p"></card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NestNav from "../Nav";
import GradientBar from "../GradientBar";
import Card from "../Card";
import { HTTP } from "../../http-common";

export default {
  data() {
    return {
      packages: [],
      searchPhrase: "",
      shownPackages: [],
      errorMessage: "",
    };
  },
  components: {
    NestNav,
    GradientBar,
    Card,
  },
  async created() {
    try {
      const allPackages = await HTTP.get("packages");
      this.packages = allPackages.data;
      this.shownPackages = allPackages.data;
    } catch (err) {
      this.errorMessage = err;
    }
  },
  watch: {
    searchPhrase: function(value) {
      let potentialMatches = [];
      for (let i = 0; i < this.packages.length; i++) {
        if (this.packages[i]._id.search(value) !== -1) {
          potentialMatches.push(this.packages[i]);
        }
      }
      this.shownPackages = potentialMatches;
    },
  },
};
</script>

<style scoped>
.nest-heading {
  font-size: 0.9em;
  font-weight: 400;
  text-transform: uppercase;
}

.no-hover:hover {
  background: none !important;
  border-bottom: 0 !important;
  cursor: default;
}
</style>
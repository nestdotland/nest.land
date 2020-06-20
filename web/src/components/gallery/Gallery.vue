<template>
  <div class="gallery">
    <div class="hero is-medium is-light nest-footprints-hero">
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
                <a class="no-hover">{{ shownPackagesCount }}</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
    <gradient-bar></gradient-bar>
    <div class="hero is-light is-medium" v-show="shownPackages.length === 0 || loading">
      <div class="hero-body">
        <div class="container">
          <h1 v-show="loading" class="title is-3 has-text-centered">Loading packages... 🥚</h1>
          <h1
            v-show="shownPackages.length === 0 && !loading"
            class="title is-3 has-text-centered"
          >Unable to find any packages 🥚</h1>
        </div>
      </div>
    </div>
    <div class="hero is-light is-small">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-multiline">
            <div class="column is-3" v-for="p in shownPackages" :key="p._id">
              <card :item="p"></card>
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
      loading: true,
      searchPhrase: "",
      shownPackages: [],
      shownPackagesCount: "",
      errorMessage: "",
    };
  },
  props: {
    search: {
      type: String,
    },
  },
  components: {
    NestNav,
    GradientBar,
    Card,
  },
  async created() {
    this.debouncedSortPackages = this._.debounce(this.sortPackages, 500);
    try {
      const allPackages = await HTTP.get("packages");
      this.packages = allPackages.data.body;
      console.log(this.packages);
      // TODO [@tbaumer22]: Implement pagination/infinite scrolling
      if (this.search === "") {
        this.shownPackages = allPackages.data.body;
      } else {
        this.searchPhrase = this.search;
      }
      this.refreshPackageCount(allPackages.data.body.length);
      this.loading = false;
    } catch (err) {
      this.errorMessage = err;
    }
  },
  watch: {
    searchPhrase: function() {
      this.debouncedSortPackages();
      this.$router.replace({
        query: {
          search: this.searchPhrase,
        },
      }).catch(() => {});
    },
  },
  methods: {
    sortPackages() {
      let potentialMatches = [];
      for (let i = 0; i < this.packages.length; i++) {
        if (this.packages[i].name.search(this.searchPhrase) !== -1) {
          potentialMatches.push(this.packages[i]);
        }
      }
      this.shownPackages = potentialMatches;
      this.refreshPackageCount(this.shownPackages.length);
    },
    refreshPackageCount(l) {
      if (l === 1) {
        this.shownPackagesCount = l + " Package";
      } else {
        this.shownPackagesCount = l + " Packages";
      }
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
  cursor: default;
}
</style>
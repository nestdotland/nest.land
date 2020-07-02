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
                <a class="no-hover">{{ shownPackagesCount }} packages</a>
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
            <transition-group name="fade" tag="div" class="columns is-multiline">
              <!-- using createdAt time cuz index can't be used as a key here -->
              <div class="column is-3" v-for="p in shownPackages" :key="timeToInt(p.createdAt)">
                <card :item="p"></card>
              </div>
            </transition-group>
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
    try {
      const allPackages = await HTTP.get("packages");
      this.packages = allPackages.data.body;
      // TODO [@tbaumer22]: Implement pagination/infinite scrolling
      this.loading = false;
    } catch (err) {
      this.errorMessage = err;
    }
  },
  computed: {
    shownPackages () {
      return this.packages.filter(({ name }) => name.toLowerCase().includes(this.searchPhrase.toLowerCase()))
    },
    shownPackagesCount () {
      return this.shownPackages.length
    }
  },
  methods: {
    timeToInt (val) {
      return new Date(val).getTime()
    }
  }
};
</script>

<style lang="scss" scoped>
.nest-heading {
  font-size: 0.9em;
  font-weight: 400;
  text-transform: uppercase;
}

.no-hover:hover {
  background: none !important;
  cursor: default;
}
.control .icon.is-small.is-left {
  transition: all .17s;
}
.subtitle {
  width: 30%;
  text-align: center;
  display: inline-block;
  text-shadow: -1px 9px 8px rgba(50, 50, 93, 0.12), 0 5px 15px rgba(0, 0, 0, 0.18);
  @media screen and (max-width: 720px) {
    width: 100%;
  }
  a {
    color: #00947e !important;
    text-shadow: -1px 9px 8px rgba(#00947e, 0.12), 0 5px 15px rgba(#00947e, 0.18);
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
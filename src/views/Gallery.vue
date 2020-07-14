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
                <a class="no-hover">{{ shownPackages.length }} packages shown</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
    <gradient-bar></gradient-bar>
    <div class="hero is-light is-medium" v-show="packages.length === 0 || loading">
      <div class="hero-body">
        <div class="container">
          <h1 v-show="loading" class="title is-3 has-text-centered">Loading packages... 🥚</h1>
          <h1
            v-show="packages.length === 0 && !loading"
            class="title is-3 has-text-centered"
          >Unable to find any packages 🥚</h1>
        </div>
      </div>
    </div>
    <div class="hero is-light is-small">
      <div class="hero-body">
        <div class="container">
          <transition-group name="gallery-cards" tag="div" class="columns is-multiline">
            <!-- using createdAt time because index can't be used as a key here -->
            <div class="column is-3" v-for="p in shownPackages" :key="timeToInt(p.createdAt)">
              <card :item="p"></card>
            </div>
          </transition-group>
          <!-- hack to get if the user scrolled to the bottom -->
          <div class="scrolledToBottom" ref="scrolledToBottom">
            <p v-if="loadingPackages">Loading packages... 🥚</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import NestNav from "../components/Nav";
  import GradientBar from "../components/GradientBar";
  import Card from "../components/Card";
  import axios from "axios";

  export default {
    data() {
      return {
        packages: [],
        shownPackages: [],
        loading: true,
        searchPhrase: "",
        errorMessage: "",
        loadedPackages: 24,
        loadingPackages: false,
        noMorePackages: false,
      };
    },
    props: {
      search: {
        type: String,
        default: "",
      },
    },
    components: {
      NestNav,
      GradientBar,
      Card,
    },
    async created() {
      window.addEventListener("scroll", this.scroll);
      await this.loadPackagesWithLimit();
    },
    destroyed() {
      window.removeEventListener("scroll", this.scroll);
    },
    methods: {
      timeToInt(val) {
        return new Date(val).getTime();
      },
      async loadPackagesWithLimit() {
        this.loadingPackages = true;
        const previousPackagesLength = this.packages.length;
        if (this.search !== "") this.searchPhrase = this.search;
        await axios
          .get(`https://x.nest.land/api/packages/${this.loadedPackages}`)
          .then(response => {
            this.packages = response.data;
            this.shownPackages = this.packages;
            this.loading = false;
            this.loadingPackages = false;
            if (this.packages.length === previousPackagesLength)
              this.noMorePackages = true;
          })
          .catch(err => (this.errorMessage = err));
      },
      async scroll() {
        const {
          top,
          left,
          right,
          bottom,
        } = this.$refs.scrolledToBottom.getBoundingClientRect();
        if (
          top >= 0 &&
          left >= 0 &&
          right <= (window.innerWidth || document.documentElement.clientWidth) &&
          bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          !this.loadingPackages &&
          !this.noMorePackages &&
          this.searchPhrase === ""
        ) {
          this.loadedPackages += 24;
          await this.loadPackagesWithLimit();
        }
      },
    },
    watch: {
      searchPhrase() {
        this.$router
          .replace({ query: { search: this.searchPhrase } })
          .catch(() => {});
        if (this.searchPhrase === "") {
          this.shownPackages = this.packages;
          return;
        }
        axios.get(`https://x.nest.land/api/packages`).then(response => {
          this.shownPackages = response.data.filter(({ name }) =>
            name.toLowerCase().includes(this.searchPhrase.toLowerCase()),
          );
        });
      },
    },
  };
</script>

<style lang="sass" scoped>

  .nest-heading
    font-size: .9em
    font-weight: 400
    text-transform: uppercase

  .no-hover:hover
    background: none !important
    cursor: default

  .control .icon.is-small.is-left
    transition: all .17s

  .subtitle
    width: 30%
    text-align: center
    display: inline-block
    text-shadow: -1px 9px 8px rgba(50, 50, 93, 0.12), 0 5px 15px rgba(0, 0, 0, 0.18)

    @media screen and (max-width: 720px)
      width: 100%

    a
      color: #00947e !important
      text-shadow: -1px 9px 8px rgba(#00947e, 0.12), 0 5px 15px rgba(#00947e, 0.18)

  .scrolledToBottom
    display: block
    padding: 10px 0
    text-align: center

    p
      font-weight: 600

  .gallery-cards-enter-active,
  .gallery-cards-leave-active
    transition: opacity 0.3s

  .gallery-cards-enter,
  .gallery-cards-leave-to
    opacity: 0

  .gallery-cards-move
    transition: transform 0.8s

</style>
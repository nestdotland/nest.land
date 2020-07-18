<template>
  <div>
    <div class="hero is-light is-fullheight" v-show="loading">
      <div class="hero-body">
        <div class="container">
          <h1 class="title has-text-centered">Loading...</h1>
        </div>
      </div>
    </div>
    <div class="hero is-small is-light nest-footprints-hero" v-show="!loading">
      <div class="hero-head">
        <nest-nav></nest-nav>
      </div>
      <div class="hero-body">
        <div class="container">
          <h1 class="title has-text-centered">{{ module }}</h1>
        </div>
      </div>
    </div>
    <div class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="columns reverse-column-order">
            <div class="column is-12">
              <div v-show="moduleReadme === 'Loading README...'">
                <p class="subtitle">A library by Deno authors for {{ module }}</p>
                <hr class="mini-hr" />
              </div>
              <vue-markdown
                :source="moduleReadme"
                :toc="true"
                :toc-anchor-link-space="false"
                class="markdown"
              ></vue-markdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import NestNav from "../components/Nav";
  import VueMarkdown from "vue-markdown";
  import axios from "axios";

  export default {
    components: {
      NestNav,
      VueMarkdown,
    },
    data() {
      return {
        moduleReadme: "Loading README...",
        loading: true,
      };
    },
    props: {
      version: {
        type: String,
        required: true
      },
      module: {
        type: String,
        required: true
      }
    },
    async created() {
      //TODO: replace this to std before merge
      await axios
        .get(`https://x.nest.land/api/package/std-test/${ this.version }`)
        .then(res => {
          if(`/${ this.module }/README.md` in res.data.files) {
            //TODO: replace this to std before merge
            axios
              .get(`https://x.nest.land/std-test@${ this.version }/${ this.module }/README.md`)
              .then(readmeRes => {
                //replace https://deno.land/std urls to https://x.nest.land/std
                this.moduleReadme = readmeRes.data.replace(new RegExp("(http|https)://deno.land/std", "g"), `https://x.nest.land/std-test@${ this.version }`); //TODO: replace this to std before merge
              });
          }else {
            this.moduleReadme = 'No readme available for this std submodule.'
          }
          this.loading = false;
        })
        .catch(() => this.$router.push('/404'));
    },
  };
</script>

<style lang="sass">

  @import "../styles/Markdown"

  .readme
    margin-top: 1.5rem !important

  .markdown
    +markdown()

    h1:first-child
      margin-top: 0
      padding-top: 0

</style>
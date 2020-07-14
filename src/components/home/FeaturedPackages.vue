<template>
  <div class="hero is-medium nest-dots-hero">
    <div class="hero-body" id="featured">
      <div class="container">
        <h1 class="title is-2 has-text-light has-text-centered" id="give-me-space">Featured Modules</h1>
        <div class="columns">
          <div class="column is-3" v-for="m in featuredModules" v-bind:key="m.id">
            <card v-bind:item="m"></card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Card from "../Card";
  import axios from "axios";

  export default {
    name: "FeaturedPackages",
    data() {
      return {
        featuredModules: [],
      };
    },
    components: {
      Card
    },
    async created () {
      //selecting 4 random packages from the last 20 updated packages
      await axios
        .get("https://x.nest.land/api/packages/20")
        .then(response => {
          this.featuredModules = response.data.sort(() => 0.5 - Math.random()).slice(0, 4);
        });
    },
  };
</script>

<style lang="sass" scoped>

  #give-me-space
    margin-bottom: 50px
    color: #363636 !important

</style>
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
          <h1 class="title has-text-centered">{{ $route.params.id }}</h1>
        </div>
      </div>
    </div>
    <div class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column is-8">
              <p class="subtitle">{{ packageInfo.description }}</p>
              <hr class="mini-hr" />
              <h2 class="title is-4 has-text-centered readme">README.md</h2>
              <div class="card is-fullwidth">
                <div class="card-content">{{ packageReadme }}</div>
              </div>
            </div>
            <div class="column is-4">
              <nav class="panel">
                <p class="panel-heading">
                  <font-awesome-icon class="icon-margin-right" :icon="['fas', 'parachute-box']" />Open this package
                </p>
                <div class="panel-block">
                  <div class="buttons has-addons nest-button-group">
                    <button
                      class="button is-primary is-light"
                      @click="selectedVersion = packageInfo.latestStableVersion; refreshContent()"
                    >Latest Stable</button>
                    <button
                      class="button is-warning is-light"
                      @click="selectedVersion = packageInfo.latestVersion; refreshContent()"
                    >Latest</button>
                  </div>
                </div>
                <div class="panel-block">
                  <div class="select is-light has-light-arrow is-fullwidth">
                    <select v-model="selectedVersion" @change="refreshContent()">
                      <option
                        v-for="version in packageInfo.packageUploadNames"
                        :key="version"
                        :value="version"
                      >{{ version }}</option>
                    </select>
                  </div>
                </div>
                <div class="panel-block">
                  <pre class="is-fullwidth"><code>https://x.nest.land/{{ selectedVersion }}</code></pre>
                </div>
              </nav>
              <nav class="panel">
                <p class="panel-heading">
                  <font-awesome-icon class="icon-margin-right" :icon="['fas', 'box-open']" />Package info
                </p>
                <div class="panel-block">Author: {{ packageInfo.owner }}</div>
                <div class="panel-block">Published on: {{ packageInfo.createdAt | formatDate }}</div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NestNav from "../Nav";
import { HTTP } from "../../http-common";
import moment from "moment";

export default {
  components: {
    NestNav,
  },
  data() {
    return {
      packageInfo: Object,
      selectedVersion: "",
      packageReadme: "",
      loading: true,
    };
  },
  filters: {
    formatDate: function(createdAt) {
      if (!createdAt) return "";
      return moment(String(createdAt)).format("LL");
    },
  },
  async created() {
    await this.refreshContent();
    this.selectedVersion = this.packageInfo.latestStableVersion;
    this.loading = false;
  },
  methods: {
    async refreshContent() {
      let packageDataResponse;
      try {
        packageDataResponse = await HTTP.post("package-client", {
          data: {
            name: this.$route.params.id,
          },
        });
        this.packageInfo = packageDataResponse.data.body;
      } catch (err) {
        this.$emit("new-error", err);
      }
    },
  },
};
</script>

<style>
.readme {
  margin-top: 1.5rem !important;
}

.icon-margin-right {
  margin-right: 10px;
}

.has-light-arrow::after {
  border-image-source: linear-gradient(180deg, #22c1c3, #fdbb2d) !important;
  border-image-slice: 1 !important;
}

.nest-button-group {
  margin: 0 auto;
}
.nest-button-group button {
  margin-bottom: 0;
  font-family: "Inconsolata", monospace;
}

pre.is-fullwidth {
  width: 100%;
}
</style>
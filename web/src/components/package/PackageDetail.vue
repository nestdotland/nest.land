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
          <div class="columns reverse-column-order">
            <div class="column is-8">
              <div v-show="packageReadme === 'Loading README...'" >
                <p class="subtitle">{{ packageInfo.description }}</p>
                <hr class="mini-hr" />
              </div>
              <vue-markdown :source="packageReadme" :toc="true" :toc-anchor-link-space="false" class="readme"></vue-markdown>
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
                      @click="selectedVersion = packageInfo.latestStableVersion; refreshContent(); refreshReadme()"
                      :title="packageInfo.latestStableVersion === null ? 'No stable version available yet': null"
                      :disabled="packageInfo.latestStableVersion === null"
                    >Stable</button>
                    <button
                      class="button is-warning is-light"
                      @click="selectedVersion = packageInfo.latestVersion; refreshContent(); refreshReadme()"
                      :disabled="noVersion"
                      :title="noVersion ? 'No versions published yet': null"
                    >Latest</button>
                  </div>
                </div>
                <div class="panel-block">
                  <div class="select is-light has-light-arrow is-fullwidth" v-if="!noVersion">
                    <select v-model="selectedVersion" @change="refreshContent(); refreshReadme()">
                      <option
                        v-for="(version, id) in packageVersions"
                        :key="id"
                        :value="$route.params.id + '@' + version"
                      >{{ $route.params.id + '@' + version }}</option>
                    </select>
                  </div>
                  <p v-if="noVersion">No version available</p>
                </div>
                <div class="panel-block" v-if="!noVersion">
                  <pre class="is-fullwidth"><code>https://x.nest.land/{{ selectedVersion }}/mod.ts</code></pre>
                </div>
              </nav>
              <nav class="panel">
                <p class="panel-heading">
                  <font-awesome-icon class="icon-margin-right" :icon="['fas', 'box-open']" />Package info
                </p>
                <div class="panel-block">Author: {{ packageInfo.owner }}</div>
                <a v-if="packageInfo.repository !== '' && packageInfo.repository !== null" class="panel-block" :href="packageInfo.repository">Repository</a>
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
import VueMarkdown from "vue-markdown";
import * as semverSort from "semver/functions/sort";

export default {
  components: {
    NestNav,
    VueMarkdown
  },
  data() {
    return {
      packageInfo: Object,
      selectedVersion: "",
      packageVersions: [],
      packageReadme: "Loading README...",
      loading: true,
      noVersion: false,
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
    if(this.selectedVersion === null)
      this.selectedVersion = this.packageInfo.latestVersion;
    if(this.packageInfo.latestStableVersion === null && this.packageInfo.latestVersion === null && this.packageInfo.packageUploadNames.length === 0) {
      this.packageReadme = '# No version published yet';
      this.noVersion = true;
    }
    await this.refreshReadme();
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
        this.packageVersions = this.sortPackages(this.packageInfo.packageUploadNames);
      } catch (err) {
        this.$emit("new-error", err);
      }
    },
    async refreshReadme() {
      if(this.noVersion)
        return;
      try {
        console.log("FETCHING");
        const url = "https://x.nest.land/" + this.selectedVersion + "/README.md";
        console.log(url)
        const readmeResponse = await fetch(url, {
          method: "GET",
          redirect: "follow"
        });
        this.packageReadme = await readmeResponse.text();
      } catch (err) {
        this.$emit("new-error", err);
      }
    },
    sortPackages(packageList) {
      for (let i = 0; i < packageList.length; i++) {
        packageList[i] = packageList[i].split("@")[1];
      }
      return semverSort(packageList).reverse();
    }
  },
};
</script>

<style lang="scss">

@import "../../styles/Markdown.sass";

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

.readme {
  :first-child {
    margin-top: 0;
    padding-top: 0;
  }
  @include markdown();
}
</style>
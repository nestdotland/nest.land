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

          <div class="columns reverse-column-order" v-if="!isFileBrowse">
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
                <router-link v-if="!noVersion" class="panel-block" :to="$route.path + '/files/'">Browse files</router-link>
                <div class="panel-block">Published on: {{ packageInfo.createdAt | formatDate }}</div>
              </nav>
            </div>

          </div>

          <div class="fileSystem" v-else-if="!noVersion">

            <nav class="panel">

              <p class="panel-heading">

                <font-awesome-icon class="icon-margin-right" :icon="['fa', 'folder']" />Browse package files

              </p>

              <router-link class="panel-block" :to="'/package/' + $route.params.id"><font-awesome-icon class="icon-margin-right" :icon="['fa', 'level-up-alt']" />Go back to package review</router-link>

              <router-link class="panel-block fileItem" v-for="dir in currentDirectories" :to="{ path: removeSlashFunc(dir) }" :key="dir.id" append><font-awesome-icon class="icon-margin-right" :icon="['fa', 'folder']" />{{ dir | removeSlash }}</router-link>
              <router-link class="panel-block fileItem" v-for="file in currentFiles" :to="{ path: file.fileName }" :key="file.id" append><font-awesome-icon class="icon-margin-right" :icon="['fa', getFileItemType(file.fileName) === 'md' ? 'book-open' : 'file-code']" />{{ file.fileName }}</router-link>

            </nav>

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
import axios from "axios";

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
      files: {},
    };
  },
  filters: {
    formatDate: function(createdAt) {
      if (!createdAt) return "";
      return moment(String(createdAt)).format("LL");
    },
    removeSlash (val) {

      return val.replace(new RegExp('/', 'g'), '')

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

    if(this.isFileBrowse) {

      await axios
        .get(`https://x.nest.land/api/package/${ this.packageInfo.name }/${ this.selectedVersion.split('@')[1] }`)
        .then(response => this.files = response.data.files)

    }

  },
  computed: {

    isFileBrowse () {

      return this.$route.path.toLowerCase().includes('/files/')

    },
    filesLocation () {

      return this.$route.path.split('/files')[1]

    },
    fileSystem () {

      let fileSystemData = []

      for(const file in this.files) {

        const
          fileName = file.split('/')[file.split('/').length - 1],
          fileLocation = file.replace(fileName, '')

        fileSystemData.push({ fileName, fileLocation })

      }

      return fileSystemData

    },
    currentFiles () {

      return this.fileSystem.filter(file => {

        return file.fileLocation === this.filesLocation

      })

    },
    currentDirectories () {

      const dirs = []

      for(const file of this.fileSystem)
        if(!dirs.includes(file.fileLocation) && file.fileLocation !== this.filesLocation && file.fileLocation.includes(this.filesLocation) && ((file.fileLocation.replace(this.filesLocation, '').match(new RegExp('/', 'g')) || []).length === 1 || (file.fileLocation.replace(this.filesLocation + '/', '').match(new RegExp('/', 'g')) || []).length === 1))
          dirs.push(file.fileLocation)

      return dirs

    }

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
    },
    getFileItemType (fileName) {

      if(fileName.split('.').length < 1)
        return 'dir'

      return fileName.split('.')[fileName.split('.').length - 1]

    },
    removeSlashFunc (val) {

      return val.replace(new RegExp('/', 'g'), '')

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

.fileSystem .panel-block {
  padding: 0.5em 1.25em;
}

.fileSystem .fileItem {
  padding: 0.5em 1.75em;
}
</style>
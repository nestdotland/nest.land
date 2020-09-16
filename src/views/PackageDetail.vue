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
        <nest-nav />
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
              <Tree></Tree>
              <div v-show="packageReadme === 'Loading README...'">
                <p class="subtitle">{{ packageInfo.description }}</p>
                <hr class="mini-hr" />
              </div>
              <div class="Warning" v-if="malicious">
                <font-awesome-icon :icon="['fa', 'exclamation-triangle']" />
                <p>
                  This module is flagged as
                  <b>malicious</b>. Do not use it in
                  your projects!
                </p>
              </div>
              <vue-markdown
                :source="packageReadme"
                :toc="true"
                :toc-anchor-link-space="false"
                class="markdown"
                v-if="!isFileBrowse"
              ></vue-markdown>
              <FileExplorer
                :version="selectedVersion"
                :name="packageInfo.name"
                v-else-if="!noVersion"
              />
            </div>
            <div class="column is-4">
              <nav class="panel">
                <p class="panel-heading">
                  <font-awesome-icon class="icon-margin-right" :icon="['fas', 'parachute-box']" />Use this module
                </p>
                <div class="panel-block">
                  <div class="buttons has-addons nest-button-group">
                    <button
                      class="button is-primary is-light"
                      @click="
                        selectedVersion = packageInfo.latestStableVersion;
                        refreshContent();
                        refreshReadme();
                      "
                      :title="
                        packageInfo.latestStableVersion === null
                          ? 'No stable version available yet'
                          : null
                      "
                      :disabled="packageInfo.latestStableVersion === null"
                    >Stable</button>
                    <button
                      class="button is-warning is-light"
                      @click="
                        selectedVersion = packageInfo.latestVersion;
                        refreshContent();
                        refreshReadme();
                      "
                      :disabled="noVersion"
                      :title="noVersion ? 'No versions published yet' : null"
                    >Latest</button>
                  </div>
                </div>
                <div class="panel-block">
                  <div class="select is-light has-light-arrow is-fullwidth" v-if="!noVersion">
                    <select
                      v-model="selectedVersion"
                      @change="
                        refreshContent();
                        refreshReadme();
                      "
                    >
                      <option
                        v-for="(version, id) in packageVersions"
                        :key="id"
                        :value="$route.params.id + '@' + version"
                      >{{ $route.params.id + "@" + version }}</option>
                    </select>
                  </div>
                  <p v-if="noVersion">No version available</p>
                </div>
                <div class="panel-block entryURL" v-if="!noVersion">
                  <pre class="is-fullwidth">
                    <font-awesome-icon
  :class="{ 'icon-margin-right': true, 'copyEntry': true, copied }"
  @click="copyPackageEntry"
  :icon="['fa', (copied ? 'check-square' : 'copy')]"
  title="Click to copy"
/>
                    <code>{{ entryURL }}</code>
                  </pre>
                </div>
              </nav>
              <nav class="panel">
                <p class="panel-heading">
                  <font-awesome-icon class="icon-margin-right" :icon="['fas', 'box-open']" />Module info
                </p>
                <div class="panel-block">
                  <font-awesome-icon class="icon-margin-right" :icon="['fa', 'user']" />
                  {{ packageInfo.owner }}
                </div>
                <a
                  v-if="
                    packageInfo.repository !== '' &&
                    packageInfo.repository !== null
                  "
                  class="panel-block"
                  :href="packageInfo.repository"
                >
                  <font-awesome-icon class="icon-margin-right" :icon="['fa', 'code-branch']" />Repository
                </a>
                <router-link
                  v-if="!noVersion"
                  class="panel-block"
                  :to="'/package/' + $route.params.id + '/files'"
                >
                  <font-awesome-icon class="icon-margin-right" :icon="['fa', 'folder']" />Browse files
                </router-link>
                <a target="_blank"
                  :href="linkToViewBlockIO"
                  class="panel-block">
                  <font-awesome-icon class="icon-margin-right" :icon="['fa', 'calendar-alt']" />
                  Published on: {{ packageInfo.createdAt | formatDate }}
                </a>
              </nav>
              <nav class="panel">
                <p class="panel-heading">
                  <font-awesome-icon class="icon-margin-right" :icon="['fas', 'shield-alt']" />Audit
                </p>
                <div class="panel-block warning" v-if="malicious">
                  <font-awesome-icon class="icon-margin-right" :icon="['fa', 'biohazard']" />Flagged as malicious
                </div>
                <a
                  class="panel-block"
                  :href="
                    'https://github.com/nestdotland/nest.land/issues/new?labels=malicious-module&template=report_malicious_module.md&title=%5BMODULE+REPORT%5D%20Malicious%20module:%20' +
                    $route.params.id
                  "
                  target="_blank"
                  rel="noopener noreferrer"
                  v-else
                >
                  <font-awesome-icon class="icon-margin-right" :icon="['fa', 'flag']" />Report malicious module
                </a>
              </nav>
              <nav class="panel">
                <p class="panel-heading">
                  <font-awesome-icon class="icon-margin-right" :icon="['fa', 'boxes']" />Dependencies
                </p>
                <div class="panel-block">
                  <font-awesome-icon class="icon-margin-right" :icon="['fa', 'external-link-alt']" />
                  5 external dependencies
                </div>
                <div class="panel-block">
                  <font-awesome-icon class="icon-margin-right" :icon="['fa', 'file-import']" />
                  36 imports
                </div>
                <Tree></Tree>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NestNav from "../components/Nav";
import Tree from "./Tree"
import { HTTP } from "../http-common";
import moment from "moment";
import * as semverSort from "semver/functions/sort";
import VueMarkdown from "vue-markdown";
import FileExplorer from "../components/package/FileExplorer";
import axios from "axios";
// import { dependencyTree } from "./DependencyTree";

export default {
  components: {
    NestNav,
    VueMarkdown,
    FileExplorer,
    Tree
  },
  data() {
    return {
      packageInfo: Object,
      linkToViewBlockIO: "",
      selectedVersion: "",
      packageVersions: [],
      packageReadme: "Loading README...",
      loading: true,
      noVersion: false,
      entryFile: "/mod.ts",
      malicious: false,
      copied: false,
    };
  },
  props: {
    v: {
      type: String,
    },
  },
  filters: {
    formatDate: function (createdAt) {
      if (!createdAt) return "";
      return moment(String(createdAt)).format("LL");
    },
  },
  async created() {
    await this.refreshContent();
    if (this.v === "" || !this.v || this.v === null) {
      this.selectedVersion = this.packageInfo.latestStableVersion;
      if (this.selectedVersion === null)
        this.selectedVersion = this.packageInfo.latestVersion;
    } else {
      if (!this.packageInfo.packageUploadNames.includes(this.v)) {
        this.$router.push("/404");
      }
      this.selectedVersion = this.packageInfo.name + "@" + this.v;
    }

    if (
      this.packageInfo.latestStableVersion === null &&
      this.packageInfo.latestVersion === null &&
      this.packageInfo.packageUploadNames.length === 0
    ) {
      this.packageReadme = "# No version published yet";
      this.noVersion = true;
    }
    await axios
      .get(
        `https://x.nest.land/api/package/${this.packageInfo.name}/${
          this.selectedVersion.split("@")[1]
        }`
      )
      .then((response) => {
        this.linkToViewBlockIO = `https://viewblock.io/arweave/tx/${response.data.prefix.split('https://arweave.net/')[1]}` 
        this.malicious = response.data.malicious;
        if (response.data.entry !== null) this.entryFile = response.data.entry;
      });
    await this.refreshReadme();
    this.loading = false;
  },
  computed: {
    isFileBrowse() {
      return this.$route.path.toLowerCase().includes("/files");
    },
    entryURL() {
      const entryFileWithoutFirstSlash = this.entryFile.replace(
        new RegExp("/", "i"),
        ""
      );
      return `https://x.nest.land/${this.selectedVersion}/${entryFileWithoutFirstSlash}`;
    },
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
        if (packageDataResponse.data.body === "Not Found") {
          this.$router.push("/404");
          return;
        }
        this.packageInfo = packageDataResponse.data.body;
        this.packageVersions = this.sortPackages(
          this.packageInfo.packageUploadNames
        );
      } catch (err) {
        this.$emit("new-error", err);
      }
    },
    async refreshReadme() {
      if (this.noVersion) return;

      try {
        const url =
          "https://x.nest.land/" + this.selectedVersion + "/README.md";
        const readmeResponse = await fetch(url, {
          method: "GET",
          redirect: "follow",
        });
        this.packageReadme = await readmeResponse.text();

        //resolving relative paths
        //the regex finds all image MARKDOWN tags and replaces the urls to x.nest.land
        //this won't work if the user doesn't publish the dir of the images
        //TODO: maybe we should consider using the github repo field, if this fails
        const imgRegex = new RegExp(
            "(\\!\\[)(.*)(\\]\\()(?!(https:\\/\\/)|(http:\\/\\/))(.*)(.png|.jpeg|.jpg|.svg|.gif|.webp)(\\))",
            "g"
          ),
          labelRegex = new RegExp("(?<=(\\!\\[))(.*)(?=(\\]))", "g"),
          pathRegex = new RegExp(
            "(?<=((\\!\\[)(.*)(\\]\\()))(?!(https:\\/\\/)|(http:\\/\\/))(.*)(.png|.jpeg|.jpg|.svg|.gif|.webp)(?=(\\)))",
            "g"
          ),
          imagesInReadme = this.packageReadme.match(imgRegex);

        for (const img of imagesInReadme) {
          const imgLabel = img.match(labelRegex)[0],
            imgPath = img
              .match(pathRegex)[0]
              .replace(/^(\.\/)/, "")
              .replace(/^(\/)/, "");

          this.packageReadme = this.packageReadme.replace(
            img,
            `![${imgLabel}](https://x.nest.land/${this.selectedVersion}/${imgPath})`
          );
        }
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
    copyPackageEntry() {
      this.$copyText(this.entryURL).then(() => {
        this.copied = true;
      });
    },
  },
};
</script>

<style lang="sass">
@import "../styles/Markdown"

.readme
  margin-top: 1.5rem !important

.icon-margin-right
  margin-right: 10px

.has-light-arrow::after
  border-image-source: linear-gradient(180deg, #22c1c3, #fdbb2d) !important
  border-image-slice: 1 !important

.nest-button-group
  margin: 0 auto

.nest-button-group button
  margin-bottom: 0
  font-family: "Inconsolata", monospace

pre.is-fullwidth
  width: 100%

.Warning
  margin-bottom: 20px
  border-radius: 6px
  box-shadow: 0 0.5em 1em -.125em rgba(10, 10, 10, .1), 0 0px 0 1px rgba(10, 10, 10, .02)
  background-color: #ededed
  padding: 14px 27px
  display: flex
  align-items: center
  border-left: 5px solid #ff0000

  b
    color: #ff0000

  svg
    display: block
    font-size: 2em
    padding-right: .8em
    width: auto !important
    color: #ff0000

  &.info
    border-color: $accentColor
    b
      color: $accentColor

    svg
      color: $accentColor

  p
    margin: 0
    a
      color: $accentColor

.panel-block.warning
  color: #ff0000
  font-weight: 600

.panel-block.entryURL pre
  display: flex
  align-items: center

  svg
    margin-right: 15px

    &.copied
      color: $accentColor

.panel-block .copyEntry
  cursor: pointer
  transition: all .3s

  &:hover
    opacity: .73

.markdown
  +markdown()

  h1:first-child
    margin-top: 0
    padding-top: 0
</style>

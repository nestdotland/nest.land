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
          <h1 class="title has-text-centered pdt-module-head">
            <router-link to="/gallery" class="back-arrow">
              <font-awesome-icon :icon="['fa', 'arrow-left']" />
            </router-link>
            {{ $route.params.id }}
          </h1>
        </div>
      </div>
    </div>
    <div class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="columns reverse-column-order">
            <div class="column is-8">
              <div v-show="packageReadme === 'Loading README...'">
                <p class="subtitle">{{ packageInfo.description }}</p>
                <hr class="mini-hr" />
              </div>
              <div class="Warning" v-if="malicious">
                <font-awesome-icon :icon="['fa', 'exclamation-triangle']" />
                <p>
                  This module is flagged as
                  <b>malicious</b>. Do not use it in your projects!
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
                  <font-awesome-icon
                    class="icon-margin-right"
                    :icon="['fas', 'parachute-box']"
                  />Use this module
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
                    >
                      Stable
                    </button>
                    <button
                      class="button is-warning is-light"
                      @click="
                        selectedVersion = packageInfo.latestVersion;
                        refreshContent();
                        refreshReadme();
                      "
                      :disabled="noVersion"
                      :title="noVersion ? 'No versions published yet' : null"
                    >
                      Latest
                    </button>
                  </div>
                </div>
                <div class="panel-block">
                  <div
                    class="select is-light has-light-arrow is-fullwidth"
                    v-if="!noVersion"
                  >
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
                        >{{ $route.params.id + "@" + version }}</option
                      >
                    </select>
                  </div>
                  <p v-if="noVersion">No version available</p>
                </div>
                <div class="panel-block entryURL" v-if="!noVersion">
                  <div class="url-menu">
                    <button
                      @click="switchURL(false)"
                      :class="{ active: !arweaveURL }"
                    >
                      Nest.land
                    </button>
                    <button
                      @click="switchURL(true)"
                      :class="{ active: arweaveURL }"
                    >
                      Arweave
                    </button>
                    <span class="arweave-info">
                      <font-awesome-icon :icon="['fas', 'info-circle']" />
                      <div class="notice">
                        Importing from Arweave will remove your dependence on
                        x.nest.land.
                      </div>
                    </span>
                  </div>
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
                  <font-awesome-icon
                    class="icon-margin-right"
                    :icon="['fas', 'box-open']"
                  />Module info
                </p>
                <div class="panel-block">
                  <font-awesome-icon
                    class="icon-margin-right"
                    :icon="['fa', 'user']"
                  />
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
                  <font-awesome-icon
                    class="icon-margin-right"
                    :icon="['fa', 'code-branch']"
                  />Repository
                </a>
                <router-link
                  v-if="!noVersion"
                  class="panel-block"
                  :to="'/package/' + $route.params.id + '/files'"
                >
                  <font-awesome-icon
                    class="icon-margin-right"
                    :icon="['fa', 'folder']"
                  />Browse files
                </router-link>
                <a
                  target="_blank"
                  :href="linkToViewBlockIO"
                  class="panel-block"
                >
                  <font-awesome-icon
                    class="icon-margin-right"
                    :icon="['fa', 'calendar-alt']"
                  />
                  Published on: {{ packageInfo.createdAt | formatDate }}
                </a>
              </nav>
              <nav class="panel">
                <div class="panel-heading dropdown-heading">
                  <font-awesome-icon
                    class="icon-margin-right"
                    :icon="['fa', 'boxes']"
                  />
                  <span>Dependencies</span>
                  <div class="dropdown is-pulled-right">
                    <font-awesome-icon :icon="['fa', 'cogs']" />
                    <div class="dropdown-content">
                      <div
                        @click="
                          () => {
                            rawUrls = !rawUrls;
                          }
                        "
                      >
                        {{
                          rawUrls
                            ? "Display formatted URLs"
                            : "Display raw URLs"
                        }}
                      </div>
                      <div
                        @click="
                          () => {
                            displayImportStatuses = !displayImportStatuses;
                          }
                        "
                      >
                        {{
                          displayImportStatuses
                            ? "Hide import statuses"
                            : "Display import statuses"
                        }}
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="importTreeAnalysis.tree">
                  <div>
                    <input
                      class="collapse-switch"
                      type="checkbox"
                      id="collapse-switch-1"
                    />
                    <label class="panel-block" for="collapse-switch-1">
                      <font-awesome-icon
                        class="icon-margin-right"
                        :icon="['fa', 'external-link-alt']"
                      />
                      <span
                        class="collapse-arrow"
                        v-if="importTreeAnalysis.dependencies.length"
                        >{{ importTreeAnalysis.dependencies.length }} external
                        dependencies
                      </span>
                      <span v-else>No external dependencies 🎉</span>
                    </label>
                    <div
                      class="panel-block panel-list collapse"
                      v-if="importTreeAnalysis.dependencies.length"
                    >
                      <ul>
                        <li
                          class="panel-list-simple"
                          v-for="(url,
                          index) in importTreeAnalysis.dependencies"
                          :key="`panel-dependencies-${index}`"
                        >
                          <UrlRegistry :url="url" :raw="rawUrls"></UrlRegistry>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <input
                      class="collapse-switch"
                      type="checkbox"
                      id="collapse-switch-2"
                    />
                    <label class="panel-block" for="collapse-switch-2">
                      <font-awesome-icon
                        class="icon-margin-right"
                        :icon="['fa', 'file-import']"
                      />
                      <span
                        class="collapse-arrow"
                        v-if="importTreeAnalysis.count"
                        >{{ importTreeAnalysis.count }} imports
                      </span>
                      <span v-else>No imports 🎉</span>
                    </label>
                    <div
                      class="panel-block panel-list collapse"
                      v-if="importTreeAnalysis.count"
                    >
                      <ul>
                        <li
                          class="panel-list-simple"
                          v-for="(url, index) in importTreeAnalysis.imports"
                          :key="`panel-imports-${index}`"
                        >
                          <UrlRegistry :url="url" :raw="rawUrls"></UrlRegistry>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="panel-block panel-list">
                    <Tree
                      :treeData="importTreeAnalysis.tree[0]"
                      :raw="rawUrls"
                      :importStatus="displayImportStatuses"
                    ></Tree>
                  </div>
                </div>
                <div class="panel-block" v-else>
                  <font-awesome-icon
                    class="icon-margin-right loading"
                    :icon="['fa', 'spinner']"
                  />
                  Loading...
                </div>
              </nav>
              <nav class="panel">
                <p class="panel-heading">
                  <font-awesome-icon
                    class="icon-margin-right"
                    :icon="['fas', 'shield-alt']"
                  />Audit
                </p>
                <div class="panel-block warning" v-if="malicious">
                  <font-awesome-icon
                    class="icon-margin-right"
                    :icon="['fa', 'biohazard']"
                  />Flagged as malicious
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
                  <font-awesome-icon
                    class="icon-margin-right"
                    :icon="['fa', 'flag']"
                  />Report malicious module
                </a>
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
import { HTTP } from "../http-common";
import moment from "moment";
import * as semverSort from "semver/functions/sort";
import VueMarkdown from "vue-markdown";
import FileExplorer from "../components/package/FileExplorer";
import axios from "axios";
import { importTree } from "../modules/import-tree/importTree";
import Tree from "../components/Tree/Tree";
import UrlRegistry from "../components/Tree/UrlRegistry";

export default {
  components: {
    NestNav,
    VueMarkdown,
    FileExplorer,
    Tree,
    UrlRegistry,
  },
  data() {
    return {
      packageInfo: Object,
      linkToViewBlockIO: "",
      selectedVersion: "",
      packageVersions: [],
      packageReadme: `<center>Loading README...</center>`,
      loading: true,
      noVersion: false,
      entryFile: "/mod.ts",
      malicious: false,
      copied: false,
      originalPageTitle: "nest.land",
      arweaveURL: false,
      arweaveImport: "",
      importTreeAnalysis: Object,
      rawUrls: false,
      displayImportStatuses: false,
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
    this.originalPageTitle = document.title;

    await this.refreshContent();

    const title = `${this.packageInfo.name} | nest.land`;
    document.title = title;

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
        this.linkToViewBlockIO = `https://viewblock.io/arweave/tx/${
          response.data.prefix.split("https://arweave.net/")[1]
        }`;
        this.arweaveImport = response.data.prefix;
        this.malicious = response.data.malicious;
        if (response.data.entry !== null) this.entryFile = response.data.entry;
      });
    await this.refreshReadme();
    this.loading = false;
    this.refreshTree();
  },
  beforeDestroy() {
    document.title = this.originalPageTitle;
  },
  computed: {
    isFileBrowse() {
      return this.$route.path.toLowerCase().includes("/files");
    },
    entryURL() {
      return this.getEntryURL();
    },
  },
  methods: {
    getEntryURL() {
      const entryFileWithoutFirstSlash = this.entryFile.replace(
        new RegExp("/", "i"),
        ""
      );
      return this.arweaveURL
        ? `${this.arweaveImport}/${entryFileWithoutFirstSlash}`
        : `https://x.nest.land/${this.selectedVersion}/${entryFileWithoutFirstSlash}`;
    },
    switchURL(switchURLType) {
      this.arweaveURL = switchURLType;
      this.copied = false;
    },
    async refreshTree() {
      await initExtractImports;
      const analysis = await importTree(this.getEntryURL(), {
        allowRedundant: true,
        allowCircular: true,
      });
      this.importTreeAnalysis = analysis;
    },
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

      await axios
        .get("/api/readme?mod=" + this.selectedVersion)
        .then(({ data }) => (this.packageReadme = data))
        .catch((err) => {
          this.packageReadme = `# ${
            this.$route.params.id
          }\nNo README found for this module. Want to check the [files](/package/${
            this.packageInfo.name
          }/files)${
            this.packageInfo.repository !== "" &&
            this.packageInfo.repository !== null
              ? " or the [repo](" + this.packageInfo.repository + ")"
              : ""
          }?`;
        });
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

.pdt-module-head a.back-arrow
  float: left
  display: inline-block
  vertical-align: middle
  color: rgba(0, 0, 0, .7)
  transition: transform .3s

a.back-arrow
  font-size: 20px !important
  margin-top: 10px

  &:active
    transform: scale(1.2, 1.2)

.title:not(.is-spaced) + .subtitle
  margin: 0

.readme
  margin-top: 1.5rem !important

.icon-margin-right
  margin-right: 10px

.has-light-arrow::after
  border-image-source: linear-gradient(180deg, #22c1c3, #fdbb2d) !important
  border-image-slice: 1 !important

.nest-button-group
  margin: 0 auto

  button
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

.panel-block.entryURL
  display: block

  .url-menu
    display: flex
    align-items: center
    justify-content: center
    margin-bottom: .5em
    position: relative

    .arweave-info
      position: absolute
      right: 0
      top: 50%
      transform: translateY(-50%)

      .notice
        position: absolute
        top: 2.5em
        font-size: .9em
        line-height: 1em
        padding: 5px
        border-radius: 3px
        background-color: #15b199
        right: 0
        color: #fff
        width: 250px
        display: none
        opacity: 0
        transition: opacity .2s

      svg
        color: #bdbdbd
        cursor: pointer
        font-size: 1em

        &:hover
          color: #00947e

          & + .notice
            display: block
            opacity: 1

    button
      background: transparent
      font-size: .85em
      z-index: 10
      font-weight: 500
      color: #101010
      cursor: pointer
      border: none
      outline: none
      position: relative
      margin: 0 8px
      padding: 0
        bottom: 5px

      &::after
        content: ''
        position: absolute
        left: 0
        bottom: 0
        right: 0
        height: 2px
        background-color: #00947e
        opacity: 0
        transition: all .18s

      &.active::after
        opacity: 1

  pre
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

.panel-list
  overflow-x: auto
  overflow-y: hidden

  li
    white-space: nowrap
    position: relative

    &.panel-list-simple
      list-style: disc inside

.loading
  animation: infiniteRotate 0.5s linear infinite

.panel-block.collapse
  visibility: hidden
  padding: 0 1.25em
  opacity: 0
  max-height: 0
  transition: all .3s

.collapse-arrow::after
  content: "\25b6"
  position: absolute
  right: 1em
  transition: all 0.3s

input
  &:checked
    & ~ .collapse
      visibility: visible
      padding: 0.5em 1.25em
      opacity: 1
      max-height: 100%

    & ~ label .collapse-arrow::after
      transform: rotate(90deg)


  &.collapse-switch
    display: none

@keyframes infiniteRotate
  0%
    transform: rotate(0deg)

  100%
    transform: rotate(360deg)

.dropdown
  position: relative
  display: inline-block
  padding-top: 2px

  .dropdown-content
    display: none
    position: absolute
    right: 0
    min-width: 10em
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2)
    z-index: 1

    div
      cursor: pointer
      font-size: .7em
      color: black
      padding: .5em .5em
      display: block

    div:hover
      background-color: #ddd

  &:hover .dropdown-content
    display: block

.markdown
  +markdown()

  h1:first-child
    margin-top: 0
    padding-top: 0
</style>

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
              <div v-show="packageReadme === 'Loading README...'">
                <p class="subtitle">{{ packageInfo.description }}</p>
                <hr class="mini-hr" />
              </div>
              <vue-markdown
                :source="packageReadme"
                :toc="true"
                :toc-anchor-link-space="false"
                class="Markdown"
                v-if="!isFileBrowse"
              ></vue-markdown>
              <div class="fileSystem" v-else-if="!noVersion">
                <div class="panel">
                  <div class="panel-heading">
                    <font-awesome-icon class="icon-margin-right" :icon="['fa', 'folder']" />
                    <div
                      class="filesTitle"
                      v-if="filesLocation === '' || filesLocation === '/'"
                    >Browse package files</div>
                    <div class="filesTitle" v-else>
                      <router-link
                        v-for="fileLocation in filesLocationList"
                        :key="fileLocation.id"
                        :to="'/package/' + $route.params.id + '/files' + fileLocation.href"
                      >{{ fileLocation.display }}</router-link>
                    </div>
                    <a
                      :href="'https://doc.deno.land/https/x.nest.land/' + selectedVersion + filesLocation"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="FileDocumentation"
                      v-if="fileView && (currentFileExtension === 'ts' || currentFileExtension === 'js')"
                    >View Documentation</a>
                  </div>
                  <router-link class="panel-block" :to="parentDir">
                    <font-awesome-icon class="icon-margin-right" :icon="['fa', 'level-up-alt']" />
                    {{ filesLocation === '' || filesLocation === '/' ? 'Return to package review' : 'Go up' }}
                  </router-link>
                  <div v-if="!fileView">
                    <router-link
                      class="panel-block fileItem"
                      v-for="dir in currentDirectories"
                      :to="{ path: removeSlashFunc(dir) }"
                      :key="dir.id"
                      append
                    >
                      <font-awesome-icon class="icon-margin-right" :icon="['fa', 'folder']" />
                      {{ dir | removeSlash }}
                    </router-link>
                    <router-link
                      class="panel-block fileItem"
                      v-for="file in currentFiles"
                      :to="{ path: file.fileName }"
                      :key="file.id"
                      @click.native="openFile"
                      append
                    >
                      <font-awesome-icon
                        class="icon-margin-right"
                        :icon="['fa', getFileItemType(file.fileName) === 'md' ? 'book-open' : (['png', 'jpg', 'gif', 'jpeg'].includes(getFileItemType(file.fileName)) ? 'image' : 'file-code')]"
                      />
                      {{ file.fileName }}
                    </router-link>
                  </div>
                  <div
                    v-else-if="['png', 'jpg', 'gif', 'jpeg'].includes(currentFileExtension)"
                    class="ImageContainer"
                  >
                    <img :src="currentFileURL" class="ImagePreview" />
                  </div>
                  <div class="CodeHighlight" v-else-if="currentFileExtension !== 'md'">
                    <div class="Lines">
                      <span v-for="line in fileContentLines" :key="line.id" :id="'L' + line">
                        <a :href="'#L' + line">{{ line }}</a>
                      </span>
                    </div>
                    <vue-code-highlight class="Code">{{ currentFileContent }}</vue-code-highlight>
                  </div>
                  <vue-markdown
                    :source="currentFileContent"
                    :toc="true"
                    :toc-anchor-link-space="false"
                    class="Markdown"
                    v-else
                  ></vue-markdown>
                </div>
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
                      @click="selectedVersion = packageInfo.latestStableVersion; refreshContent(); refreshReadme(); reloadFiles(); loadCurrentFile()"
                      :title="packageInfo.latestStableVersion === null ? 'No stable version available yet': null"
                      :disabled="packageInfo.latestStableVersion === null"
                    >Stable</button>
                    <button
                      class="button is-warning is-light"
                      @click="selectedVersion = packageInfo.latestVersion; refreshContent(); refreshReadme(); reloadFiles(); loadCurrentFile()"
                      :disabled="noVersion"
                      :title="noVersion ? 'No versions published yet': null"
                    >Latest</button>
                  </div>
                </div>
                <div class="panel-block">
                  <div class="select is-light has-light-arrow is-fullwidth" v-if="!noVersion">
                    <select
                      v-model="selectedVersion"
                      @change="refreshContent(); refreshReadme(); reloadFiles(); loadCurrentFile()"
                    >
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
                  <pre class="is-fullwidth"><code>https://x.nest.land/{{ selectedVersion }}/{{ entryFile | removeFirstSlash }}</code></pre>
                </div>
              </nav>
              <nav class="panel">
                <p class="panel-heading">
                  <font-awesome-icon class="icon-margin-right" :icon="['fas', 'box-open']" />Package info
                </p>
                <div class="panel-block">
                  <font-awesome-icon class="icon-margin-right" :icon="['fa', 'user']" />
                  Author: {{ packageInfo.owner }}
                </div>
                <a
                  v-if="packageInfo.repository !== '' && packageInfo.repository !== null"
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
                <div class="panel-block">
                  <font-awesome-icon class="icon-margin-right" :icon="['fa', 'calendar-alt']" />
                  Published on: {{ packageInfo.createdAt | formatDate }}
                </div>
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
import axios from "axios";
import { component as VueCodeHighlight } from "vue-code-highlight";
import "../../styles/CodeHighlightTheme.sass";

export default {
  components: {
    NestNav,
    VueMarkdown,
    VueCodeHighlight,
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
      fileView: false,
      currentFileContent: "",
      currentFileURL: "",
      entryFile: "",
    };
  },
  props: {
    v: {
      type: String,
    },
  },
  filters: {
    formatDate: function(createdAt) {
      if (!createdAt) return "";
      return moment(String(createdAt)).format("LL");
    },
    removeSlash (val) {
      return val.replace(new RegExp("/", "g"), "");
    },
    removeFirstSlash (val) {
      return val.replace(new RegExp('/', 'i'), '');
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

    await this.refreshReadme();
    await this.reloadFiles();
    await this.loadCurrentFile();
    this.checkIfDirOrFileExists();
    this.loading = false;
  },
  computed: {
    isFileBrowse() {
      return this.$route.path.toLowerCase().includes("/files");
    },
    filesLocation() {
      return this.$route.path.split("/files")[1];
    },
    filesLocationList() {
      let filesWithRoute = [{ display: "/", href: "/" }],
        locations = "/";

      for (const fileLoc of this.filesLocation.split("/")) {
        if (fileLoc === "") continue;

        locations += fileLoc.replace(new RegExp("/", "g"), "") + "/";
        filesWithRoute.push({
          display: fileLoc.replace(new RegExp("/", "g"), "") + "/",
          href: locations,
        });
      }

      if (filesWithRoute.length > 1)
        filesWithRoute[filesWithRoute.length - 1].display = filesWithRoute[
          filesWithRoute.length - 1
        ].display.replace(new RegExp("/", "g"), "");

      return filesWithRoute;
    },
    fileSystem() {
      let fileSystemData = [];

      for (const file in this.files) {
        const fileName = file.split("/")[file.split("/").length - 1],
          fileLocation = file.replace(fileName, ""),
          fileSize = 0;

        fileSystemData.push({ fileName, fileLocation, fileSize });
      }

      return fileSystemData;
    },
    currentFiles() {
      return this.fileSystem
        .filter(file => {
          return (
            file.fileLocation.replace(new RegExp("/$"), "") ===
            this.filesLocation.replace(new RegExp("/$"), "")
          );
        })
        .sort((a, b) => a.fileName.localeCompare(b.fileName));
    },
    currentDirectories() {
      const dirs = [];

      console.log(this.fileSystem);

      for (const file of this.fileSystem) {
        const locationWithoutLastSlash = this.filesLocation.replace(
            new RegExp("/$"),
            "",
          ),
          dirToPush = file.fileLocation
            .replace(locationWithoutLastSlash, "")
            .split("/")[1];

        if (
          !dirs.includes(dirToPush) &&
          file.fileLocation.includes(locationWithoutLastSlash) &&
          dirToPush !== ""
        ) {
          dirs.push(dirToPush);
        }
      }

      return dirs.sort((a, b) => a.localeCompare(b));
    },
    //we use this cuz utilizing "./" in the router-link does not work always, because is based on router history
    parentDir() {
      const routeWithoutSlashEnding = this.$route.path.endsWith("/")
        ? this.$route.path.replace(new RegExp("/$"), "")
        : this.$route.path;

      return routeWithoutSlashEnding.substr(
        0,
        routeWithoutSlashEnding.lastIndexOf("/"),
      );
    },
    currentFileExtension() {
      const routeWithoutSlashEnding = this.$route.path.endsWith("/")
          ? this.$route.path.replace(new RegExp("/$"), "")
          : this.$route.path,
        fileName = routeWithoutSlashEnding.split("/")[
          routeWithoutSlashEnding.split("/").length - 1
        ];

      return fileName.split(".")[fileName.split(".").length - 1];
    },
    fileContentLines() {
      if (this.currentFileExtension === "json")
        return JSON.stringify(this.currentFileContent, null, 4).split(
          /\r\n|\r|\n/,
        ).length;

      return this.currentFileContent.split(/\r\n|\r|\n/).length;
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
          this.packageInfo.packageUploadNames,
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
      } catch (err) {
        this.$emit("new-error", err);
      }
    },
    async reloadFiles() {
      await axios
        .get(
          `https://x.nest.land/api/package/${this.packageInfo.name}/${
            this.selectedVersion.split("@")[1]
          }`,
        )
        .then(response => {
          this.files = response.data.files;
          this.entryFile = response.data.entry;
        });
    },
    sortPackages(packageList) {
      for (let i = 0; i < packageList.length; i++) {
        packageList[i] = packageList[i].split("@")[1];
      }
      return semverSort(packageList).reverse();
    },
    getFileItemType(fileName) {
      if (fileName.split(".").length < 1) return "dir";

      return fileName.split(".")[fileName.split(".").length - 1];
    },
    removeSlashFunc(val) {
      return val.replace(new RegExp("/", "g"), "");
    },
    async loadCurrentFile() {
      const routeWithoutSlashEnding = this.$route.path.endsWith("/")
          ? this.$route.path.replace(new RegExp("/$"), "")
          : this.$route.path,
        fileName = routeWithoutSlashEnding.split("/")[
          routeWithoutSlashEnding.split("/").length - 1
        ];

      this.fileView = false;

      for (const file of this.fileSystem)
        if (fileName === file.fileName) this.fileView = true;

      if (!this.fileView) return;

      this.currentFileURL = `https://x.nest.land/${this.selectedVersion}/${
        routeWithoutSlashEnding.split("/files/")[1]
      }`;
      await axios
        .get(this.currentFileURL)
        .then(response => (this.currentFileContent = response.data))
        .catch(() => this.$router.push(`/404`));
    },
    openFile() {
      this.currentFileContent = "Loading file...";
    },
    checkIfDirOrFileExists() {
      if (!this.isFileBrowse) return;

      const dirExists =
        Object.keys(this.files).filter(key => key.includes(this.filesLocation))
          .length > 0;

      if (!(this.filesLocation in this.files) && !dirExists)
        this.$router.push(`/404`);
    },
  },
  watch: {
    async $route() {
      await this.loadCurrentFile();
      this.checkIfDirOrFileExists();
    },
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
.Markdown {
  :first-child {
    margin-top: 0;
    padding-top: 0;
  }
  @include markdown();
}
.fileSystem {
  .filesTitle {
    display: inline-block;
    a {
      color: #00947e;
    }
  }
  .panel-block {
    padding: 0.5em 1.25em;
  }
  .fileItem {
    padding: 0.5em 1.75em;
  }
  .Markdown {
    padding: 1em 3em;
  }
  .panel-heading {
    position: relative;
    padding: 0.75em 1em;
    .FileDocumentation {
      position: absolute;
      font-size: 0.7em;
      color: #00947e;
      display: inline-block;
      vertical-align: bottom;
      right: 1em;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .ImageContainer {
    width: 100%;
    overflow: hidden;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    .ImagePreview {
      display: block;
      width: 100%;
    }
  }
}
</style>
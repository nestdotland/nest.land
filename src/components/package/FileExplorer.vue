<template>
  <div class="file-explorer">
    <div class="panel">
      <div class="panel-heading">
        <font-awesome-icon class="icon-margin-right" :icon="['fa', 'folder']" />
        <div
          class="filesTitle"
          v-if="filesLocation === '' || filesLocation === '/'"
        >
          Browse module files
        </div>
        <div class="filesTitle" v-else>
          <router-link
            v-for="fileLocation in filesLocationList"
            :key="fileLocation.id"
            :to="
              std
                ? '/std/' + submodule + '/' + version + fileLocation.href
                : '/package/' + $route.params.id + '/files' + fileLocation.href
            "
            >{{ fileLocation.display }}</router-link
          >
        </div>
        <a
          :href="
            std
              ? 'https://doc.deno.land/https/x.nest.land/std@' +
                version +
                filesLocation
              : 'https://doc.deno.land/https/x.nest.land/' +
                version +
                filesLocation
          "
          target="_blank"
          rel="noopener noreferrer"
          class="file-documentation"
          v-if="
            fileView &&
              (currentFileExtension === 'ts' || currentFileExtension === 'js')
          "
          ><font-awesome-icon :icon="['fas', 'book']"
        /></a>
      </div>
      <router-link
        class="panel-block"
        :to="parentDir"
        v-if="
          !std ||
            (filesLocation !== '' &&
              filesLocation !== '/' &&
              filesLocation !== '/' + submodule &&
              filesLocation !== submodule)
        "
      >
        <font-awesome-icon
          class="icon-margin-right"
          :icon="['fa', 'level-up-alt']"
        />
        {{
          filesLocation === '' || filesLocation === '/'
            ? 'Return to package review'
            : 'Go up'
        }}
      </router-link>
      <div v-if="!fileView">
        <router-link
          class="panel-block file-item"
          v-for="dir in currentDirectories"
          :to="{ path: removeSlashFunc(dir) }"
          :key="dir.id"
          append
        >
          <font-awesome-icon
            class="icon-margin-right"
            :icon="['fa', 'folder']"
          />
          {{ dir | removeSlash }}
        </router-link>
        <router-link
          class="panel-block file-item"
          v-for="file in currentFiles"
          :to="{ path: file.fileName }"
          :key="file.id"
          @click.native="openFile"
          append
        >
          <font-awesome-icon
            class="icon-margin-right"
            :icon="[
              'fa',
              getFileItemType(file.fileName) === 'md'
                ? 'book-open'
                : ['png', 'jpg', 'gif', 'jpeg'].includes(
                    getFileItemType(file.fileName)
                  )
                ? 'image'
                : 'file-code'
            ]"
          />
          {{ file.fileName }}
        </router-link>
      </div>
      <div
        v-else-if="['png', 'jpg', 'gif', 'jpeg'].includes(currentFileExtension)"
        class="image-container"
      >
        <img :src="currentFileURL" class="image-preview" />
      </div>
      <div class="CodeHighlight" v-else-if="currentFileExtension !== 'md'">
        <div class="Lines">
          <span
            v-for="line in fileContentLines"
            :key="line.id"
            :id="'L' + line"
          >
            <a :href="'#L' + line">{{ line }}</a>
          </span>
        </div>
        <vue-code-highlight class="Code">{{
          currentFileContent
        }}</vue-code-highlight>
      </div>
      <vue-markdown
        :source="currentFileContent"
        :toc="true"
        :toc-anchor-link-space="false"
        class="markdown"
        v-else
      ></vue-markdown>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueMarkdown from 'vue-markdown';
import { component as VueCodeHighlight } from 'vue-code-highlight';
import '../../styles/CodeHighlightTheme.sass';

export default {
  name: 'FileExplorer',
  components: {
    VueMarkdown,
    VueCodeHighlight
  },
  data() {
    return {
      files: {},
      fileView: false,
      currentFileContent: '',
      currentFileURL: ''
    };
  },
  props: {
    //selected package version
    version: {
      type: String,
      required: true
    },
    //package name
    //originally packageInfo.name in PackageDetail.vue
    name: {
      type: String,
      required: true
    },
    //is it an std submodule
    std: {
      type: Boolean,
      default: false
    },
    //std submodule name
    submodule: {
      type: String
    }
  },
  async created() {
    await this.reloadFiles();
    await this.loadCurrentFile();
    this.checkIfDirOrFileExists();
  },
  computed: {
    //get current location inside the filesystem
    filesLocation() {
      if (this.std)
        return (
          `/${this.submodule}` +
          this.$route.path.split(`/std/${this.submodule}/${this.version}`)[1]
        );
      return this.$route.path.split('/files')[1];
    },
    //get the filesystem
    fileSystem() {
      let fileSystemData = [];

      for (const file in this.files) {
        const fileName = file.split('/')[file.split('/').length - 1],
          fileLocation = file.replace(fileName, ''),
          fileSize = 0;

        fileSystemData.push({ fileName, fileLocation, fileSize });
      }
      return fileSystemData;
    },
    //get all files with their paths
    filesLocationList() {
      let filesWithRoute = [{ display: '/', href: '/' }],
        locations = '/';

      for (const fileLoc of this.filesLocation.split('/')) {
        if (fileLoc === '') continue;
        if (
          this.std &&
          fileLoc.replace(new RegExp('/', 'g'), '') === this.submodule
        )
          continue;
        locations += fileLoc.replace(new RegExp('/', 'g'), '') + '/';
        filesWithRoute.push({
          display: fileLoc.replace(new RegExp('/', 'g'), '') + '/',
          href: locations
        });
      }

      if (filesWithRoute.length > 1)
        filesWithRoute[filesWithRoute.length - 1].display = filesWithRoute[
          filesWithRoute.length - 1
        ].display.replace(new RegExp('/', 'g'), '');

      return filesWithRoute;
    },
    //get the files in the current directory
    currentFiles() {
      if (this.fileView) return [];
      return this.fileSystem
        .filter(file => {
          return (
            file.fileLocation.replace(new RegExp('/$'), '') ===
            this.filesLocation.replace(new RegExp('/$'), '')
          );
        })
        .sort((a, b) => a.fileName.localeCompare(b.fileName));
    },
    //get folders in the current directory
    currentDirectories() {
      const dirs = [];

      if (this.fileView) return [];

      for (const file of this.fileSystem) {
        const locationWithoutLastSlash = this.filesLocation.replace(
            new RegExp('/$'),
            ''
          ),
          dirToPush = file.fileLocation
            .replace(locationWithoutLastSlash, '')
            .split('/')[1];

        if (
          !dirs.includes(dirToPush) &&
          file.fileLocation.includes(locationWithoutLastSlash) &&
          dirToPush !== ''
        ) {
          if (this.std && dirToPush === '..') continue;

          dirs.push(dirToPush);
        }
      }
      return dirs.sort((a, b) => a.localeCompare(b));
    },
    //get the parent dir
    //we use this cuz utilizing "./" in the router-link does not work always, because is based on router history
    parentDir() {
      const routeWithoutSlashEnding = this.$route.path.endsWith('/')
        ? this.$route.path.replace(new RegExp('/$'), '')
        : this.$route.path;

      return routeWithoutSlashEnding.substr(
        0,
        routeWithoutSlashEnding.lastIndexOf('/')
      );
    },
    //get the currently opened file's extension
    currentFileExtension() {
      const routeWithoutSlashEnding = this.$route.path.endsWith('/')
          ? this.$route.path.replace(new RegExp('/$'), '')
          : this.$route.path,
        fileName = routeWithoutSlashEnding.split('/')[
          routeWithoutSlashEnding.split('/').length - 1
        ];

      return fileName.split('.')[fileName.split('.').length - 1];
    },
    //get the number of lines of the currently opened file
    //we use this for the line numbering with the code
    fileContentLines() {
      //when a json file is opened, axios auto-converts it into a javascript object
      //we stringfiy the object to get the number of lines
      //this doesn't work always, since many people have different styles when using json files
      if (this.currentFileExtension === 'json')
        return JSON.stringify(this.currentFileContent, null, 4).split(
          /\r\n|\r|\n/
        ).length;

      return this.currentFileContent.split(/\r\n|\r|\n/).length;
    }
  },
  filters: {
    removeSlash(val) {
      return val.replace(new RegExp('/', 'g'), '');
    }
  },
  methods: {
    //reload the files, and the filesystem on changes
    async reloadFiles() {
      await axios
        .get(
          `https://x.nest.land/api/package/${this.name}/${
            this.std ? this.version : this.version.split('@')[1]
          }`
        )
        .then(response => (this.files = response.data.files))
        .catch(() => {});
    },
    //load the current file
    async loadCurrentFile() {
      const routeWithoutSlashEnding = this.$route.path.endsWith('/')
          ? this.$route.path.replace(new RegExp('/$'), '')
          : this.$route.path,
        fileName = routeWithoutSlashEnding.split('/')[
          routeWithoutSlashEnding.split('/').length - 1
        ];

      this.fileView = false;

      for (const file of this.fileSystem)
        if (fileName === file.fileName) this.fileView = true;

      if (!this.fileView) return;

      this.currentFileURL = `https://x.nest.land/${
        this.std
          ? this.name + '@' + this.version + '/' + this.submodule
          : this.version + '/'
      }${
        this.std
          ? routeWithoutSlashEnding.split(
              `${this.submodule}/${this.version}`
            )[1]
          : routeWithoutSlashEnding.split('/files/')[1]
      }`;

      await axios
        .get(this.currentFileURL)
        .then(response => (this.currentFileContent = response.data))
        .catch(() => this.$router.push(`/404`));

      if (this.currentFileExtension === 'md') {
        //resolving relative paths
        //the regex finds all image MARKDOWN tags and replaces the urls to x.nest.land
        //this won't work if the user doesn't publish the dir of the images
        //TODO: maybe we should consider using the github repo field, if this fails
        const imgRegex = new RegExp(
            '(\\!\\[)(.*)(\\]\\()(?!(https:\\/\\/)|(http:\\/\\/))(.*)(.png|.jpeg|.jpg|.svg|.gif|.webp)(\\))',
            'g'
          ),
          labelRegex = new RegExp('(?<=(\\!\\[))(.*)(?=(\\]))', 'g'),
          pathRegex = new RegExp(
            '(?<=((\\!\\[)(.*)(\\]\\()))(?!(https:\\/\\/)|(http:\\/\\/))(.*)(.png|.jpeg|.jpg|.svg|.gif|.webp)(?=(\\)))',
            'g'
          ),
          imagesInMarkdown = this.currentFileContent.match(imgRegex);

        if (imagesInMarkdown === null) return;

        for (const img of imagesInMarkdown) {
          const imgLabel = img.match(labelRegex)[0],
            imgPath = img
              .match(pathRegex)[0]
              .replace(/^(\.\/)/, '')
              .replace(/^(\/)/, '');

          this.currentFileContent = this.currentFileContent.replace(
            img,
            `![${imgLabel}](https://x.nest.land/${
              this.std ? this.name + '@' + this.version : this.version
            }/${imgPath})`
          );
        }
      }
    },
    //get if the file item is a directory or an actual file
    getFileItemType(fileName) {
      if (fileName.split('.').length < 1) return 'dir';

      return fileName.split('.')[fileName.split('.').length - 1];
    },
    //remove the slash from a path
    removeSlashFunc(val) {
      return val.replace(new RegExp('/', 'g'), '');
    },
    //add loading, so it won't display the previous file content
    openFile() {
      this.currentFileContent = 'Loading file...';
    },
    //check if the current file or dir exists
    //redirects to the 404 url if it does not
    checkIfDirOrFileExists() {
      if (!this.isFileBrowse) return;

      const dirExists =
        Object.keys(this.files).filter(key => key.includes(this.filesLocation))
          .length > 0;

      if (!(this.filesLocation in this.files) && !dirExists)
        this.$router.push(`/404`);
    }
  },
  watch: {
    //watch the selected version for changes
    //we call file reload and filesystem reload here
    async version() {
      await this.loadCurrentFile();
      await this.reloadFiles();
    },
    async $route() {
      await this.loadCurrentFile();
      this.checkIfDirOrFileExists();
    }
  }
};
</script>

<style lang="sass" scoped>

.file-explorer

  .filesTitle
    display: inline-block

    a
      color: $accentColor

  .panel-block
    padding: 0.5em 1.25em

  .file-item
    padding: 0.5em 1.75em

  .markdown
    padding: 1em 3em

  .panel-heading
    position: relative
    padding: 0.75em 1em

    .file-documentation
      position: absolute
      font-size: 0.7em
      color: $accentColor
      display: inline-block
      vertical-align: bottom
      right: 1em
      top: 50%
      transform: translateY(-50%)

  .image-container
    width: 100%
    overflow: hidden
    border-bottom-left-radius: inherit
    border-bottom-right-radius: inherit

    .image-preview
      display: block
      width: 100%
</style>

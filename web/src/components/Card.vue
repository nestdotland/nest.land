<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <p class="title is-4">{{ item._id }}</p>
        <p class="subtitle is-6">{{ item.description }}</p>
        <hr class="mini-hr" />
        <p class="author-text">By: {{ item.owner }}</p>
      </div>
    </div>
    <footer class="card-footer">
      <div class="select card-footer-item is-light">
        <select v-model="selectedVersion">
          <option
            v-for="version in item.packageUploadIds"
            :key="version"
            :value="version"
          >{{ version }}</option>
        </select>
      </div>
      <a
        :href="'https://x.nest.land/' + selectedVersion"
        class="card-footer-item has-text-dark"
      >Open Package</a>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: ["item"],
  data() {
    return {
      package: {},
      selectedVersion: "",
    };
  },
  created() {
    this.package = this.item;
    this.selectedVersion =
      this.package._id + "@" + this.package.latestStableVersion;
  },
};
</script>

<style scoped>
.card {
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-10px);
  transition: transform 0.2s;
}
.card-header {
  border-radius: 20px 20px 0 0;
}
.card-header-title span {
  margin: auto;
}
.card-footer-item {
  font-family: "Inconsolata", monospace;
}
.select {
  width: 50% !important;
  height: 100% !important;
  margin: 0 !important;
}
.mini-hr {
  margin-bottom: 20px !important;
}

.image {
  margin-right: 0;
}
</style>
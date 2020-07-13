<template>
  <router-link :to="`/package/${item.name}`" class="card" tag="div">
    <div class="card-content">
      <div class="content">
        <p class="title is-4">{{ item.name }}</p>
        <hr class="mini-hr" />
        <p class="subtitle is-6">{{ item.description }}</p>
      </div>
    </div>
  </router-link>
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
      this.package.name + "@" + this.package.latestStableVersion;
  },
};
</script>

<style scoped>
.card {
  border-radius: 20px;
  box-shadow: 0 0 15px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
  transition: transform 0.15s, box-shadow 0.15s;
}
.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
  transition: transform 0.15s, box-shadow 0.15s;
  cursor: pointer;
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
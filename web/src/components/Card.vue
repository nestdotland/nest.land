<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4 has-text-dark">{{ item.packageTitle }}</p>
          <hr class="mini-hr" />
        </div>
        <div class="media-right">
          <figure class="image is-48x48">
            <img
              class="is-rounded"
              src="https://bulma.io/images/placeholders/96x96.png"
              alt="Placeholder icon"
            />
          </figure>
        </div>
      </div>
      <div class="content">
        <p>{{ item.packageInfo.description }}</p>
      </div>
    </div>
    <footer class="card-footer">
      <a :href="item.packageURL" class="card-footer-item has-text-dark">Package URL</a>
      <a :href="item.packageInfo.docsLink" class="card-footer-item has-text-dark">Docs</a>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: ["item"]
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
.mini-hr {
  height: 10px;
  width: 20%;
  border-radius: 2px;
  margin-bottom: 0;
  background: linear-gradient(271deg, #22c1c3, #fdbb2d);
  background-size: 400% 400%;

  -webkit-animation: nestGradient 6s ease infinite;
  -moz-animation: nestGradient 6s ease infinite;
  animation: nestGradient 6s ease infinite;
}
.image {
  margin-right: 0;
}
.card-footer-item {
  font-family: "Inconsolata", monospace;
}
</style>
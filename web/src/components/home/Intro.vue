<template>
  <div class="hero is-medium">
    <div class="hero-body" id="intro">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column">
            <h1 class="title">What is Nest.land?</h1>
            <p>
              Nest.land combines Deno with the
              <a
                class="has-text-dark"
                href="https://www.arweave.org/"
              >Arweave Blockchain</a>. With us, you can
              publish Deno packages to the permaweb, where they can never be deleted. This avoids a major pitfall
              for web-based package imports while allowing the developer to maximize on the potential of Deno's URL-based imports!
            </p>
            <hr />
            <ul>
              <li class="subtitle">
                <font-awesome-icon :icon="['fas', 'trash-alt']" class="left-icon" />Impossible to delete or remove
              </li>
              <li class="subtitle">
                <font-awesome-icon :icon="['fas', 'universal-access']" class="left-icon" />Easily accessible registry
              </li>
              <li class="subtitle">
                <font-awesome-icon :icon="['fas', 'feather-alt']" class="left-icon" />Easy and free to publish packages
              </li>
            </ul>
          </div>
          <div class="column is-hidden-mobile">
            <package-vector></package-vector>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PackageVector from "../../assets/package_vector.svg";

export default {
  name: "Intro",
  components: {
    PackageVector
  }
};
</script>

<style scoped>
.left-icon {
  margin-right: 10px;
}
.subtitle {
  font-family: "Inconsolata", monospace;
}
/*#intro {*/
/*    margin-bottom: 0;*/
/*    padding-bottom: 0;*/
/*}*/
</style>
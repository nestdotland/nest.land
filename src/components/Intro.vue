<template>
  <div class="hero is-medium">
    <div class="hero-body" id="intro">
      <div class="container">
        <h1 class="title">What is Nest?</h1>
        <div class="columns is-mobile" id="double-trouble">
          <div class="column is-5">
            <figure id="deno-img">
              <a href="https://deno.land/">
                <!-- <img src="../assets/deno.png" /> -->
                <deno-logo></deno-logo>
              </a>
            </figure>
          </div>
          <div class="column is-2 has-text-centered">
            <h1 class="title is-1" id="plus">+</h1>
          </div>
          <div class="column is-5">
            <figure id="arweave-img">
              <a href="https://www.arweave.org/">
                <!-- <img src="../assets/arweave.png" /> -->
                <arweave-logo></arweave-logo>
              </a>
            </figure>
          </div>
        </div>
        <hr />
        <div class="columns">
          <div class="column is-half">
            <p>
              Nest.land combines the best of Node.js and TypeScript with the Arweave Permaweb. With Nest, you can
              publish Deno packages to the permaweb, where they can never be deleted. This avoids a major pitfall
              for web-based package imports while allowing the developer to maximize on the potential of Deno.
            </p>
          </div>
          <div class="column is-half">
            <ul>
              <li class="subtitle">
                <font-awesome-icon :icon="['fas', 'trash-alt']" class="left-icon" />Impossible to delete or remove
              </li>
              <li class="subtitle">
                <font-awesome-icon :icon="['fas', 'universal-access']" class="left-icon" />Easily accessible
              </li>
              <li class="subtitle">
                <font-awesome-icon :icon="['fas', 'feather-alt']" class="left-icon" />Easy to publish packages
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ArweaveLogo from "../assets/arweave.svg";
import DenoLogo from "../assets/deno.svg";

export default {
  name: "Intro",
  components: {
    ArweaveLogo,
    DenoLogo
  }
};
</script>

<style scoped>
#double-trouble {
  display: flex;
  align-items: center;
}
#deno-img {
  float: right;
  transition: transform 0.2s;
}
#arweave-img {
  transition: transform 0.2s;
}
#deno-img,
#arweave-img {
  width: 40%;
  min-width: 100px;
}
#deno-img:hover,
#arweave-img:hover {
  transition: transform 0.2s;
  transform: translateY(-15px);
}
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
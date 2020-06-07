<template>
  <div class="hero is-medium" id="docs">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">Documentation</h1>
        <hr class="mini-hr" style="margin-bottom: 1.5rem" />
        <div class="columns is-multiline is-vcentered">
          <div class="column is-half">
            <p>
              In order to publish packages to the blockchain with our CLI, you must first generate an API key. See
              <router-link to="/#start" class="has-text-dark">Getting Started</router-link>.
            </p>
            <hr />
          </div>
          <div class="column is-half"></div>
          <div class="column is-half">
            <p class="title is-5">Installation</p>
            <p>
              It's very easy to begin using Nest when pushing new Deno packages! You can install our CLI,
              <i>egg</i>, via Deno.
            </p>
            <hr />
          </div>
          <div class="column is-half">
            <pre><code>$ deno install --allow-read --allow-run --allow-write -f --unstable https://x.nest.land/egg@0.0.1</code></pre>
          </div>
          <div class="column is-half">
            <p class="title is-5">Publishing a Package</p>
            <p>
              Following installation, just navigate to the root of your package and use the command shown:
              <br />
              <br />That's it! After this, you'll be returned a link that you can use in your Deno projects. Your package
              will also be added to the package lists on our servers, so other users will be able to find it on the
              <router-link to="gallery" class="has-text-dark">Gallery</router-link>
              <br />
              <br />Note: The same command is used to publish a new version to an existing package!
            </p>
            <hr />
          </div>
          <div class="column is-half">
            <pre><code>$ egg publish [package name] [version] [key]</code></pre>
          </div>
          <div class="column is-half">
            <p class="title is-5">Updating Nest.land packages</p>
            <p>
              Updating your Nest.land package versions is a breeze thanks to
              <a
                class="has-text-dark"
                href="https://github.com/ebebbington"
              >@ebebbington</a>'s addition to the CLI. Just type the command shown to automatically check for and update all Nest.land package imports.
            </p>
          </div>
          <div class="column is-half">
            <pre><code>$ egg update</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Docs",
};
</script>

<style scoped>
</style>
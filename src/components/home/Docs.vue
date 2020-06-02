<template>
  <div class="hero is-medium">
    <div class="hero-body" style="padding-top: 0;">
      <div class="container">
        <h1 class="title" id="start">Getting Started</h1>
        <div class="columns is-multiline">
          <div class="column is-half">
            <p>
              It's very easy to begin using Nest when pushing new Deno packages! You can install our CLI,
              <i>egg</i>, via Deno.
            </p>
          </div>
          <div class="column is-half">
            <pre><code>$ deno install --allow-read --allow-run --allow-write -f --unstable https://x.nest.land/egg@0.0.1</code></pre>
          </div>
          <div class="column is-half">
            <p>Following installation, just navigate to the root of your package and use the command shown!</p>
          </div>
          <div class="column is-half">
            <pre><code>$ egg publish [package name] [version] [key]</code></pre>
          </div>
        </div>
        <p>
          And that's it! After this, you'll be returned a link that you can use in your Deno projects! Your package
          will also be added to the package lists on our servers, so other users will be able to find it on the
          <router-link to="gallery" class="has-text-dark">Gallery</router-link>!
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Docs"
};
</script>

<style scoped>
</style>
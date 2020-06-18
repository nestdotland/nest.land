<template>
  <div class="hero is-medium" id="docs">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">Documentation</h1>
        <hr class="mini-hr" style="margin-bottom: 1.5rem" />
        <div class="columns is-multiline is-vcentered">
          <div class="column is-half"></div>
          <div class="column is-half"></div>
          <div class="column is-half">
            <p class="title is-5">Installation</p>
            <p>
              It's very easy to begin using nest.land when pushing new Deno packages! You can install our CLI,
              <b>eggs</b>, via Deno.
              <br />
              <br />
            </p>
            <p>Note: You need to upgrade to Deno v1.1.0 or newer in order to use our CLI.</p>
            <hr />
          </div>
          <div class="column is-half">
            <pre><code>$ deno install -A -f --unstable -n eggs https://x.nest.land/eggs@0.1.3/mod.ts</code></pre>
          </div>
          <div class="column is-half">
            <p class="title is-5">Linking your API key</p>
            <p>
              In order to publish packages to the blockchain with our CLI, you must first generate an API key. See
              <router-link to="/#start" class="has-text-dark has-text-underlined">Getting Started</router-link>.
              <br />
              <br />
            </p>
            <p>After you generate your API key, you need to add it in the CLI. To do this, type:</p>
            <hr />
          </div>
          <div class="column is-half">
            <pre><code>$ eggs link --key [your key]</code></pre>
          </div>
          <div class="column is-half">
            <p class="title is-5">Initializing a package</p>
            <p>You'll need to initialize a package with the eggs in order to publish it. To do this, you need to type the following command in the root directory of your project and enter the information requested:</p>
            <hr />
          </div>
          <div class="column is-half">
            <pre><code>$ eggs init</code></pre>
          </div>
          <div class="column is-half">
            <p class="title is-5">Publishing a Package</p>
            <p>
              To publish a package, just navigate to the root of your package and use the command shown:
              <br />
              <br />That's it! After this, you'll be returned a link that you can use in your Deno projects. Your package
              will also be added to the package lists on our servers, so other users will be able to find it on the
              <router-link to="/gallery" class="has-text-dark">Gallery</router-link>
              <br />
              <br />Note: The same command is used to publish a new version to an existing package!
            </p>
            <hr />
          </div>
          <div class="column is-half">
            <pre><code>$ eggs publish</code></pre>
          </div>
          <div class="column is-half">
            <p class="title is-5">Updating all of your packages</p>
            <p>
              Updating your Nest.land package versions is a breeze thanks to
              <a
                class="has-text-dark"
                href="https://github.com/ebebbington"
              >@ebebbington</a>'s addition to the CLI. Just type the command shown to automatically check for and update all nest.land package imports. Not only does this update nest.land packages, but it also can update
              <a
                href="https://deno.land/std/"
                class="has-text-dark"
              >deno.land/std/</a> and
              <a href="https://deno.land/x/" class="has-text-dark">deno.land/x/</a> packages!
              <br />
              <br />
            </p>
            <p>
              More detailed information about this service is avaliable on our CLI
              <a
                class="has-text-dark has-text-underlined"
                href="https://github.com/nestlandofficial/nest.land/tree/master/eggs"
              >README</a>.
            </p>
            <hr />
          </div>
          <div class="column is-half">
            <pre><code>$ eggs update --file file.ts --deps http fs // use specified file and modules</code></pre>
            <br />
            <pre><code>$ eggs update --file file.ts // update all in file.ts</code></pre>
            <br />
            <pre><code>$ eggs update --deps http fs // update fs and http in default deps.ts</code></pre>
          </div>
        </div>
        <p class="subtitle is-5">Technical questions?</p>
        <p>Find us on Discord: tate#5885, zorbyte#4500, and blob#8718</p>
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
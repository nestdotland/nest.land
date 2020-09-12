<template>
  <div class="hero is-light is-medium">
    <div class="hero-body" id="intro">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column">
            <h1 class="title">What is nest.land?</h1>
            <p>
              Nest.land combines 
              <a
                class="has-text-dark has-text-underlined"
                href="https://deno.land/"
              >
                Deno</a>
              with the
              <a
                class="has-text-dark has-text-underlined"
                href="https://www.arweave.org/"
              >
                Arweave</a>. 
              With us, you can publish your Deno modules to the permaweb,
              where they can <b>never</b> be deleted. This avoids a major
              pitfall for web-based module imports while allowing developers
              to leverage Deno's import design!
            </p>
            <hr />
            <div class="columns">
              <div class="column">
                <ul>
                  <li class="subtitle">
                    <font-awesome-icon
                      :icon="['fas', 'trash-alt']"
                      class="left-icon"
                    />
                    Permanent & immutable
                  </li>
                  <li class="subtitle">
                    <font-awesome-icon
                      :icon="['fas', 'globe-americas']"
                      class="left-icon"
                    />
                    Globally accessible
                  </li>
                  <li class="subtitle">
                    <font-awesome-icon
                      :icon="['fas', 'feather-alt']"
                      class="left-icon"
                    />
                    Free
                  </li>
                </ul>
              </div>
              <div class="column">
                <ul>
                  <li class="subtitle">
                    <font-awesome-icon
                      :icon="['fas', 'fingerprint']"
                      class="left-icon"
                    />
                    Secure
                  </li>
                  <li class="subtitle">
                    <font-awesome-icon
                      :icon="['fas', 'fist-raised']"
                      class="left-icon"
                    />
                    Decentralized
                  </li>
                  <li class="subtitle">
                    <font-awesome-icon
                      :icon="['fas', 'code-branch']"
                      class="left-icon"
                    />
                    Works without Git
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="column is-hidden-mobile">
            <package-vector />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Intro",
};
</script>

<style lang="sass" scoped>

.left-icon
  margin-right: 15px

.subtitle
  font-family: "Inconsolata", monospace
</style>

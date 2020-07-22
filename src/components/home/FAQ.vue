<template>
  <div class="hero is-medium is-dark">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">Frequently Asked Questions</h1>
        <div class="columns">
          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="subtitle has-text-dark">
                  Is my password uploaded to the blockchain too?
                </p>
                <p>
                  No, your password is stored in our secure database. In fact,
                  no personal user information is
                  <b>ever</b> uploaded to the blockchain!
                </p>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="subtitle has-text-dark">
                  How does nest.land deal with malicious or broken modules?
                </p>
                <p>
                  If a module is reported to us as malicious or broken, we flag
                  it on our registry. All users will then be warned when
                  importing or updating this module.
                </p>
                <hr />
                <p class="has-text-centered">
                  <a
                    href="https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident"
                    class="has-text-dark issue-text"
                    >Prevents NPM issue: event-stream</a
                  >
                </p>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="subtitle has-text-dark">
                  What if an author takes down a module?
                </p>
                <p>
                  Taking down a module is impossible thanks to the Arweave
                  Blockchain! A module uploaded through our CLI is permanently
                  immutable.
                </p>
                <hr />
                <p class="has-text-centered">
                  <a
                    href="https://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm"
                    class="has-text-dark issue-text"
                    >Prevents NPM issue: left-pad</a
                  >
                </p>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="subtitle has-text-dark">
                  Does nest.land have Deno's Standard Modules built in?
                </p>
                <p>
                  Yes, we do! If you wish to ensure security and immutability of
                  your standard modules, check out nest.land's std
                  <router-link to="/std">mirror</router-link>.
                </p>
              </div>
            </div>
          </div>
        </div>
        <p class="subtitle has-text-right">
          Have more questions? Ask them on our
          <a
            href="https://github.com/nestdotland/nest.land/discussions"
            class="has-text-light has-text-underlined"
            >GitHub Discussions</a
          >
          tab!
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FAQ'
};
</script>

<style lang="sass" scoped>
.card
  border-radius: 20px
  box-shadow: 0 15px 35px rgba(50, 50, 93, .1), 0 5px 15px rgba(0, 0, 0, .07)

  &:hover
    transform: none
    box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02)
    cursor: default

  .issue-text
    font-family: "Inconsolata", monospace

  a
    color: $accentColor
</style>

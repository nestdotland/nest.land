<template>
  <div class="hero is-light is-medium" id="start">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column">
            <img src="../../assets/box_vector.png" alt="Box Vector" />
            <div
              class="notification is-danger is-light"
              v-show="serverError !== ''"
            >
              {{ serverError }}
            </div>
          </div>
          <div class="column">
            <h1 class="title">Getting Started</h1>
            <p>
              You'll need an API key to use our CLI! After generating, see the
              <a
                href="https://docs.nest.land"
                target="_blank"
                rel="noopener noreferrer"
                class="has-text-dark has-text-underlined"
              >
                documentation
              </a>
              .
            </p>
            <hr />
            <div v-show="eggsAPIKey === ''">
              <log-in
                v-show="hasAccount"
                @toggle-has-account="toggleHasAccount"
                @new-error="newError"
                @set-api-key="setAPIKey"
              ></log-in>
              <sign-up
                v-show="!hasAccount"
                @toggle-has-account="toggleHasAccount"
                @new-error="newError"
                @set-api-key="setAPIKey"
              ></sign-up>
            </div>
            <div v-show="eggsAPIKey !== ''" id="token-group">
              <h2 class="subtitle">Your key:</h2>
              <pre id="token-element"><code>{{ eggsAPIKey }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LogIn from "../auth/LogIn.vue";
import SignUp from "../auth/SignUp.vue";

export default {
  name: "RequestKey",
  components: {
    LogIn,
    SignUp
  },
  data() {
    return {
      hasAccount: true,
      userAccount: {},
      verificationSucceeded: false,
      serverError: "",
      eggsAPIKey: ""
    };
  },
  methods: {
    toggleHasAccount(condition) {
      this.hasAccount = condition;
    },
    newError(e) {
      this.serverError = e;
    },
    setAPIKey(key) {
      this.eggsAPIKey = key;
      this.verificationSucceeded = true;
    }
  }
};
</script>

<style lang="sass" scoped>

#token-element
  background-color: #fdbb2d
</style>

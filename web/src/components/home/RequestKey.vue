<template>
  <div class="hero is-light is-medium" id="start">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-hidden-mobile">
            <img src="../../assets/box_vector.png" alt="Box Vector" />
          </div>
          <div class="column">
            <div
              class="notification is-danger is-light"
              v-show="serverError !== ''"
            >{{ serverError }}</div>
            <h1 class="title">Getting Started</h1>
            <p>
              In order to publish packages to the blockchain with our CLI, you must first generate an API key. This key is your cryptographic identity on the blockchain, so don't lose it! After generating, see the
              <router-link to="/#docs" class="has-text-dark">documentation</router-link>.
            </p>
            <hr />
            <div class="field" v-show="verificationSucceeded !== true">
              <div class="control">
                <button
                  class="button is-light is-primary is-medium"
                  :class="status"
                  id="generate-button"
                  @click="recaptcha"
                >Generate an API Key</button>
              </div>
            </div>
            <div v-show="verificationSucceeded === true" id="token-group">
              <h2 class="subtitle">Your key:</h2>
              <pre id="token-element"><code>{{ eggAPIKey }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RequestKey",
  data() {
    return {
      status: "",
      verificationSucceeded: false,
      serverError: "",
      eggAPIKey: "cheese",
    };
  },
  methods: {
    async recaptcha() {
      this.status = "is-loading";
      await this.$recaptchaLoaded();
      const token = await this.$recaptcha("login");
      const url = window.location.href.split("#")[0] + "api/captcha";
      axios({
        method: "post",
        url: url,
        data: {
          token,
        },
      })
        .then(data => {
          // CAPTCHA SUCCEEDED YAY -> Now need to generate an API key
          this.getToken(data);
        })
        .catch(err => (this.serverError = err));
    },
    async getToken(confirmation) {
      this.verificationSucceeded = true;
      this.status = "";
      console.log(confirmation);
    },
  },
};
</script>

<style scoped>
#generate-button {
  font-family: "Inconsolata", monospace;
}
#generate-button::after {
  border-color: transparent transparent black black !important;
}

#token-element {
  background-color: #fdbb2d;
}
</style>
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
            >{{ serverError }}</div>
          </div>
          <div class="column">
            <h1 class="title">Getting Started</h1>
            <p>
              You'll need an API key to use our CLI! After generating, see the
              <router-link to="/#docs" class="has-text-dark">documentation</router-link>.
            </p>
            <hr />
            <div v-show="eggAPIKey === ''">
              <log-in
                v-show="hasAccount"
                @toggle-has-account="toggleHasAccount"
                @new-error="newError"
                @update-user="updateUser"
              ></log-in>
              <sign-up
                v-show="!hasAccount"
                @toggle-has-account="toggleHasAccount"
                @new-error="newError"
                @update-user="updateUser"
              ></sign-up>
            </div>
            <div v-show="eggAPIKey !== ''" id="token-group">
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
import { HTTP } from "../../http-common";
import LogIn from "../auth/LogIn.vue";
import SignUp from "../auth/SignUp.vue";

export default {
  name: "RequestKey",
  components: {
    LogIn,
    SignUp,
  },
  data() {
    return {
      hasAccount: true,
      userAccount: {},
      verificationSucceeded: false,
      serverError: "",
      eggAPIKey: "",
    };
  },
  watch: {
    userAccount: function() {
      console.log("EMMITTED TO ACCOUNT");
      this.getToken();
    },
  },
  methods: {
    toggleHasAccount(condition) {
      this.hasAccount = condition;
    },
    newError(e) {
      this.serverError = e;
    },
    updateUser(newUser) {
      this.userAccount = newUser;
    },
    async getToken() {
      try {
        const response = await HTTP.post("key", {
          data: this.account,
        });
        this.eggAPIKey = response.data.token;
        this.verificationSucceeded = true;
      } catch (err) {
        this.newError(err);
      }
    },
  },
};
</script>

<style scoped>
#token-element {
  background-color: #fdbb2d;
}
</style>
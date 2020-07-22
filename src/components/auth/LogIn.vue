<template>
  <div>
    <div class="field">
      <label class="label">Username</label>
      <div class="control">
        <input
          class="input is-light"
          type="text"
          v-model="username"
          @keyup.enter="recaptcha"
        />
      </div>
    </div>
    <div class="field">
      <label class="label">Password</label>
      <div class="control">
        <input
          class="input is-light"
          type="password"
          v-model="password"
          @keyup.enter="recaptcha"
        />
      </div>
    </div>
    <hr />
    <div class="field">
      <div class="control">
        <button
          class="button is-light is-primary is-medium is-fullwidth"
          :class="buttonStatusClass"
          id="generate-button"
          @click="recaptcha"
        >
          Fetch your API Key
        </button>
      </div>
    </div>
    <a
      class="has-text-dark has-text-underlined"
      @click="$emit('toggle-has-account', false)"
      >No account? Sign up</a
    >
  </div>
</template>

<script>
import { HTTP } from "../../http-common";

export default {
  data() {
    return {
      buttonStatusClass: "",
      username: "",
      password: ""
    };
  },
  methods: {
    async recaptcha() {
      this.buttonStatusClass = "is-loading";
      await this.$recaptchaLoaded();
      const token = await this.$recaptcha("login");
      let captchaResponse, loginResponse;

      if (this.username === "" || this.username.length < 4) {
        this.$emit(
          "new-error",
          "Your username must be greater than 4 characters."
        );
        this.buttonStatusClass = "";
        return;
      }

      if (this.password === "" || this.password.length < 8) {
        this.$emit(
          "new-error",
          "Your password must be greater than 8 characters"
        );
        this.buttonStatusClass = "";
        return;
      }

      try {
        captchaResponse = await HTTP.post("captcha", {
          data: {
            token
          }
        });
        if (captchaResponse.data.success) {
          try {
            loginResponse = await HTTP.post("login-client", {
              data: {
                username: this.username,
                password: this.password
              }
            });
            this.$emit("set-api-key", loginResponse.data.body.apiKey);
          } catch (err) {
            this.$emit("new-error", err);
            this.buttonStatusClass = "";
          }
        } else {
          this.$emit("new-error", "We think that you are a bot. BE GONE, BOT!");
        }
      } catch (err) {
        this.$emit("new-error", err);
        this.buttonStatusClass = "";
      }
    }
  }
};
</script>

<style lang="sass" scoped>

#generate-button
  font-family: "Inconsolata", monospace

  &::after
    border-color: transparent transparent black black !important
</style>

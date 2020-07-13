<template>
  <div>
    <div class="field">
      <label class="label">Username</label>
      <div class="control">
        <input class="input is-light" type="text" v-model="username" @keyup.enter="submitInformation" />
      </div>
    </div>
    <div class="field">
      <label class="label">Password</label>
      <div class="control">
        <input class="input is-light" type="password" v-model="password" @keyup.enter="submitInformation" />
      </div>
    </div>
    <div class="field">
      <label class="label">Confirm Password</label>
      <div class="control">
        <input class="input is-light" type="password" v-model="passwordConfirm" @keyup.enter="submitInformation" />
      </div>
    </div>
    <hr />
    <div class="field">
      <div class="control">
        <button
          class="button is-light is-primary is-medium is-fullwidth"
          :class="buttonStatusClass"
          id="generate-button"
          @click="submitInformation"
        >Create Account and Generate an API Key</button>
      </div>
    </div>
    <a
      class="has-text-dark has-text-underlined"
      @click="$emit('toggle-has-account', true)"
    >Already have an account?</a>
  </div>
</template>

<script>
import { HTTP } from "../../http-common";

export default {
  data() {
    return {
      buttonStatusClass: "",
      username: "",
      password: "",
      passwordConfirm: "",
    };
  },
  methods: {
    async submitInformation() {
      const usernameRegex = /^[a-zA-Z0-9-]+$/;
      if (this.username === "" || this.username.length < 4) {
        this.$emit(
          "new-error",
          "You must choose a username that is greater than 4 characters.",
        );
        this.buttonStatusClass = "";
        return;
      }
      if (this.username.match(usernameRegex) == null) {
        this.$emit(
          "new-error",
          "Your username can only include alphanumeric characters and '-'",
        );
        this.buttonStatusClass = "";
        return;
      }
      if (this.password === "" || this.password.length < 8) {
        this.$emit(
          "new-error",
          "You must choose a password that is greater than 8 characters.",
        );
        this.buttonStatusClass = "";
        return;
      }
      if (this.passwordConfirm === "") {
        this.$emit("new-error", "You must confirm your password.");
        this.buttonStatusClass = "";
        return;
      }
      if (this.password !== this.passwordConfirm) {
        this.$emit("new-error", "Your passwords do not match.");
        this.buttonStatusClass = "";
        return;
      }
      if (this.username === this.password) {
        this.$emit(
          "new-error",
          "You can't use the same username and password.",
        );
        this.buttonStatusClass = "";
        return;
      }

      // Resets error if there was one previously
      this.$emit("new-error", "");
      await this.recaptcha();
    },
    async recaptcha() {
      this.buttonStatusClass = "is-loading";
      await this.$recaptchaLoaded();
      const token = await this.$recaptcha("login");
      let captchaResponse, signupResponse;
      try {
        captchaResponse = await HTTP.post("captcha", {
          data: {
            token,
          },
        });
        if (captchaResponse.data.success) {
          try {
            signupResponse = await HTTP.post("signup-client", {
              data: {
                username: this.username,
                password: this.password,
              },
            });
            this.$emit("set-api-key", signupResponse.data.body.apiKey);
          } catch (err) {
            this.$emit("new-error", err);
          }
        } else {
          this.$emit("new-error", "We think that you are a bot. BE GONE, BOT!");
        }
      } catch (err) {
        this.$emit("new-error", err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#generate-button {
  font-family: "Inconsolata", monospace;
}
#generate-button::after {
  border-color: transparent transparent black black !important;
}
</style>
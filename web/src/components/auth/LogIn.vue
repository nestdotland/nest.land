<template>
  <div>
    <div class="field">
      <label class="label">Username</label>
      <div class="control">
        <input class="input is-light" type="text" v-model="username" />
      </div>
    </div>
    <div class="field">
      <label class="label">Password</label>
      <div class="control">
        <input class="input is-light" type="password" v-model="password" />
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
        >Fetch your API Key</button>
      </div>
    </div>
    <a class="has-text-dark" @click="$emit('toggle-has-account', false)">No account? Sign up here.</a>
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
    };
  },
  methods: {
    async recaptcha() {
      this.buttonStatusClass = "is-loading";
      await this.$recaptchaLoaded();
      const token = await this.$recaptcha("login");
      let captchaResponse, loginResponse;
      try {
        captchaResponse = await HTTP.post("captcha", {
          data: {
            token,
          },
        });
        if (captchaResponse.data.success) {
          try {
            loginResponse = await HTTP.post("login-client", {
              data: {
                username: this.username,
                password: this.password,
              },
            });
            this.$emit("set-api-key", loginResponse.body.key);
            // loginResponse = await fetch("http://localhost:8080/api/getkey", {
            //   headers: {
            //     con
            //   },
            //   body: {
            //     username: this.username,
            //     password: this.password,
            //   },
            //   method: "POST",
            //   mode: "no-cors",
            // });
            // console.log(loginResponse.data);
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
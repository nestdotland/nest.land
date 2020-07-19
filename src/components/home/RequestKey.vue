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
              <a href="https://docs.nest.land" target="_blank" rel="noopener noreferrer" class="has-text-dark has-text-underlined">documentation</a>.
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
      SignUp,
    },
    data() {
      return {
        hasAccount: true,
        userAccount: {},
        verificationSucceeded: false,
        serverError: "",
        eggsAPIKey: "",
        observer: null
      };
    },
    mounted() {
      this.startObserve();
    },
    destroyed() {
      this.endObserve();
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
      },
      startObserve() {
        // IntersectionObserver cannot work in some mobile browsers
        // And actually, this feature is experimental
        const isObserverAvailable =
          'IntersectionObserver' in window &&
          'IntersectionObserverEntry' in window &&
          'intersectionRatio' in window.IntersectionObserverEntry.prototype;
        if (isObserverAvailable) {
          this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.intersectionRatio <= 0) {
                this.clearHash();
              }
            });
          });
          this.observer.observe(this.$el);
        }
        // downgrade to scroll event listener
        else {
          this.observer = this.throttle(this.scrollHandler, 500);
          window.addEventListener('scroll', this.observer);
        }
      },
      endObserve() {
        if (this.observer) {
          this.observer.disconnect();
        } else {
          window.removeEventListener('scroll', this.observer);
        }
      },
      scrollHandler() {
        const offset = this.$el.getBoundingClientRect();
        const offsetTop = offset.top;
        const offsetBottom = offset.bottom;
        if (offsetTop > window.innerHeight || offsetBottom < 0) {
          this.clearHash();
        }
      },
      clearHash() {
        location.hash = '_';
        history.replaceState(
          null,
          document.title,
          location.pathname + location.search
        );
      },
      throttle(func, interval) {
        let timeout;
        return (...args) => {
          if (!timeout) {
            timeout = setTimeout(() => {
              timeout = null;
              func(args);
            }, interval);
          }
        };
      }
    }
  };
</script>

<style lang="sass" scoped>

  #token-element
    background-color: #fdbb2d

</style>

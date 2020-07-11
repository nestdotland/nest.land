<template>
  <div id="app">
    <transition name="loading">
      <div class="LoadingLine" v-if="loading"></div>
    </transition>
    <router-view></router-view>
    <nest-footer></nest-footer>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    this.showLoading();
  },
  methods: {
    showLoading() {
      this.loading = true;
      setTimeout(() => (this.loading = false), 440);
    },
  },
  watch: {
    $route(to, from) {
      if (to.path === from.path) return;

      this.showLoading();
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@800&display=swap");
@import url("https://fonts.googleapis.com/css?family=Inconsolata");

// Colors
$bg-color: rgb(255, 255, 255);
$dot-color: #22c1c3;

// Dimensions
$dot-size: 2px;
$dot-space: 70px;

::selection {
  background: #20b39c;
  color: #fff;
}

::-moz-selection {
  background: #20b39c;
  color: #fff;
}

@media screen and (max-width: 769px) {
  .reverse-column-order {
    display: flex;
    flex-direction: column-reverse;
  }
}

.has-text-underlined {
  text-decoration: underline;
}

.label {
  font-weight: 500 !important;
}

.nest-input {
  border: none !important;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
}

.nest-gradient-hero {
  background: linear-gradient(271deg, #22c1c3, #fdbb2d);
  background-size: 400% 400%;

  -webkit-animation: nestGradient 6s ease infinite;
  -moz-animation: nestGradient 6s ease infinite;
  animation: nestGradient 6s ease infinite;
}

.nest-dots-hero {
  background: linear-gradient(
        90deg,
        $bg-color ($dot-space - $dot-size),
        transparent 1%
      )
      center,
    linear-gradient($bg-color ($dot-space - $dot-size), transparent 1%) center,
    $dot-color;
  background-size: $dot-space $dot-space;
}

.mini-hr {
  height: 10px;
  width: 20%;
  border-radius: 2px;
  margin-bottom: 0;
  background: linear-gradient(271deg, #22c1c3, #fdbb2d);
  background-size: 400% 400%;

  -webkit-animation: nestGradient 6s ease infinite;
  -moz-animation: nestGradient 6s ease infinite;
  animation: nestGradient 6s ease infinite;
}
.LoadingLine {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 3px;
  z-index: 10000000;

  opacity: 1;
  background: linear-gradient(271deg, #22c1c3, #fdbb2d);
  background-size: 400% 400%;

  -webkit-animation: nestGradient 6s ease infinite;
  -moz-animation: nestGradient 6s ease infinite;
  animation: nestGradient 6s ease infinite;
}
@-webkit-keyframes nestGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@-moz-keyframes nestGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes nestGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.fade-enter,
.slide-down-enter,
.slide-up-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 1s;
  transition-timing-function: ease-in;
  transition-delay: 0.5s;
}
.slide-up-enter-active {
  animation: slide-in-up 1s ease-out forwards;
  transition: opacity 1s;
}
.slide-down-enter-active {
  animation: slide-in-down 1s ease-out forwards;
  transition: opacity 1s;
}
.loading-enter-active,
.loading-enter-to-active {
  transition: width 0.43s, opacity 0.47s ease;
}
.loading-leave-active,
.loading-leave-to-active {
  transition: opacity 0.23s ease;
}
.loading-enter {
  width: 0;
  opacity: 0;
}
.loading-enter-to,
.loading-leave {
  width: 100vw;
  opacity: 1;
}
.loading-leave-to {
  width: 100vw;
  opacity: 0;
}
@keyframes slide-in-down {
  from {
    transform: translateY(-40px);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes slide-in-up {
  from {
    transform: translateY(40px);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes slide-out {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-20px);
  }
}

.grecaptcha-badge {
  display: none !important;
}

.nest-footprints-hero {
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-attachment: fixed !important;
  background-image: url("/nest-hero.svg") !important;
}
</style>

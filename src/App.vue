<template>
  <div id="app">
    <router-view></router-view>
    <nest-footer></nest-footer>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@800&display=swap");
@import url("https://fonts.googleapis.com/css?family=Inconsolata");

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
</style>

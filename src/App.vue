<template>
  <div id="app">
    <router-view></router-view>
    <nest-footer></nest-footer>
  </div>
</template>

<script>
import NestFooter from "./components/Footer";

export default {
  name: "App",
  components: {
    NestFooter
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@800&display=swap");
@import url("https://fonts.googleapis.com/css?family=Inconsolata");

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

.slide-down-enter,
.slide-up-enter {
  opacity: 0;
}
.slide-up-enter-active {
  animation: slide-in-up 1s ease-out forwards;
  transition: opacity 1s;
}
.slide-down-enter-active {
  animation: slide-in-down 1s ease-out forwards;
  transition: opacity 1s;
}
/* 
.slide-leave {

}
.slide-leave-active {
  animation: slide-out 0.5s ease-out forwards;
  transition: opacity 0.5s;
  opacity: 0;
}
*/
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

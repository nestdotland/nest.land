<template>
  <transition name="slide-down" type="animation" appear>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/">
          <img src="../assets/nest_light.png" />
        </router-link>
        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="main-nav"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="main-nav" class="navbar-menu">
        <div class="navbar-end">
          <router-link class="navbar-item" to="gallery" active-class="active-link" exact>The Gallery</router-link>
          <a class="navbar-item" href="#start">Documentation</a>
          <div class="navbar-item">
            <div class="buttons">
              <a class="button is-light is-primary" href="#start" id="get-started-button">
                <strong>Get Started</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </transition>
</template>

<script>
export default {
  name: "NestNav"
};
</script>

<script>
document.addEventListener("DOMContentLoaded", () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
      el.addEventListener("click", () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }
});
</script>

<style scoped>
#get-started-button {
  font-family: "Inconsolata", monospace;
}

.navbar-item:hover {
  background: none !important;
}

.navbar-item.active-link {
  border-top: 0.4rem solid #fdbb2d;
  padding-top: 0.1rem;
}
</style>
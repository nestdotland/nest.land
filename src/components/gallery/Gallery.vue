<template>
  <div class="gallery">
    <div class="hero is-medium is-light">
      <div class="hero-head">
        <nest-nav></nest-nav>
      </div>
      <div class="hero-body">
        <div class="container has-text-centered">
          <transition name="slide-up" type="animation" appear>
            <h1 class="title is-2">The Gallery</h1>
          </transition>
          <div class="columns is-centered">
            <div class="column is-half">
              <transition name="fade" type="transition" appear>
                <div class="field">
                  <p class="control has-icons-left">
                    <input
                      class="input is-rounded nest-input"
                      type="text"
                      placeholder="Search for packages"
                    />
                    <span class="icon is-small is-left">
                      <font-awesome-icon :icon="['fa', 'search']" />
                    </span>
                  </p>
                </div>
              </transition>
            </div>
          </div>
          <p class="subtitle">
            Trying to add a package? See
            <a href>Getting Started</a>.
          </p>
        </div>
      </div>
      <div class="hero-foot">
        <nav class="tabs is-boxed is-fullwidth">
          <div class="container">
            <ul>
              <li>
                <a class="no-hover">100 Packages</a>
              </li>
              <li>
                <a class="no-hover">90 Authors</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
    <gradient-bar></gradient-bar>
    <div class="hero is-light is-small">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-multiline">
            <div class="column is-3" v-for="item in items" v-bind:key="item.id">
              <card v-bind:item="item"></card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NestNav from "../Nav";
import GradientBar from "../GradientBar";
import Card from "../Card";

export default {
  data() {
    return {
      items: [
        {
          packageTitle: "Hello World",
          packageURL: "https://nest.land/x/bruh",
          packageInfo: {
            author: "Nanny McFee",
            docsLink: "https://github.com/nannymcfee/helloworld",
            description: "A simple, easy to use hello world package!",
            version: "1.0.1",
            publishedDate: "datetime object here"
          }
        },
        {
          packageTitle: "Cheese",
          packageURL: "https://nest.land/x/bruh",
          packageInfo: {
            author: "Zorbyte",
            docsLink: "https://github.com/nannymcfee/helloworld",
            description: "A simple, easy to use hello world package!",
            version: "1.0.1",
            publishedDate: "datetime object here"
          }
        },
        {
          packageTitle: "a1",
          packageURL: "https://nest.land/x/bruh",
          packageInfo: {
            author: "sauce",
            docsLink: "https://github.com/nannymcfee/helloworld",
            description: "A simple, easy to use hello world package!",
            version: "1.0.1",
            publishedDate: "datetime object here"
          }
        },
        {
          packageTitle: "yo",
          packageURL: "https://nest.land/x/bruh",
          packageInfo: {
            author: "mama",
            docsLink: "https://github.com/nannymcfee/helloworld",
            description: "A simple, easy to use hello world package!",
            version: "1.0.1",
            publishedDate: "datetime object here"
          }
        }
      ]
    };
  },
  components: {
    NestNav,
    GradientBar,
    Card
  }
};
</script>

<style scoped>
.no-hover:hover {
  background: none !important;
  cursor: default;
}
</style>
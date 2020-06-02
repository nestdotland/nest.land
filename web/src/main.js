import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import NestFooter from "./components/Footer";

import { routes } from "./routes";
import "bulma/css/bulma.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHeart,
  faFeatherAlt,
  faTrashAlt,
  faUniversalAccess,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faHeart,
  faFeatherAlt,
  faTrashAlt,
  faUniversalAccess,
  faSearch,
  faGithub,
);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("nest-footer", NestFooter);

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: "history",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return {
        selector: to.hash,
      };
    }
    return {
      x: 0,
      y: 0,
    };
  },
});

new Vue({
  router,
  render: h => h(App),
}).$mount("#app");

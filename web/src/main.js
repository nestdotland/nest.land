import Vue from "vue";
import VueRouter from "vue-router";
import { routes } from "./routes";
import { VueReCaptcha } from "vue-recaptcha-v3";
import VueLodash from "vue-lodash";
import lodash from "lodash";

import App from "./App.vue";
import NestFooter from "./components/Footer";
import PackageVector from "./assets/package_vector.svg";

import "bulma/css/bulma.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHeart,
  faFeatherAlt,
  faTrashAlt,
  faGlobeAmericas,
  faSearch,
  faFingerprint,
  faFistRaised,
  faCodeBranch,
  faParachuteBox,
  faBoxOpen,
  faCubes,
  faFolder,
  faLevelUpAlt,
  faFileCode,
  faBookOpen,
  faUser,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faHeart,
  faFeatherAlt,
  faTrashAlt,
  faGlobeAmericas,
  faFingerprint,
  faFistRaised,
  faCodeBranch,
  faParachuteBox,
  faBoxOpen,
  faSearch,
  faCubes,
  faGithub,
  faFolder,
  faLevelUpAlt,
  faFileCode,
  faBookOpen,
  faUser,
  faCalendarAlt,
);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("nest-footer", NestFooter);
Vue.component("package-vector", PackageVector);

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueReCaptcha, { siteKey: "6Lepmf8UAAAAABsjF9Fo0kqzm3_2KcHHM2fX43YH" });
Vue.use(VueLodash, { lodash: lodash });

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
  render: (h) => h(App),
}).$mount("#app");

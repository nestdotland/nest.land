import Vue from 'vue'
import App from './App.vue'
import 'bulma/css/bulma.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faFeatherAlt, faTrashAlt, faUniversalAccess} from '@fortawesome/free-solid-svg-icons'
import { faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
    faHeart,
    faFeatherAlt,
    faTrashAlt,
    faUniversalAccess,
    faGithub,
    faDiscord)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

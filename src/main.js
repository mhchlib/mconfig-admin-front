import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './plugins'
import store from './store'
import { sync } from 'vuex-router-sync'

import VJsoneditor from 'v-jsoneditor'

import axios from './http/http'
Vue.prototype.$http = axios

var VueCodeMirror = require('vue-codemirror-lite')

Vue.use(VueCodeMirror)


Vue.use(VJsoneditor)

Vue.config.productionTip = false

sync(store, router)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App),
}).$mount('#app')

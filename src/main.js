import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './plugins'
import store from './store'
import { sync } from 'vuex-router-sync'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import VJsoneditor from 'v-jsoneditor'

Vue.use(ElementUI);

import axios from './http/http'



Vue.prototype.$http = axios

import {setCookie,getCookie,delCookie} from './util/cookie'
Vue.prototype.$cookieStore = {setCookie,getCookie,delCookie}


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

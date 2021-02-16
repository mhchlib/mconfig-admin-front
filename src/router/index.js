// Imports
import Vue from 'vue'
import Router from 'vue-router'
import { trailingSlash } from '@/util/helpers'
import {
  layout,
  route,
} from '@/util/routes'
import { setCookie, getCookie, delCookie } from '../util/cookie'


Vue.use(Router)
import Login from '@/views/Login.vue'

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash }
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes: [
    layout('Default', [
      route('Dashboard'),
      route('Dashboard', null, '/'),
      route('App', null, '/app'),
      route('Env', null, '/app/env/:app'),
      route('Configs', null, '/app/configs/:app/:env'),
      route('Config', null, '/app/config'),
      route('Status', null, '/status/:cluster'),
      route('Status', null, '/status/'),
      route('Clusters', null, '/clusters'),
      route('Intro', null, '/intro'),
      route('Message', null, '/msg'),
      route('Logs', null, '/logs'),
      route('Profile', null, '/profile'),
    ]),
    { path: '/login', component: Login },
  ],
})

router.beforeEach((to, from, next) => {
  if(!to.path.endsWith('login') && !to.path.endsWith('login/')){
    //check token exist
    console.log(getCookie("token"))
    if(!getCookie("token")){
      return next({path:'/login'})
    }
  }
  return to.path.endsWith('/') ? next() : next(trailingSlash(to.path))
})

export default router

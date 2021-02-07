// Imports
import Vue from 'vue'
import Router from 'vue-router'
import { trailingSlash } from '@/util/helpers'
import {
  layout,
  route,
} from '@/util/routes'

Vue.use(Router)

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
  ],
})

router.beforeEach((to, from, next) => {
  return to.path.endsWith('/') ? next() : next(trailingSlash(to.path))
})

export default router

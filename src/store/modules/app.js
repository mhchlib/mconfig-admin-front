// Pathify
import { make } from 'vuex-pathify'

// Data
const state = {
  drawer: null,
  drawerImage: true,
  mini: false,
  items: [{
      title: 'Dashboard',
      icon: 'mdi-view-dashboard',
      to: '/',
    },
    {
      title: '应用管理',
      icon: 'mdi-wall',
      to: '/app',
    },
     {
      title: '实时概况',
      icon: 'mdi-midi-port',
      to: '/status',
    },
    {
      title: '集群管理',
      icon: 'mdi-vector-difference',
      to: '/clusters',
    },
    {
      title: '操作介绍',
      icon: 'mdi-format-line-style',
      to: '/intro',
    },
    {
      title: '操作日志',
      icon: 'mdi-chart-bubble',
      to: '/logs',
    },
    {
      title: '消息通知',
      icon: 'mdi-bell',
      to: '/msg',
    },
    {
      title: '用户信息',
      icon: 'mdi-account',
      to: '/profile',
    },
  ],
}

const mutations = make.mutations(state)

const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
    //
  },
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}

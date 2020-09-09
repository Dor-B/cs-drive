import Vue from 'vue'
import VueRouter from  'vue-router'

// import Client from '../Client.vue'
// import Admin from '../Admin.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "client",
    component: () => import('../Client.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../Admin.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
import Vue from 'vue'
import VueRouter from  'vue-router'

import App from '../App.vue'
import Admin from '../Admin.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "app",
    component: App
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
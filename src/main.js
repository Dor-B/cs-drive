import Vue from 'vue'
import App from './App.vue'
import router from './router' // loads from src/router/index.js
import vuetify from './plugins/vuetify'
import { rtdbPlugin } from 'vuefire'
import AsyncComputed from 'vue-async-computed'

Vue.use(rtdbPlugin, {wait: true})
Vue.use(AsyncComputed)

Vue.config.productionTip = false

// eslint-disable-line no-unused-vars
new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')

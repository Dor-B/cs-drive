import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import { rtdbPlugin } from 'vuefire'

Vue.use(rtdbPlugin, {wait: true})

Vue.config.productionTip = false

// eslint-disable-line no-unused-vars
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

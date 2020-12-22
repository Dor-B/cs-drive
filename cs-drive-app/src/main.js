import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import vuetify from "./plugins/vuetify";
import AsyncComputed from "vue-async-computed";
import "./registerServiceWorker";

Vue.config.productionTip = false;
Vue.use(AsyncComputed);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");

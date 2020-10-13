import Vue from 'vue'
import vuetify from './plugins/vuetify';
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import "./styles/global.scss";

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

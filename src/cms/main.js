import Vue from 'vue';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import directives from './directives';

import './styles/global.scss';
import './filters';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  directives,
  vuetify,
  render: h => h(App)
}).$mount('#app')

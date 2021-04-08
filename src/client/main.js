import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from '../cms/store';

import 'normalize.css';
import './styles/app.scss';
import './directives';


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

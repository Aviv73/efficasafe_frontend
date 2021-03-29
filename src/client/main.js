import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from '../cms/store';
import directives from './directives';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronRight, faChevronLeft, faTimes, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faChevronRight, faChevronLeft, faTimes, faEllipsisH);
Vue.component('font-awesome-icon', FontAwesomeIcon);

import 'normalize.css';
import './styles/app.scss';


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  directives,
  render: h => h(App)
}).$mount("#app");

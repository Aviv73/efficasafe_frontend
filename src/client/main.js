import Vue from 'vue';
import App from './App.vue';
// import './registerServiceWorker'; //TEMP
import router from './router';
import store from '../cms/store';
import VueTour from 'vue-tour';
import VueMeta from 'vue-meta'

import 'normalize.css';
import './styles/app.scss';
import './directives';
import '../cms/filters';
import './validation';
import JsonExcel from "vue-json-excel";

require('vue-tour/dist/vue-tour.css');
Vue.use(VueTour);
Vue.use(VueMeta)
Vue.component("downloadExcel", JsonExcel);

import VueKeepScrollPosition from 'vue-keep-scroll-position';
Vue.use(VueKeepScrollPosition, { smooth: true });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

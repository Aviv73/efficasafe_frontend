import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from '../cms/store';
import VueTour from 'vue-tour';

import 'normalize.css';
import './styles/app.scss';
import './directives';
import '../cms/filters';
import './validation';

// import Axios from 'axios';

// var axios = Axios.create({
//     withCredentials: true
// });

require('vue-tour/dist/vue-tour.css');
Vue.use(VueTour);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

// (async ()=>{
//   await axios.post('//localhost:3000/api/login', {});
//   axios.post('//localhost:3000/api/acc', {});
// })()
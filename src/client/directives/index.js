import Vue from 'vue';
import { VueHammer } from 'vue2-hammer';
import vueDebounce from 'vue-debounce';



VueHammer.config.swipe = {
    threshold: 200
};
Vue.use(VueHammer);

Vue.use(vueDebounce, {
    listenTo: 'input',
    defaultTime: '400ms'
});
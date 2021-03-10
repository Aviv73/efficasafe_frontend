import Vue from 'vue';
import { VueHammer } from 'vue2-hammer';



VueHammer.config.swipe = {
    threshold: 200
};
Vue.use(VueHammer);
import Vue from 'vue';
import moment from 'vue-moment';

Vue.use(moment);

Vue.filter('ref-txt', (val) => {
    const doiIdx = val.indexOf('doi');
    if (doiIdx !== -1) {
        return val.substring(0, doiIdx).trim();
    }
    const PmidIdx = val.indexOf('PMID');
    if (PmidIdx !== -1) {
        return val.substring(0, PmidIdx).trim();
    }
    return val;
});

Vue.filter('capitalize', (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
});

Vue.filter('remove-ending-dot', (val) => {
    const lastChar = val.charAt(val.length - 1);
    if (lastChar !== '.') return val;
    return val.substring(0, val.length - 1);
});
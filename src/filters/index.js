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

Vue.filter('material-name', (val) => {
    return val.replace(/\[(.*?)\]/g, '');
});
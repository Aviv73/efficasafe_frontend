import Vue from 'vue';
import vueMoment from 'vue-moment';
import moment from 'moment';

Vue.use(vueMoment);

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

Vue.filter('display-snake-case', (val) => {
    return val.replace(/_/g, ' ');
});

Vue.filter('timeFilter', (val, format) => {
    if (!isValidDate(val)) return 'Invalin Date';
    return format? moment(val, format).format(format) : moment(val);
});

function isValidDate(time) {
    try {
        if (!time) return false;
        const dateItem = new Date(time);
        if (isNaN(+dateItem)) return false;
        return true;
    } catch(err) {
        return false
    }
}
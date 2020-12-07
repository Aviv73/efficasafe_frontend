import Vue from 'vue';
import vueDebounce from 'vue-debounce';

Vue.use(vueDebounce, {
    listenTo: 'input',
    defaultTime: '500ms'
});

Vue.directive('highlight-text', {
    inserted(el, binding) {
        const highlightedTxt = el.innerHTML.replaceAll(binding.arg, `<span class="yellow lighten-1">${binding.arg}</span>`);
        el.innerHTML = highlightedTxt;
    }
});
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

Vue.directive('recommendation-color', {
    inserted(el, binding) {
        const txt = binding.arg || el.innerText;
        switch (txt.toLowerCase()) {
            case 'avoid coadministration':
                el.style.color = '#F44336';
                if (binding.arg) {
                    el.style.borderColor = '#F44336';
                }
                break;
            case 'caution should be taken':
            case 'coadministration is not contraindicated but caution should be taken':
            case 'coadministration is possible but caution should be taken':
                el.style.color = '#FB8C00';
                if (binding.arg) {
                    el.style.borderColor = '#FB8C00';
                }
                break;
            case 'coadministration is not contraindicated':
            case 'coadministration is possible':
            case 'coadministration is advised':
                el.style.color = '#4CAF50';
                if (binding.arg) {
                    el.style.borderColor = '#4CAF50';
                }
                break;
            default:
                el.style.color = '#2196F3';
                if (binding.arg) {
                    el.style.borderColor = '#2196F3';
                }
                break;
          }
    }
});
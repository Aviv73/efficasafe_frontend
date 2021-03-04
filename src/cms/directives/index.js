import Vue from 'vue';
import vueDebounce from 'vue-debounce';

import { utilService } from '@/cms/services/util.service';

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

Vue.directive('localize-material-name', {
    inserted(el, binding, vnode) {
        const { materialNamesMap } = vnode.context.$store.getters;
        if (!materialNamesMap || binding.arg) return;
        Object.keys(materialNamesMap).forEach(materialName => {
            if (el.innerText.includes(materialName)) {
                utilService.replaceTextContent(el, materialName, materialNamesMap[materialName]);
            }
        });
    }
});

Vue.directive('recommendation-color', {
    inserted(el, binding) {
        const txt = binding.arg || el.innerText;
        switch (txt.toLowerCase()) {
            case 'avoid coadministration':
            case 'coadministration is not advised':
                el.style.color = '#F44336';
                if (binding.arg) {
                    // Vuetufy 'error'
                    el.style.borderColor = '#F44336';
                }
                break;
            case 'caution should be taken':
            case 'coadministration is not contraindicated but caution should be taken':
            case 'coadministration is possible but caution should be taken':
                el.style.color = '#FB8C00';
                if (binding.arg) {
                    // Vuetufy 'warning'
                    el.style.borderColor = '#FB8C00';
                }
                break;
            case 'coadministration is not contraindicated':
            case 'coadministration is possible':
            case 'coadministration is advised':
            case 'coadministration is not contraindicated and may even be advised':
            case 'coadministration is possible and may even be advised':
                el.style.color = '#4CAF50';
                if (binding.arg) {
                    // Vuetufy 'success'
                    el.style.borderColor = '#4CAF50';
                }
                break;
            default:
                el.style.color = '#2196F3';
                if (binding.arg) {
                    // Vuetufy 'primary'
                    el.style.borderColor = '#2196F3';
                }
                break;
          }
    }
});
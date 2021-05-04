import Vue from 'vue';
import { VueHammer } from 'vue2-hammer';
import vueDebounce from 'vue-debounce';

import { interactionService } from '@/cms/services/interaction.service';


VueHammer.config.swipe = {
    threshold: 200
};
Vue.use(VueHammer);

Vue.use(vueDebounce, {
    listenTo: 'input',
    defaultTime: '400ms'
});

Vue.directive('set-sticky-class-name', {
    inserted(el, binding) {
        const observer = new IntersectionObserver( 
            ([e]) => {
                if (e.boundingClientRect.top === 43) {
                    e.target.classList.add(binding.arg, e.intersectionRatio < 1);
                } else {
                    e.target.classList.remove(binding.arg, e.intersectionRatio < 1);
                }
            },
            {
                rootMargin: '-44px 0px 0px 0px',
                threshold: [0, 1]
            }
        );
          
        observer.observe(el);
    }
});

Vue.directive('refs-tooltip', {
    update(el, binding, vnode, { isRootInsert }) {
        const { pathwaysFirst, pathwaysSecond, dynamicTxt } = binding.modifiers;
        const { combinedRefs, side2Refs, interactionRefCount } = binding.value;
        if (isRootInsert && !dynamicTxt) return;
        
        const elSubs = el.querySelectorAll('sub');
        for (let i = 0; i < elSubs.length; i++) {
            const refIdxs = interactionService.getRefsOrder(elSubs[i].innerText);
            if (!refIdxs.length) continue;
            
            elSubs[i].innerText = interactionService.formatRefStrs(elSubs[i].innerText);
            elSubs[i].addEventListener('mouseenter', setTooltipPos);
            
            const refs = getRefsFromIdxs(refIdxs, combinedRefs);
            const elTooltip = document.createElement('aside');
            elTooltip.classList.add('refs-tooltip');
            
            let htmlStr = '<ul>';
            for (let j = 0; j < refs.length; j++) {
                let draftIdx = combinedRefs.findIndex(ref => ref && ref.draftIdx === refs[j].draftIdx) + 1;
                if (pathwaysFirst) {
                    const sameRefs = combinedRefs.filter(ref => ref && ref.draftIdx === refs[j].draftIdx);
                    if (sameRefs.length > 1) {
                        const ref = sameRefs.find(ref => side2Refs.findIndex(currRef => currRef.link === ref.link) === -1);
                        draftIdx = combinedRefs.indexOf(ref) + 1;
                    }
                }
                if (pathwaysSecond) {
                    const idx = side2Refs.findIndex(ref => ref && ref.draftIdx === refs[j].draftIdx);
                    if (idx !== -1) draftIdx = idx + 1 + interactionRefCount;
                }
                htmlStr += `
                    <li class="refs-tooltip-item">
                        <p><span>${draftIdx}</span>. ${formatedRefTxt(refs[j].txt)}</p>
                        <a href="${refs[j].link}" class="ref-link" target="_blank">${refs[j].link}</a>
                    </li>
                `;
            }
            htmlStr += '</ul>';
            elTooltip.innerHTML = htmlStr;
            elSubs[i].appendChild(elTooltip);
        }
    }
});

function setTooltipPos(ev) {
    const elTooltip = ev.target.querySelector('.refs-tooltip');
    if (ev.clientX + elTooltip.offsetWidth > window.innerWidth) {
        elTooltip.style.transformOrigin = 'top right';
        elTooltip.style.left = 'unset';
        elTooltip.style.right = '0';
    }
}

function getRefsFromIdxs(refIdxs, combinedRefs) {
    const refs = [];
    refIdxs.forEach((idx) => {
        refs.push({ ...combinedRefs[idx - 1] });
    });
    return refs;
}

function formatedRefTxt(fullRefTxt) {
    if (!fullRefTxt) return '';
    const doiIdx = fullRefTxt.indexOf('doi');
    if (doiIdx !== -1) {
        return fullRefTxt.substring(0, doiIdx).trim();
    }
    const PmidIdx = fullRefTxt.indexOf('PMID');
    if (PmidIdx !== -1) {
        return fullRefTxt.substring(0, PmidIdx).trim();
    }
    return fullRefTxt;
}
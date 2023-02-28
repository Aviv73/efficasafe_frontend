import Vue from 'vue';
import { VueHammer } from 'vue2-hammer';
import vueDebounce from 'vue-debounce';
import VueClipboard from 'vue-clipboard2';

import { interactionUIService } from '@/cms/services/interaction-ui.service';


VueHammer.config.swipe = {
    threshold: 200
};
Vue.use(VueHammer);

Vue.use(vueDebounce, {
    listenTo: 'input',
    defaultTime: '400ms'
});

Vue.use(VueClipboard);

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

Vue.directive('refs-tooltip-material', {
    inserted(el, binding) {
        const {material, refCountMap} = binding.value
        const elSubs = el.querySelectorAll('sub');
        elSubs.forEach(elSub => {
            const refs = material.type === 'drug' ? elSub.innerText.substring(1,elSub.innerText.length -1).split(',').sort() : elSub.innerText.trim().substring(1,elSub.innerText.length -1).split(',')
            elSub.addEventListener('mouseenter', setTooltipPos);
            const elTooltip = document.createElement('ul');
            elTooltip.classList.add('refs-tooltip');
            elTooltip.classList.add('refs-tooltip-material');
            let htmlStr = '';
            refs.forEach(ref => {
                if(material.type !== 'drug'){
                    if(!ref.includes('-')){
                        const originalRef = +Object.keys(refCountMap).find(key => refCountMap[key] === +ref);
                        const fullRef = material.refs.find(ref => ref.draftIdx === originalRef)
                        if(!fullRef) return
                        htmlStr += `<li class="tooltip-item">
                            <p style="display: inline-block; font-size:11px; margin: 0;"><span>${ref}</span>.${fullRef.txt}</p>
                            <a
                                class="ref-link"
                                target="_blank"
                                style="word-break: break-all;"
                                href="${fullRef.link}"
                            >
                                ${fullRef.link}
                            </a>
                        </li>`;
                    }else{
                        let firstRef = +ref.split('-')[0]
                        let LastRef = +ref.split('-')[1]
                        for (let i = firstRef; i <= LastRef; i++) {
                            const originalRef = +Object.keys(refCountMap).find(key => refCountMap[key] === i);
                            let fullRef = material.refs.find(ref => ref.draftIdx === originalRef)
                            if(!fullRef) return
                            htmlStr += `<li class="tooltip-item">
                                <p style="display: inline-block; font-size:12px; margin: 0;"><span>${i}</span>.${fullRef.txt}</p>
                                <a
                                    class="ref-link"
                                    target="_blank"
                                    style="word-break: break-all;"
                                    href="${fullRef.link}"
                                >
                                    ${fullRef.link}
                                </a>
                            </li>`;
                        }
                    }
                }else{
                    const originalRef = Object.keys(refCountMap).find(key => refCountMap[key] === +ref);
                    const fullRef = material.dBankRefs.find(ref => ref.ref_id === originalRef)
                    if(!fullRef) return 
                    htmlStr += `<li class="tooltip-item">
                        <p style="display: block; font-size:11px; margin: 0;"><span>${ref}</span>.${fullRef.citation || fullRef.title}</p>
                        <a
                            class="ref-link"
                            target="_blank"
                            style="word-break: break-all;"
                            href="${fullRef.pubmed_id ? `https://pubmed.ncbi.nlm.nih.gov/${fullRef.pubmed_id}` : fullRef.url}"
                        >
                            ${fullRef.pubmed_id ? `https://pubmed.ncbi.nlm.nih.gov/${fullRef.pubmed_id}` : fullRef.url}
                        </a>
                    </li>`;
                }
            })
            elTooltip.innerHTML = htmlStr;
            elSub.appendChild(elTooltip);
        })
    }
});

Vue.directive('refs-tooltip', {
    inserted(el, binding) {
        const { dBank } = binding.modifiers;
        const { interactionRefs } = binding.value;
        if (!dBank) return;
        
        const elSubs = el.querySelectorAll('sub');
        for (let i = 0; i < elSubs.length; i++) {
            const refsOrder = interactionUIService.getRefsOrder(elSubs[i].innerText);
            const refs = getRefsFromIdxs(refsOrder, interactionRefs);
            elSubs[i].addEventListener('mouseenter', setTooltipPos);
            const elTooltip = document.createElement('aside');
            elTooltip.classList.add('refs-tooltip');
            let htmlStr = '<ul>';
            refs.forEach(ref => {
                htmlStr += `<li class="tooltip-item">
                    <p style="display: block;"><span>${ref.draftIdx}</span>.${ref.citation || ref.title}</p>
                    <a
                        class="ref-link"
                        target="_blank"
                        style="word-break: break-all;"
                        href="${ref.pubmed_id ? `https://pubmed.ncbi.nlm.nih.gov/${ref.pubmed_id}` : ref.url}"
                    >
                        ${ref.pubmed_id ? `https://pubmed.ncbi.nlm.nih.gov/${ref.pubmed_id}` : ref.url}
                    </a>
                </li>`;
            });
            htmlStr += '</ul>';
            elTooltip.innerHTML = htmlStr;
            elSubs[i].appendChild(elTooltip);
        }
    },
    update(el, binding, vnode, { isRootInsert }) {
        const { pathwaysFirst, pathwaysSecond, dynamicTxt, dBank, asGiven } = binding.modifiers;
        const { combinedRefs, side2Refs, refNums } = binding.value;
        if ((isRootInsert && !dynamicTxt) || dBank) return;
        
        const elSubs = el.querySelectorAll('sub');
        for (let i = 0; i < elSubs.length; i++) {
            let refIdxs = interactionUIService.getRefsOrder(elSubs[i].innerText);
            // const refNums = elSubs[i].getAttribute('refNums');
            // if (asGiven) refIdxs = elSubs[i].innerText.slice(1, elSubs[i].innerText.length-1).split(',').filter(Boolean).reduce((acc, c) => [...acc, ...c.split('-').filter(Boolean).map(_ => +_.trim())], []);
            if (refNums) refIdxs = refNums.slice(1, refNums.length-1).split(',').filter(Boolean).reduce((acc, c) => [...acc, ...c.split('-').filter(Boolean).map(_ => +_.trim())], []);
            if (!refIdxs.length){
                elSubs[i].classList.add('regular-sub')
                continue;
            } 
            refIdxs.sort((a,b) => {
                if(a > b) return 1
                if(a < b) return -1
                return 0
            })
            if (!asGiven) elSubs[i].innerText = interactionUIService.formatRefStrs(elSubs[i].innerText);
            elSubs[i].addEventListener('mouseenter', setTooltipPos);
            
            let refs = getRefsFromIdxs(refIdxs, combinedRefs);
            if (asGiven) refs = refIdxs.map(c => combinedRefs[c-1]);
            const elTooltip = document.createElement('aside');
            elTooltip.classList.add('refs-tooltip');
            
            let htmlStr = '<ul>';
            for (let j = 0; j < refs.length; j++) {
                let draftIdx = combinedRefs.findIndex(ref => ref && ref.txt === refs[j].txt) + 1;
                // let draftIdx = combinedRefs.findIndex(ref => ref && ref.draftIdx === refs[j].draftIdx) + 1;
                // if (asGiven) draftIdx = refs[j].draftIdx
                if (pathwaysFirst) {
                    const sameRefs = combinedRefs.filter(ref => ref && ref.draftIdx === refs[j].draftIdx);
                    if (sameRefs.length > 1) {
                        const ref = sameRefs.find(ref => side2Refs.findIndex(currRef => currRef.link === ref.link) !== -1);
                        draftIdx = combinedRefs.indexOf(ref) + 1;
                    }
                }
                if (pathwaysSecond) {
                    let idx = side2Refs.findIndex(ref => ref && ref.draftIdx === refs[j].draftIdx);
                    if (idx !== -1) {
                        draftIdx = combinedRefs.findIndex(ref => ref && ref.link === refs[j].link) + 1;
                    }
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
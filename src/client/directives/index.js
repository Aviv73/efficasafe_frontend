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
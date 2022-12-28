<template>
    <form @submit.prevent="" class="autocomplete">
        <div
            class="autocomplete-field"
        >
            <input
                v-model="search"
                ref="searchInput"
                type="text"
                class="primary"
                :placeholder="placeholder"
                @keyup.down="shiftFocus(0)"
                v-debounce="getResults"
            />
            <loader v-if=" isLoading" class="input-loader"/>
       
            <ul
                class="autocomplete-results on-hero"
                :class="{
                    'active': (!!search ) && !!results.length,
                }"
            >
                <li
                    tabindex="0"
                    v-for="(result, idx) in results"
                    :ref="`result${idx}`"
                    :key="idx"
                    class="autocomplete-results-result"
                    @click="emitSelection(result)"
                    @keyup.enter="emitSelection(result)"
                    @keydown.up.prevent="shiftFocus(idx - 1)"
                    @keydown.down.prevent="shiftFocus(idx + 1)"
                >
                    {{ result.txt }}
                </li>
            </ul>
        </div>
        
    </form>
</template>

<script>
import Loader from '@/client/cmps/common/icons/Loader';
import { utilService } from '@/cms/services/util.service';
import { eventBus, EV_clear_input } from '@/cms/services/eventBus.service'

export default {
    
    timerId: null,
    components: { Loader },
    props: {
        placeholder: {
            type: String,
            default: 'Smart search'
        },

              isOnIndexPage: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            search: '',
            results: [],
            isLoading: false,
            isSecondaryFocused: false,
            lastQ: ''
        }
    },
    methods: {
        async getResults(q) {
            if (!q) {
                this.results = [];
                return;
            }
            this.isLoading = true;
            q = q.trim()
            q = this.transHebrew(q)
            this.lastQ = q
            const criteria = { autocomplete: true, q };
            const results = await this.$store.dispatch({ type: 'getMaterials', criteria });
            if(results.originalQ === this.lastQ || this.transHebrew(results.originalQ) === this.lastQ){
                this.results = this.sortRes(results.materials, q);
                this.isLoading = false;
            }else{
                this.isLoading = false;
                return
            }
        },
        transHebrew(q){
            const chars = q.split('')
            const isAllHebrew = chars.every( c => (c.charCodeAt() > 1487 && c.charCodeAt() < 1515) || c.charCodeAt() === 32)
            if(isAllHebrew) q = utilService.transHebrew(q)
            return q
        },
        sortRes(res, q){
            const idx = res.findIndex(r => r.txt.toUpperCase() === q.toUpperCase())
            if(idx >=0){
                const first = res[idx]
                res.splice(idx, 1)
                res.unshift(first)
            }
            console.log(JSON.parse(JSON.stringify(res)));
            return res
        },
        emitSelection(item) {
            this.$emit('materialSelected', item);
            
            this.results = [];

                this.search = '';


            // if (this.isOnSearchPage) {
            //     this.search1 = '';
            //     this.search2 = '';
            //     this.$refs.searchInput1.focus();
            // } else {
            //     this.search1 = item.txt;
            //     this.$refs.searchInput2.focus();
            // }
        },
        shiftFocus(itemIdx) {
            
            const { length } = Object.keys(this.$refs).filter(key => key.startsWith('result'));
            if (itemIdx < 0) itemIdx = length - 1;
            else if (itemIdx === length) itemIdx = 0;
            const elItem = this.$refs['result' + itemIdx];
            if (!elItem) return;
            this.$nextTick(() => {
                if (elItem[0]) elItem[0].focus();
            });
        },
        // onFocusChange(ev) {
        //     this.isSecondaryFocused = ev.target === this.$refs.searchInput2;
        // },
        clearInput(){
            this.search = '';
            this.$refs.searchInput.focus();
        }
    },
    created() {
        document.addEventListener('focusin', this.onFocusChange);
        eventBus.$on(EV_clear_input, this.clearInput)
    },
    beforeDestroy() {
        document.removeEventListener('focusin', this.onFocusChange);
    }
}
</script>
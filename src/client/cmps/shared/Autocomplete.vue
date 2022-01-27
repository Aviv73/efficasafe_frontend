<template>
    <form @submit.prevent="" class="autocomplete">
        <div
            class="autocomplete-field"
            :class="{ 'inset': isOnSearchPage }"
        >
            <input
                v-model="search1"
                ref="searchInput1"
                type="text"
                class="primary"
                :placeholder="placeholder1"
                @keyup.down="shiftFocus(0)"
                v-debounce="getResults"
            />
            <svg
                v-if="!isOnSearchPage"
                xmlns="http://www.w3.org/2000/svg"
                class="cap cap-left"
                viewBox="0 0 24.192 48.001"
            >
                <path 
                    :fill="isSecondaryFocused ? '#b1b1b1' : '#56c596'"
                    d="M24.192,48h-.221A23.973,23.973,0,0,1,0,24,23.96,23.96,0,0,1,23.972,0h.221V4.132a21.046,21.046,0,0,0-6.841,1.532A20.58,20.58,0,0,0,10.8,9.929a19.82,19.82,0,0,0-4.414,6.326,19.338,19.338,0,0,0,0,15.492A19.81,19.81,0,0,0,10.8,38.071a20.585,20.585,0,0,0,6.548,4.265,21.043,21.043,0,0,0,6.841,1.532V48Z"
                    transform="translate(24.192 48.001) rotate(180)"
                />
            </svg>
            <ul
                class="autocomplete-results"
                :class="{
                    'active': (!!search1 || !!search2) && !!results.length,
                    'on-secondary': !!search2,
                    'on-hero': !isOnSearchPage
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
                    {{ result }}
                </li>
            </ul>
        </div>
        <div
            v-if="!isOnSearchPage"
            class="autocomplete-field"
        >
            <input
                v-model="search2"
                ref="searchInput2"
                type="text"
                class="secondary"
                :placeholder="placeholder2"
                @keyup.down="shiftFocus(0)"
                v-debounce="getResults"
            />
            <svg
                v-if="!isOnSearchPage"
                xmlns="http://www.w3.org/2000/svg"
                class="cap cap-right"
                viewBox="0 0 24.192 48.001"
            >
                <path
                    fill="#a4b8c6"
                    d="M24.192,0h-.221A23.973,23.973,0,0,0,0,24,23.96,23.96,0,0,0,23.971,48h.221V43.869a21.046,21.046,0,0,1-6.841-1.532A20.58,20.58,0,0,1,10.8,38.072a19.82,19.82,0,0,1-4.414-6.326,19.338,19.338,0,0,1,0-15.492A19.81,19.81,0,0,1,10.8,9.93a20.585,20.585,0,0,1,6.548-4.265,21.042,21.042,0,0,1,6.841-1.532V0Z"
                />
            </svg>
        </div>
    </form>
</template>

<script>
import { utilService } from '@/cms/services/util.service';
import { eventBus, EV_clear_input } from '@/cms/services/eventBus.service'

export default {
    timerId: null,
    props: {
        placeholder1: {
            type: String,
            default: 'Search drug / herb'
        },
        placeholder2: {
            type: String,
            default: ''
        },
        isOnSearchPage: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            search1: '',
            search2: '',
            results: [],
            isLoading: false,
            isSecondaryFocused: false
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
            const criteria = { autocomplete: true, q };
            const results = await this.$store.dispatch({ type: 'getMaterials', criteria });
            this.results = this.sortRes(results, q);
            this.isLoading = false;
        },
        transHebrew(q){
            const chars = q.split('')
            const isAllHebrew = chars.every( c => (c.charCodeAt() > 1487 && c.charCodeAt() < 1515) || c.charCodeAt() === 32)
            if(isAllHebrew) q = utilService.transHebrew(q)
            return q
        },
        sortRes(res, q){
            const idx = res.findIndex(str => str.toUpperCase() === q.toUpperCase())
            if(idx >=0){
                const first = res[idx]
                res.splice(idx, 1)
                res.unshift(first)
            }
            return res
        },
        emitSelection(item) {
            this.$emit('item-selected', item);
            this.results = [];

            if (this.isOnSearchPage) {
                this.search1 = '';
                this.search2 = '';
                this.$refs.searchInput1.focus();
            } else {
                this.search1 = item;
                this.$refs.searchInput2.focus();
            }
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
        onFocusChange(ev) {
            this.isSecondaryFocused = ev.target === this.$refs.searchInput2;
        },
        clearInput(){
            this.search2 = '';
            this.$refs.searchInput2.focus();
        }
    },
    created() {
        if (this.isOnSearchPage) return;
        document.addEventListener('focusin', this.onFocusChange);
        eventBus.$on(EV_clear_input, this.clearInput)
    },
    beforeDestroy() {
        if (this.isOnSearchPage) return;
        document.removeEventListener('focusin', this.onFocusChange);
    }
}
</script>
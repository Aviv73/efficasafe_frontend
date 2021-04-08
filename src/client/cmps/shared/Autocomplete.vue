<template>
    <form @submit.prevent="" class="autocomplete">
        <div class="autocomplete-field" :class="{ 'inset': isOnSearchPage }">
            <input
                v-model="search"
                ref="searchInput"
                type="text"
                class="primary"
                :placeholder="placeholder1"
                @keyup.down="shiftFocus(0)"
                v-debounce="getResults"
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="cap cap-left"
                :viewBox="isOnSearchPage ? '0 0 24.002 55.472' : '0 0 24.192 48.001'"
            >
                <path
                    v-if="isOnSearchPage"
                    fill="#56c596"
                    d="M-7037-13893.265h0v-2.172a25.75,25.75,0,0,0,6.121-1.739,25.843,25.843,0,0,0,8.265-5.574,25.868,25.868,0,0,0,5.574-8.265,25.877,25.877,0,0,0,2.042-10.118,25.884,25.884,0,0,0-2.042-10.121,25.851,25.851,0,0,0-5.574-8.262,25.89,25.89,0,0,0-8.265-5.574,25.866,25.866,0,0,0-6.121-1.738v-1.907a27.523,27.523,0,0,1,6.99,1.937,27.8,27.8,0,0,1,8.853,6,27.951,27.951,0,0,1,5.97,8.9A27.986,27.986,0,0,1-7013-13921a28.021,28.021,0,0,1-2.189,10.9,27.962,27.962,0,0,1-5.97,8.9,27.807,27.807,0,0,1-8.853,6,27.586,27.586,0,0,1-6.989,1.936Z"
                    transform="translate(7037.001 13948.736)"
                />
                <path 
                    v-else
                    fill="#56c596"
                    d="M24.192,48h-.221A23.973,23.973,0,0,1,0,24,23.96,23.96,0,0,1,23.972,0h.221V4.132a21.046,21.046,0,0,0-6.841,1.532A20.58,20.58,0,0,0,10.8,9.929a19.82,19.82,0,0,0-4.414,6.326,19.338,19.338,0,0,0,0,15.492A19.81,19.81,0,0,0,10.8,38.071a20.585,20.585,0,0,0,6.548,4.265,21.043,21.043,0,0,0,6.841,1.532V48Z"
                    transform="translate(24.192 48.001) rotate(180)"
                />
            </svg>
            <ul class="autocomplete-results" :class="{ 'active': !!search && !!results.length }">
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
        <div class="autocomplete-field" :class="{ 'inset': isOnSearchPage }">
            <input
                type="text"
                class="secondary"
                :placeholder="placeholder2"
                disabled
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="cap cap-right"
                :viewBox="isOnSearchPage ? '0 0 24.002 55.472' : '0 0 24.192 48.001'"
            >
                <path
                    v-if="isOnSearchPage"
                    fill="#b1b1b1"
                    d="M0,0H0V2.173A25.75,25.75,0,0,1,6.121,3.912a25.843,25.843,0,0,1,8.265,5.574,25.868,25.868,0,0,1,5.574,8.265A25.877,25.877,0,0,1,22,27.869,25.884,25.884,0,0,1,19.959,37.99a25.851,25.851,0,0,1-5.574,8.262,25.89,25.89,0,0,1-8.265,5.574A25.866,25.866,0,0,1,0,53.564v1.907a27.523,27.523,0,0,0,6.99-1.937,27.8,27.8,0,0,0,8.853-6,27.951,27.951,0,0,0,5.97-8.9A27.986,27.986,0,0,0,24,27.735a28.021,28.021,0,0,0-2.189-10.9,27.962,27.962,0,0,0-5.97-8.9,27.807,27.807,0,0,0-8.853-6A27.586,27.586,0,0,0,0,0Z"
                    transform="translate(24.002 55.472) rotate(180)"
                />
                <path
                    v-else
                    fill="#a4b8c6"
                    d="M24.192,0h-.221A23.973,23.973,0,0,0,0,24,23.96,23.96,0,0,0,23.971,48h.221V43.869a21.046,21.046,0,0,1-6.841-1.532A20.58,20.58,0,0,1,10.8,38.072a19.82,19.82,0,0,1-4.414-6.326,19.338,19.338,0,0,1,0-15.492A19.81,19.81,0,0,1,10.8,9.93a20.585,20.585,0,0,1,6.548-4.265,21.042,21.042,0,0,1,6.841-1.532V0Z"
                />
            </svg>
        </div>
    </form>
</template>

<script>
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
            search: '',
            results: [],
            isLoading: false
        }
    },
    methods: {
        async getResults(q) {
            if (!q || q.length < 3) {
                this.results = [];
                return;
            }
            this.isLoading = true;
            const criteria = { autocomplete: true, q };
            const results = await this.$store.dispatch({ type: 'getMaterials', criteria });
            this.results = results;
            this.isLoading = false;
        },
        emitSelection(item) {
            this.search = '';
            this.results = [];
            this.$emit('item-selected', item);
            if (this.isOnSearchPage) {
                this.$refs.searchInput.focus();
            }
        },
        shiftFocus(itemIdx) {
            const { length } = Object.keys(this.$refs).filter(key => key.startsWith('result'));
            if (itemIdx < 0) itemIdx = length - 1;
            else if (itemIdx === length) itemIdx = 0;
            const elItem = this.$refs['result' + itemIdx];
            if (!elItem) return;
            elItem[0].focus();
        }
    }
}
</script>
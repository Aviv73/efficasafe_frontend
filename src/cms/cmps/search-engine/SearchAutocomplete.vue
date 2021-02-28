<template>
    <section class="search-autocomplete">
        <v-autocomplete
            v-model="select"
            label="Search Material"
            ref="searchInput"
            color="white"
            :items="results"
            :search-input.sync="search"
            :loading="isLoading"
            @change="emitSelected"
            clearable
            hide-selected
            flat
            solo-inverted
        />
    </section>
</template>

<script>
import { eventBus, EV_clear_autocomplete } from '@/cms/services/eventBus.service';

export default {
    timerId: null,
    data: () => ({
        isLoading: false,
        search: null,
        select: null,
        results: []
    }),
    watch: {
        search: {
            handler(val) {
                if (val && val.length >= 3) {
                    clearTimeout(this.$options.timerId);
                    this.$options.timerId = setTimeout(() => {
                        this.getResults(val);
                    }, 300);
                }
            },
            immediate: true
        }
    },
    methods: {
        async getResults(q) {
            this.isLoading = true;
            const criteria = { autocomplete: true, q: q || '' };
            const results = await this.$store.dispatch({ type: 'getMaterials', criteria });
            this.results = results;
            this.isLoading = false;
        },
        emitSelected(select) {
            if (!select) return;
            this.$emit('materials-selected', JSON.parse(JSON.stringify(select)));
        }
    },
    mounted() {
        eventBus.$on(EV_clear_autocomplete, () => {
            this.$refs.searchInput.setValue('');
        });
    },
    destroyed() {
        eventBus.$off(EV_clear_autocomplete);
    }
}
</script>
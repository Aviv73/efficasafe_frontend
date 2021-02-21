<template>
    <section class="search-autocomplete">
        <v-autocomplete
            v-model="select"
            label="Search Material"
            ref="searchInput"
            color="white"
            :items="autocompleteResults"
            :search-input.sync="search"
            :loading="isLoading"
            @change="emitSelected"
            clearable
            hide-selected
            flat
            solo-inverted
            return-object
        />
    </section>
</template>

<script>
import { eventBus, EV_clear_autocomplete } from '@/services/eventBus.service';

export default {
    data: () => ({
        isLoading: false,
        search: null,
        select: null,
        results: []
    }),
    watch: {
        search: {
            handler(val) {
                if (val && val.length >= 3) this.getResults(val);
            },
            immediate: true
        }
    },
    computed: {
        autocompleteResults() {
            return this.results.map(result => ({ text: result.hit, value: result.materialIds }))
                .sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
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
<template>
  <section class="featured-interaction-app-filter px-4">
    <v-autocomplete 
        class="featured-interaction-app-filter-field"
        label="Search interactions"
        v-model="result"
        @change="emitAutocomplete"
        :items="items"
        :search-input.sync="search"
        :loading="isLoading"
        clearable
        return-object
    />
  </section>
</template>

<script>
export default {
    data() {
        return {
            isLoading: false,
            search: null,
            result: null,
            initialItems: []
        }
    },
    watch: {
        search: {
            handler(val) {
                this.getResults(val);
            },
            immediate: true
        }
    },
    computed: {
        items() {
            return this.initialItems.reduce((acc, { _id, name }) => {
                acc.push({ _id, text: name });
                return acc;
            }, []);
        }
    },
    methods: {
        async getResults(q) {
            this.isLoading = true;
            const filterBy = { side1Name: q || '', isGroups: true, sortBy: '_id', isDesc: false };
            const results = await this.$store.dispatch({ type: 'getFeaturedInteractionGroups', filterBy });
            this.initialItems = results;
            this.isLoading = false;
        },
        emitAutocomplete() {
            const payload = { side1Name: (this.result) ? this.result.text : '' };
            this.$emit('filter-changed', payload);
        }
    }
}
</script>
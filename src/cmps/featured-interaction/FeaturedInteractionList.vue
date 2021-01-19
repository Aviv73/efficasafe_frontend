<template>
    <section class="featured-interaction-list">
        <main v-if="interactions.length">
            <div class="featured-interaction-list-filter">
                <v-autocomplete 
                    class="featured-interaction-list-filter-field"
                    label="Search interactions"
                    :items="autocompleteResults"
                    v-model="result"
                    :search-input.sync="search"
                    @change="setFilter"
                    :loading="isAutocompleteLoading"
                    clearable
                    return-object
                />
            </div>
            <v-data-table
                :headers="headers"
                :items="interactions"
                :server-items-length="totalItems"
                :options.sync="options"
                disable-sort
                :loading="isLoading"
            >
                <template #[`item.actions`]="{ item }">
                    <div class="featured-interaction-list-actions">
                        <v-btn 
                            color="primary" 
                            x-small
                            title="Edit interaction"
                            :to="`/featured-interaction/edit/${item._id}`"
                        >
                            <v-icon x-small>mdi-pencil</v-icon>
                        </v-btn>
                    </div>
                </template>
            </v-data-table>
        </main>
        <v-progress-circular 
            v-else
            indeterminate
            color="grey darken-1"
        />
    </section>
</template>

<script>
export default {
    props: {
        group: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            interactions: [],
            totalItems: 0,
            autocompleteItems: [],
            isAutocompleteLoading: false,
            isLoading: false,
            filterBy: {
                isGroups: false,
                drugBankId: this.group._id,
                limit: 10,
                page: 0,
                sortBy: 'affected_drug.name',
                isDesc: false,
                side2Name: ''
            },
            search: null,
            result: null,
            options: {},
            headers: [
                {
                    text: 'Side 2',
                    value: 'affected_drug.name'
                },
                {
                    text: 'Actions',
                    value: 'actions',
                    align: 'center'
                }
            ]
        }
    },
    watch: {
        search: {
            handler(val) {
                this.getAutocompleteResults(val);
            },
            immediate: true
        },
        filterBy: {
            handler() {
                this.getFeaturedInteractions();
            },
            deep: true,
            immediate: true
        },
        options: {
            handler() {
                let { itemsPerPage, page } = this.options;
                this.filterBy.limit = (itemsPerPage < 0) ? 0 : itemsPerPage;
                this.filterBy.page = --page;
            },
            deep: true
        }
    },
    computed: {
        autocompleteResults() {
            return this.autocompleteItems.reduce((acc, { _id, affected_drug }) => {
                acc.push({ _id, text: affected_drug.name });
                return acc;
            }, []);
        }
    },
    methods: {
        setFilter(val) {
            const q = val ? val.text : '';
            this.filterBy.side2Name = q;
        },
        async getFeaturedInteractions() {
            this.isLoading = true;
            const filterBy = { ...this.filterBy };
            if (filterBy.side2Name) filterBy.page = 0;
            const { featuredInteractions, total } = await this.$store.dispatch({ type: 'getFeaturedInteractions', filterBy });
            this.interactions = featuredInteractions;
            this.totalItems = total;
            this.isLoading = false;
        },
        async getAutocompleteResults(q) {
            this.isAutocompleteLoading = true;
            const filterBy = { ...this.filterBy, side2Name: q };
            filterBy.page = 0;
            const { featuredInteractions } = await this.$store.dispatch({ type: 'getFeaturedInteractions', filterBy });
            this.autocompleteItems = featuredInteractions;
            this.isAutocompleteLoading = false;
        }
    }
}
</script>
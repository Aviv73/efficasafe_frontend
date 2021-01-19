<template>
    <section class="featured-interaction-list">
        <main v-if="!isLoading">
            <div class="featured-interaction-list-filter py-4">
                <v-autocomplete 
                    class="featured-interaction-list-filter-field mr-4 mb-0"
                    label="Search interactions"
                    :items="autocompleteResults"
                    v-model="result"
                    :search-input.sync="search"
                    @change="setFilter($event, 'side2Name')"
                    :loading="isAutocompleteLoading"
                    hide-details
                    outlined
                    clearable
                    return-object
                />
                <v-divider vertical class="mr-4" />
                <span class="featured-interaction-list-filter-field composed">
                    <span>
                        <v-radio-group
                            class="ma-0 pa-0"
                            v-model="propertyToSearch"
                            hide-details
                            mandatory
                            dense
                            row
                        >
                            <v-radio value="summary" label="summary" />
                            <v-radio value="management" label="management" />
                        </v-radio-group>
                        <v-text-field
                            v-model="txtSearch"
                            class="ma-0 pa-0"
                            label="Text starts with..."
                            hide-details
                            outlined
                        />
                    </span>
                    <v-btn
                        outlined
                        class="ml-2"
                        color="primary"
                        @click="setFilter(txtSearch, propertyToSearch)"
                    >Search</v-btn>
                </span>
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
            txtSearch: '',
            propertyToSearch: '',
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
                side2Name: '',
                summary: '',
                management: ''
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
        setFilter(val, property) {
            switch (property) {
                case 'side2Name':
                    this.filterBy.side2Name = val ? val.text : '';
                    break;
                case 'summary':
                case 'management':
                    this.filterBy[property] = val;
                    break;
                default:
                    break;
            }
        },
        async getFeaturedInteractions() {
            this.isLoading = true;
            const filterBy = { ...this.filterBy };
            if (filterBy.side2Name || filterBy.summary || filterBy.management) filterBy.page = 0;
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
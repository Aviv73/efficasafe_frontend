<template>
    <section class="featured-interaction-list">
        <main v-if="!isLoading">
            <div class="featured-interaction-list-filter py-4">
                <v-autocomplete 
                    class="featured-interaction-list-filter-field mb-0"
                    label="Search interactions"
                    :items="autocompleteResults"
                    v-model="result"
                    :search-input.sync="search"
                    @change="setFilter($event, 'side2Name')"
                    :loading="isAutocompleteLoading"
                    dark
                    hide-details
                    outlined
                    clearable
                    return-object
                />
                <v-divider dark vertical class="mx-4" />
                <span class="featured-interaction-list-filter-field composed">
                    <span>
                        <v-radio-group
                            class="ma-0 pa-0"
                            v-model="propertyToSearch"
                            hide-details
                            mandatory
                            dense
                            dark
                            row
                        >
                            <v-radio value="summary" label="summary" />
                            <v-radio value="management" label="management" />
                        </v-radio-group>
                        <v-radio-group
                            class="mx-0 my-2 pa-0"
                            v-model="isStartsWith"
                            hide-details
                            mandatory
                            dense
                            dark
                            row
                        >
                            <v-radio :value="true" label="Starts width" />
                            <v-radio :value="false" label="Includes" />
                        </v-radio-group>
                        <v-text-field
                            v-model="txtSearch"
                            class="ma-0 pa-0 text-capitalize"
                            :label="(isStartsWith) ? `${propertyToSearch} starts with...` : `${propertyToSearch} includes...`"
                            hide-details
                            outlined
                            dark
                        />
                    </span>
                    <v-btn
                        dark
                        outlined
                        class="ml-2"
                        @click="setFilter(txtSearch, propertyToSearch, isStartsWith)"
                    >Search</v-btn>
                </span>
                <v-divider dark vertical class="mx-4" />
                <v-checkbox
                    :label="selected.length ? 'None' : 'All'"
                    dark
                    @change="toggleAllSelected"
                />
                <v-divider dark vertical class="mx-4 ml-auto" />
                <v-menu 
                    offset-y 
                    left
                    nudge-left="50"
                    nudge-top="35"
                    :close-on-click="true"
                    :close-on-content-click="false"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn 
                            class="elevation-0"
                            color="transparent"
                            title="Actions"
                            fab
                            dark
                            x-large
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon x-large>mdi-view-grid</v-icon>
                        </v-btn>
                    </template>
                        <v-card class="pa-6 d-flex flex-column align-center">
                            <v-btn
                                class="mb-4"
                                fab
                                outlined
                                title="Change side 1"
                                color="secondary"
                            >
                                <v-icon>mdi-swap-horizontal-variant</v-icon>
                            </v-btn>
                            <v-btn
                                class="mb-4"
                                fab
                                outlined
                                title="Activate / Deactivate"
                                color="primary"
                            >
                                <v-icon>mdi-check-box-outline</v-icon>
                            </v-btn>
                            <v-btn 
                                fab
                                outlined
                                title="Delete"
                                color="error"
                            >
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-card>
                </v-menu>
            </div>
            <v-data-table
                :headers="headers"
                :items="interactions"
                :server-items-length="totalItems"
                :options.sync="options"
                disable-sort
                :loading="isLoading"
            >
                <template #[`item.isActive`]="{ item }">
                    <v-checkbox
                        class="read-only"
                        :value="item.isActive"
                        readonly
                    />
                </template>
                <template #[`item.actions`]="{ item }">
                    <div class="featured-interaction-list-actions">
                        <v-checkbox
                            v-model="selected"
                            hint="Toggle selection"
                            persistent-hint
                            :value="item._id"
                        />
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
            selected: [],
            txtSearch: '',
            propertyToSearch: '',
            isStartsWith: true,
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
                management: '',
                isStartsWith: true
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
                    text: 'Active',
                    value: 'isActive'
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
        },
        setFilter(val, property, isStartsWith) {
            switch (property) {
                case 'side2Name':
                    this.filterBy.side2Name = val ? val.text : '';
                    break;
                case 'summary':
                    this.filterBy.management = '';
                    this.filterBy.summary = val;
                    this.filterBy.isStartsWith = isStartsWith;
                    break;
                case 'management':
                    this.filterBy.summary = '';
                    this.filterBy.management = val;
                    this.filterBy.isStartsWith = isStartsWith;
                    break;
                default:
                    break;
            }
        },
        toggleAllSelected(doSelect) {
            this.selected = (doSelect) ? this.interactions.map(int => int._id) : [];
        }
    }
}
</script>
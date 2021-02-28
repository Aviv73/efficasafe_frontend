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
                            <v-radio value="summary" label="Summary" />
                            <v-radio value="extended_description" label="Extended description" />
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
                            <v-radio :value="true" label="Starts with" />
                            <v-radio :value="false" label="Includes" />
                        </v-radio-group>
                        <v-text-field
                            v-model="query"
                            class="ma-0 pa-0 text-capitalize"
                            :label="(isStartsWith) ? `${propertyToSearch} starts with...` : `${propertyToSearch} includes...`"
                            hint="AND | OR | NOT operators are optional"
                            persistent-hint
                            outlined
                            dark
                        />
                    </span>
                    <v-btn
                        dark
                        outlined
                        class="ml-2"
                        @click="setFilter(query, propertyToSearch, isStartsWith)"
                    >Search</v-btn>
                </span>
                <v-divider dark vertical class="mx-4" />
                <v-checkbox
                    :label="isAllSelected ? 'None' : 'All'"
                    dark
                    v-model="isAllSelected"
                    @change="toggleAllSelected"
                />
                <v-divider dark vertical class="mx-4 ml-auto" />
                <v-menu 
                    offset-y 
                    left
                    nudge-left="50"
                    nudge-top="35"
                    :close-on-click="false"
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
                                color="success"
                                @click="materialPickerDialog = true"
                                :disabled="!selected.length"
                            >
                                <v-icon>mdi-swap-horizontal-variant</v-icon>
                            </v-btn>
                            <v-btn
                                class="mb-4"
                                fab
                                outlined
                                title="Export to label"
                                color="primary"
                                @click="addToLabel"
                                :disabled="!selected.length"
                            >
                                <v-icon>mdi-label-outline</v-icon>
                            </v-btn>
                            <v-btn
                                class="mb-4"
                                fab
                                outlined
                                title="Activate"
                                color="light-blue"
                                @click="editInteractions('isActive', true)"
                                :disabled="!selected.length"
                            >
                                <v-icon>mdi-check-box-outline</v-icon>
                            </v-btn>
                            <v-btn
                                class="mb-4"
                                fab
                                outlined
                                title="Deactivate"
                                color="secondary"
                                @click="editInteractions('isActive', false)"
                                :disabled="!selected.length"
                            >
                                <v-icon>mdi-checkbox-blank-off-outline</v-icon>
                            </v-btn>
                            <v-btn 
                                fab
                                outlined
                                title="Delete"
                                color="error"
                                @click="confirmDeleteDialog = true"
                                :disabled="!selected.length"
                            >
                                <v-icon>mdi-delete-outline</v-icon>
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
                :items-per-page="15"
                :footer-props="{
                    'items-per-page-options': [ 15, 50, -1 ]
                }"
            >
                <template #[`item.isActive`]="{ item }">
                    <v-icon
                        :color="(item.isActive) ? 'primary' : 'secondary'"
                    >
                        {{ (item.isActive) ? 'mdi-check-box-outline' : 'mdi-checkbox-blank-off-outline' }}
                    </v-icon>
                </template>
                <template #[`item.actions`]="{ item }">
                    <div class="featured-interaction-list-actions">
                        <v-checkbox
                            v-model="selected"
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
                        <v-btn 
                            color="primary" 
                            x-small
                            title="View interaction"
                            :to="`/featured-interaction/${item._id}`"
                        >
                            <v-icon x-small>mdi-eye</v-icon>
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
        <confirm-delete
            v-model="confirmDeleteDialog"
            type="featured interaction"
            :dialog="confirmDeleteDialog"
            @delete-confirm="removeInteractions"
            @delete-cancel="confirmDeleteDialog = false"
        />
        <material-picker
            :dialog="materialPickerDialog"
            @material-picked="editInteractions('subject_drug', $event)"
            @close-dialog="materialPickerDialog = false"
        />
    </section>
</template>

<script>
import { featuredInteractionService } from '@/cms/services/featured-interaction.service';
import materialPicker from '@/cms/cmps/featured-interaction/MaterialPicker';
import confirmDelete from '@/cms/cmps/general/ConfirmDelete';

export default {
    props: {
        group: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            searchOperator: '',
            isAllSelected: false,
            materialPickerDialog:false,
            confirmDeleteDialog: false,
            selected: [],
            txtQuery: '',
            propertyToSearch: '',
            isStartsWith: true,
            interactions: [],
            totalItems: 0,
            autocompleteItems: [],
            isAutocompleteLoading: false,
            isLoading: false,
            filterBy: featuredInteractionService.getDefaultFilterBy(this.group._id),
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
        'group._id'(groupId) {
            this.resetData();
            this.$store.commit({ type: 'setPrevState', prevState: null });
            this.$store.commit({ type: 'setLastFilterBy', filterBy: null });
            this.filterBy = featuredInteractionService.getDefaultFilterBy(groupId);
        },
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
            deep: true
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
        query: {
            get() {
                return this.txtQuery;
            },
            set(val) {
                this.searchOperator = val.includes('AND') ? 'AND' : val.includes('OR') ? 'OR' : val.includes('NOT') ? 'NOT' : '';
                this.txtQuery = val;
            }
        },
        autocompleteResults() {
            return this.autocompleteItems.reduce((acc, { _id, affected_drug }) => {
                acc.push({ _id, text: affected_drug.name });
                return acc;
            }, []);
        }
    },
    methods: {
        async addToLabel() {
            const side2DBKId = this.selected.map(interactionId => {
                return this.interactions.find(interaction => interaction._id === interactionId).affected_drug.drugbank_id;
            });
            this.$router.push(`/label/edit?materials=${side2DBKId}`);
        },
        async editInteractions(field, value) {
            const filterBy = {
                ids: [ ...this.selected ],
                field,
                value
            };
            await this.$store.dispatch({ type: 'updateFeaturedInteractions', filterBy });
            this.materialPickerDialog = false;
            this.getFeaturedInteractions();
        },
        async removeInteractions() {
            await this.$store.dispatch({ type: 'removeFaeturedInteractions', filterBy: [ ...this.selected ] });
            this.confirmDeleteDialog = false;
            this.getFeaturedInteractions();
        },
        async getFeaturedInteractions() {
            this.isLoading = true;
            const filterBy = { ...this.filterBy };
            if (filterBy.side2Name || filterBy.summary || filterBy.extended_description) filterBy.page = 0;
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
                    this.filterBy.extended_description = '';
                    this.filterBy.summary = this.searchOperator ? val.split(this.searchOperator).filter(str => str).map(str => str.trim()) : val;
                    this.filterBy.isStartsWith = isStartsWith;
                    this.filterBy.operator = this.searchOperator;
                    break;
                case 'extended_description':
                    this.filterBy.summary = '';
                    this.filterBy.extended_description = this.searchOperator ? val.split(this.searchOperator).filter(str => str).map(str => str.trim()) : val;
                    this.filterBy.isStartsWith = isStartsWith;
                    this.filterBy.operator = this.searchOperator;
                    break;
                default:
                    break;
            }
        },
        toggleAllSelected(doSelect) {
            this.selected = (doSelect) ? this.interactions.map(int => int._id) : [];
        },
        restoreLastState() {
            Object.entries(this.$store.getters.prevState).forEach(([ key, value]) => {
                this[key] = (typeof value === 'object') ? JSON.parse(JSON.stringify(value)) : value;
            });
        },
        resetData() {
            this.options = {};
            this.result = null;
            this.search = null;
            this.isStartsWith = true;
            this.isAllSelected = false;
            this.propertyToSearch = '';
            this.searchOperator = '';
            this.txtQuery = '';
        }
    },
    created() {
        const { lastFilterBy } = this.$store.getters;
        if (lastFilterBy) {
            this.restoreLastState();
            this.filterBy = JSON.parse(JSON.stringify(lastFilterBy));
        } else {
            this.resetData();
            this.getFeaturedInteractions();
        }
    },
    components: {
        confirmDelete,
        materialPicker
    }
}
</script>
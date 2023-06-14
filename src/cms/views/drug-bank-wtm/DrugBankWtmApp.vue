<template>
    <!-- <keep-alive> -->
    <section class="drug-bank-wtm-app">
        <div class="container">
            <v-card class="mb-10">
                <v-card-title class="flex align-center space-between">
                    <h2>
                        Drug Bank WTM workshop
                    </h2>
                    <v-btn @click="clear()">CLEAR</v-btn>
                </v-card-title>
                <form @submit.prevent="loadResultsData" class="search-form flex column align-start gap10">
                    <div class="flex align-start gap20">
                        <label class="flex gap10">
                            <div class="flex align-center gap10">
                                <span>Search by field</span>
                                <select v-model="searchFieldSelected" @change="filterBy.filter.search = ''">
                                    <option v-for="opt in searchFieldsOpts" :key="opt.label" :value="opt.value" :label="opt.label"/>
                                </select>
                            </div>
                        </label>
                        <textarea @click="filterBy.filter.search = ''" v-model="filterBy.filter.search" type="text" placeholder="search"/>
                    </div>
                    <v-btn color="primary" type="submit" class="">Search</v-btn>
                </form>
                <form @submit.prevent="" class="flex column gap10">
                    <div v-for="(item, idx) in editData.generateItems" :key="idx" class="generate-items flex align-start gap5" @click.stop.prevent="">
                        <button class="small-btn flexx align-center justify-center" @click="removeGenerateItem(idx)"><span>X</span></button>
                        <label class="flex align-center gap10">
                            <span>Monitor field</span>
                            <!-- <input v-model="item.field" type="text" placeholder="monitor field"/> -->
                            <select v-model="item.field" placeholder="monitor field" @change="item.value = [{ val: '' }]">
                                <option v-for="field in Object.keys(monitorOptsMap)" :key="field" :label="field" :value="field"/>
                            </select>
                        </label>
                        <label class="flex align-start gap10">
                            <div class="flex align-center gap10">
                                <span>Monitor Value </span>
                                <button class="small-btn flexx align-center justify-center" @click="addGenerateItemValue(item)"><span>+</span></button>
                            </div>
                            <div class="flex column gap10">
                                <div class="flex align-center gap10" v-for="(currVal, currIdx) in item.value" :key="currIdx">
                                    <input v-model="item.value[currIdx].val" type="text" placeholder="monitor value" :list="'monitor-value-' + idx"/>
                                    <label v-if="isToShowDrugParam(item)" class="flex align-center gap10 drug-side">
                                        <span>Side drug</span>
                                        <input class="side-num" v-model="item.value[currIdx].drug" type="number" max="2" min="1"/>
                                    </label>
                                    <button class="small-btn flexx align-center justify-center" @click.stop.prevent="removeGenerateItemValue(item, currIdx)"><span>-</span></button>
                                </div>
                            </div>
                            <!-- <input v-model="item.value" type="text" placeholder="monitor value" :list="'monitor-value-' + idx"/> -->
                            <datalist :id="'monitor-value-' + idx">
                                <option v-for="val in ([...(monitorOptsMap[item.field] || [])].sort())" :key="val" :label="val" :value="val"/>
                            </datalist>
                        </label>
                    </div>
                    <div>
                        <v-btn @click="addAnotherGenerateItem" :disabled="!AllGeneratorsValid">Add monitor value</v-btn>
                    </div>
                    <div class="flex gap20">
                        <v-btn @click="generateDbankWtmData(false)" :disabled="!filterBy.filter.search || !(AllGeneratorsValid && editData.generateItems.length)">Do it!</v-btn>
                        <v-btn @click="generateDbankWtmData(true)" :disabled="!filterBy.filter.search || !(AllGeneratorsValid && editData.generateItems.length)">Do it and mark as done</v-btn>
                        <v-btn @click="markAllManagementTerm()" :disabled="!filterBy.filter.search || !(editData.ids.length)">Color search</v-btn>
                    </div>
                    <div class="flex gap20">
                        <v-btn @click="tggleAllDone(true)" :disabled="!(editData.ids.length)">Mark all as done</v-btn>
                        <v-btn @click="tggleAllDone(false)" :disabled="!(editData.ids.length)">Mark all as un done</v-btn>
                    </div>
                </form>
            </v-card>
            <v-card class="results-container flex column gap30 mb-10">
                <div class="flex align-center space-between width-all">
                    <h2>
                        Management search Results ({{dBankWtms.length}}): <v-btn @click="showAllResults = !showAllResults">{{showAllResults? 'un show all' : 'show all'}}</v-btn>
                    </h2>
                    <div class="flex align-center justify-end gap20">
                        <v-btn @click="selectAllWtmInteractions" :disabled="!dBankWtms.length">Select All</v-btn>
                        <v-btn @click="unSelectAllWtmInteractions" :disabled="!dBankWtms.length">Unselect All</v-btn>
                    </div>
                </div>
                <p v-if="isLoadingRes">Getting results..</p>
                <p v-else-if="!dBankWtms.length">No results..</p>
                <ul v-else>
                    <li v-for="item in (showAllResults && dBankWtms || firstResults)" :key="item._id" class="flex gap10">
                        <input type="checkbox" v-model="editData.ids" :value="item._id"/>
                        <router-link :to="'/d-bank-interaction/' + item.dbankInteractionId">
                            <h3>
                                {{item.name}}
                            </h3> 
                        </router-link>
                    </li>
                </ul>
            </v-card>
            
            <v-card>
                <!-- <featured-interaction-filter 
                    @filter-changed="setFilter"
                /> -->
                <v-btn @click="reloadAllLists">Reload all lists</v-btn>
                <ItemSearchList
                    :itemsData="dbankWtmsMaterialsData"
                    :initFilterBy="materialsFilterBy"
                    @filter="loadAllMaterials"
                    :singlePreviewCmp="DrugBankItemPreview"
                    :isLoading="isLoading"
                    :showLoader="false"
                />
                <!-- <form @submit.prevent="loadAllMaterials" class="flex align-center gap30">
                    <label class="flex gap10">
                        <span>Search</span>
                        <input v-model="materialsFilterBy.filter.search" type="text" placeholder="search"/>
                    </label>
                    <v-btn color="primary" type="submit" class="">Search</v-btn>
                </form>
                <featured-interaction-grouped-list 
                    :showActions="false"
                    baseItemUrl="/d-bank-interaction"
                    :groups="wtmGroups" 
                    :groupCount="groupsCount" 
                    :isLoading="isLoading"
                    @sort-changed="setFilter"
                    @pagination-changed="setFilter"
                /> -->
            </v-card>
            <!-- <icons-map /> -->
        </div>
        <BluredLoader v-if="isLoadingRes || isGenerating"/>
    </section>
    <!-- </keep-alive> -->
</template>

<script>
import { eventBus } from '@/cms/services/eventBus.service';
// import featuredInteractionGroupedList from '@/cms/cmps/featured-interaction/FeaturedInteractionGroupedList';
// import featuredInteractionFilter from '@/cms/cmps/featured-interaction/FeaturedInteractionFilter';
// import iconsMap from '@/cms/cmps/general/IconsMap';
import monitorOptsMap from './monitorOptsMap.json';
import BluredLoader from '../../../client/cmps/common/BluredLoader.vue';
import ItemSearchList from '../../cmps/common/ItemSearchList/ItemSearchList.vue';
import DrugBankItemPreview from './DrugBankItemPreview.vue';

// delete monitorOptsMap.drugParameter;

const drugParameters = [
    { val: 'blood drug level', label: 'labTests' },
    { val: 'drug toxicity', label: 'symptoms' },
    { val: 'exacerbation of drug adverse reactions', label: 'symptoms' },
    { val: 'exacerbation of symptoms for which the drug is being given', label: 'symptoms' },
    { val: 'exacerbation of toxicity symptoms', label: 'symptoms' },
    { val: 'potentiation or reduction of drug efficacy', label: 'symptoms' },
    { val: 'reduction of drug efficacy', label: 'symptoms' },
    { val: 'worsening of symptoms for which the drug is being administered', label: 'symptoms' },
]
drugParameters.forEach(curr => {
    const idx = monitorOptsMap[curr.label] ? monitorOptsMap[curr.label].indexOf(curr.val) : -1;
    if (idx === -1) return;
    monitorOptsMap[curr.label].splice(idx, 1);
});

export default {
    name: 'DrugBankWtmApp',
    data() {
        return {
            DrugBankItemPreview,
            monitorOptsMap,
            isLoading: false,
            isLoadingRes: false,
            isGenerating: false,
            filterBy: {
                dontIgnoreDone: false,
                searchIncludes: true,
                fieldToSearch: this.$route.query.fieldToSearch || 'managementToEdit',
                filter: {
                    search: this.$route.query.searchStr || ''
                }
            },
            editData: {
                ids: [],
                searchBy: '',
                generateItems: [] // [ { field, value, drug: { side, name } } ]
            },

            showAllResults: false,


            materialsFilterBy: {
                filter: {
                    search: '',
                    params: {}
                },
                pagination: {
                    page: 0,
                    limit: 100,
                },
                sort: {
                    'subject_drug.name': 1
                },
            },

            searchFieldSelected: { field: 'managementToEdit', includes: true, dontIgnoreDone: false },
            searchFieldsOpts: [
                { label: 'Management', value: { field: 'managementToEdit', includes: true, dontIgnoreDone: false } },
                { label: 'All management', value: { field: 'managementToEdit', includes: false, dontIgnoreDone: false } },
                { label: 'Original management', value: { field: 'management', includes: true, dontIgnoreDone: true } },
                { label: 'Extended description', value: { field: 'extended_description', includes: true, dontIgnoreDone: false } },
                { label: 'Summary', value: { field: 'summary', includes: true, dontIgnoreDone: false } },
            ],

            dontLoad: false,

            didCreate: false,

            viewdLists: []
        }
    },
    created() {
        if (this.didCreate) return;
        eventBus.$on('dBankWtmProcessIsDone', this.toggleWtmItemsAsDone);
        eventBus.$on('viewdListToggled', this.toggleViewdList);
        eventBus.$on('clearDbankWtmData', this.clear);
        this.initEditData();
        this.initSearchData();
        this.didCreate = true;
    },
    destroyed() {
        eventBus.$on('dBankWtmProcessIsDone', this.toggleWtmItemsAsDone);
        eventBus.$off('viewdListToggled', this.toggleViewdList);
        eventBus.$off('clearDbankWtmData', this.clear);
    },
    watch: {
        searchFieldSelected: {
            deep: true,
            handler(val) {
                this.filterBy.fieldToSearch = val.field;
                this.filterBy.searchIncludes = val.includes;
                this.filterBy.dontIgnoreDone = val.dontIgnoreDone;
            }
        },
        // 'filterBy':{
        //     deep: true,
        //     handler() {
        //         this.dontLoad = true;
        //         this.setFilter();
        //         setTimeout(() => {
        //             this.dontLoad = false;
        //         }, 100);
        //     }
        // },
        'filterBy.filter.search'(val) {
            this.editData.searchBy = val;
        },
        dBankWtms() {
            // this.editData.ids = [];
            this.showAllResults = false
        },
        // '$route.query': {
        //     deep: true,
        //     handler(val, prev) {
        //         const isActive = this.$route.name === 'DrugBankWtmApp';
        //         if (!isActive) return;
        //         const isEqual = JSON.stringify(val) === JSON.stringify(prev);
        //         const hasQuery = !!Object.keys(val).length;
        //         if (!isEqual && !hasQuery) this.clear();
        //     }
        // }
    },
    computed: {
        wtmGroups() {
            return this.$store.getters.dbankWtmsGroups.groups;
        },
        groupsCount() {
            return this.$store.getters.dbankWtmsGroups.total;
        },
        height(){
            return this.$store.getters.getHeight
        },
        dBankWtms() {
            return this.$store.getters.dBankWtms;
        },
        AllGeneratorsValid() {
            return this.editData.generateItems?.every(c => c.field && c.value?.every(c => c.val));
        },

        allDbankWtmInteractionsFilterBy() {
            return this.$store.getters.allDbankWtmInteractionsFilterBy;
        },

        firstResults() {
            return this.dBankWtms.slice(0, 10);
        },

        dbankWtmsMaterialsData() {
            return this.$store.getters.dbankWtmsMaterialsData;
        }
    },
    methods: {
        toggleViewdList(name, val) {
            const idx = this.viewdLists.indexOf(name);
            if (val) {
                if (idx === -1) this.viewdLists.push(name);
            } else {
                if (idx !== -1) this.viewdLists.splice(idx, 1);
            }
            // if (idx === -1) this.viewdLists.push(name);
            // else this.viewdLists.splice(idx, 1);
        },
        async reloadAllLists() {
            await this.loadAllMaterials();
            this.viewdLists.forEach(c => eventBus.$emit('openDbankMatWtmInnerList', c));
        },
        async markAllManagementTerm() {
            this.isLoadingRes = true;
            await this.$store.dispatch({ type: 'markAllManagementTerm', ids: this.editData.ids, term: this.filterBy.filter.search });
            const doneItems = await this.$store.dispatch({ type: 'markAllManagementTerm', ids: this.editData.ids, term: this.filterBy.filter.search });
            doneItems.forEach(id => {
                eventBus.$emit('doneTogglingInt', id, true);
            });
            // this.reloadAllLists();
            this.isLoadingRes = false;
        },
        async tggleAllDone(value) {
            this.isLoadingRes = true;
            await this.$store.dispatch({ type: 'toggleWtmItemsAsDone', ids: this.editData.ids, value });
            this.editData.ids.forEach(id => {
                eventBus.$emit('doneTogglingInt', id, value);
            });
            // this.reloadAllLists();
            this.isLoadingRes = false;
        },
        isToShowDrugParam(generateItem) {
            const iosDrugParameter = generateItem.field === 'drugParameter';
            const isValidValue =  !!drugParameters.find(c => (c.val === generateItem.value) && (c.label === generateItem.field));
            return iosDrugParameter || isValidValue;
        },
        async toggleWtmItemsAsDone(id) {
            this.isLoadingRes = true;
            await this.$store.dispatch({ type: 'toggleWtmItemsAsDone', ids: [id] });
            eventBus.$emit('doneTogglingInt', id);
            this.isLoadingRes = false;
            // this.reloadAllLists();
        },
        selectAllWtmInteractions() {
            this.toggleSelectAllWtmInteractions(true);
        },
        unSelectAllWtmInteractions() {
            this.toggleSelectAllWtmInteractions(false);
        },
        toggleSelectAllWtmInteractions(value) {
            this.isLoadingRes = true;
            setTimeout(() => {
                if (value) this.editData.ids = this.dBankWtms.map(c => c._id);
                else this.editData.ids = [];
                this.isLoadingRes = false;
            }, 100);
        },
        setFilter(filterBy = {}) {
            const criteria = {
                ...this.$route.query,
                ...filterBy,
                colName: 'drugBankInteractionMonitor',
                fieldToSearch: this.filterBy.fieldToSearch,
                searchStr: this.filterBy.filter.search
                // limit: 100
            };
            if (criteria.side1Name) criteria.page = 0;
            if (!criteria.limit) criteria.limit = 50;
            const queryStr = '?' + new URLSearchParams(criteria).toString();
            this.$router.push(queryStr);
        },
        addAnotherGenerateItem() {
            this.editData.generateItems.push(
                { field: '', value: [{ val: '', drug: null }] }
            );
        },
        removeGenerateItem(idx) {
            this.editData.generateItems.splice(idx, 1);
        },
        addGenerateItemValue(item) {
            item.value.push({ val: '', drug: null });
        },
        removeGenerateItemValue(item, idx) {
            item.value.splice(idx, 1);
        },
        async loadResultsData() {
            this.isLoadingRes = true;
            // this.filterBy.searchIncludes = this.filterBy.fieldToSearch === 'management'? false : true;
            await this.$store.dispatch({ type: 'loadDBankWtms', filterBy: this.filterBy });
            this.editData.ids = this.dBankWtms.map(c => c._id);
            this.isLoadingRes = false;
        },
        async generateDbankWtmData(markAsDone = false) {
            this.isGenerating = true;
            const editDataToSend = JSON.parse(JSON.stringify(this.editData));
            editDataToSend.searchBy = this.filterBy.filter.search;
            editDataToSend.searchField = this.filterBy.fieldToSearch;
            editDataToSend.markAsDone = markAsDone;
            editDataToSend.generateItems = editDataToSend.generateItems.reduce((acc, c) => {
                acc.push(...c.value.map(currVal => {
                    const curr = {...c, value: currVal.val, drug: currVal.drug};
                    if (!this.isToShowDrugParam(curr)) curr.drug = null;
                    if (curr.field === 'drugParameter') curr.field = drugParameters.find(_ => _.val === curr.value).label;
                    return curr;
                }));
                return acc;
            }, []);
            // await this.$store.dispatch({ type: 'generateDbankWtmData', data: editDataToSend });
            const daoneItems = await this.$store.dispatch({ type: 'generateDbankWtmData', data: editDataToSend });
            const oldIds = this.editData.ids;
            daoneItems.forEach(id => {
                eventBus.$emit('doneTogglingInt', id, true);
            });
            this.initEditData();
            this.editData.ids = oldIds;
            this.isGenerating = false;
            // this.reloadAllLists();
        },
        initEditData() {
            this.editData = {
                ids: [],
                searchBy: '',
                generateItems: [ { field: '', value: [ { val: '', drug: null } ] } ]
            }
        },
        initSearchData() {
            this.filterBy = {
                dontIgnoreDone: false,
                searchIncludes: true,
                fieldToSearch: this.$route.query.fieldToSearch || 'managementToEdit',
                filter: {
                    search: this.$route.query.searchStr || ''
                }
            }
            this.searchFieldSelected = { field: 'managementToEdit', includes: true, dontIgnoreDone: false };
        },

        clear() {
            this.initEditData();
            this.initSearchData();
            // this.setFilter();
            this.$store.commit({type: 'setDBankWtmsData', dbankWtmsData: { items: [], total: 0 } });
        },

        async loadAllMaterials(filterBy) {
            if (filterBy) this.materialsFilterBy = JSON.parse(JSON.stringify(filterBy));
            this.isLoadingRes = true;
            this.isLoading = true;
            await this.$store.dispatch({ type: 'getDbankWtmMaterials', filterBy: this.materialsFilterBy });
            this.isLoading = false;
            this.isLoadingRes = false;

            // this.isLoadingRes = true;
            // this.isLoading = true;
            // const filterBy = this.$route.query;
            // filterBy.side1Name = this.materialsFilterBy.filter.search;
            // filterBy.isGroups = true;
            // filterBy.sortBy = filterBy.sortBy || 'name';
            // filterBy.isDesc = filterBy.isDesc || false;
            // filterBy.limit = filterBy.limit || 50;
            // filterBy.colName = 'drugBankInteractionMonitor';
            // await this.$store.dispatch({ type: 'getDbankWtmGroups', filterBy });
            // this.isLoading = false;
            // this.isLoadingRes = false;
        }
    },
    mounted(){
        if(this.height){
            window.scrollTo(0, this.height);
        }
    },
    components: {
        // featuredInteractionGroupedList,
        // featuredInteractionFilter,
        // iconsMap,
        BluredLoader,
        ItemSearchList
    }
}
</script>

<style lang="scss">
.drug-bank-wtm-app {
    form {
        padding: 16px;
        input, select, textarea {
            border: 1px solid rgba(0, 0, 0, 0.5);
            border-radius: 3px;
            padding-inline-start: 5px;
        }
        input, select {
            width: 200px;
        }
        span {
        }
        label {
        } 
    }
    .generate-items {
        padding: 10px;
        box-shadow: 0px 0px 10px 0.3px rgba(0,0,0,0.1);
        span {
            width: 100px;
        }
        .drug-side {
            .side-num {
                width: 35px;
            }
            .side-name {
                width: 155px;
            }
        }
    }
    .small-btn {
        background-color: #b9b9b9;
        // padding: 5px;
        box-shadow: 0px 0px 10px 0.3px rgba(0,0,0,0.1);
        height: 25px;
        width: 25px;
        border-radius: 3px;
        span {
            height: unset !important;
            width: unset !important;
        }
    }
    button {
        align-self: flex-start;
    }

    .results-container {
        padding: 16px;
    }

    td:has(.marked-row) {
        background-color: yellow;
    }
}
</style>
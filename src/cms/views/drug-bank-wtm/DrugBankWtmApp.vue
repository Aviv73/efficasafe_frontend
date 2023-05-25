<template>
    <section class="drug-bank-wtm-app">
        <div class="container">
            <v-card class="mb-10">
                <v-card-title>
                    <h2>
                        Drug Bank WTM workshop
                    </h2>
                </v-card-title>
                <form @submit.prevent="loadResultsData" class="search-form flex column align-start gap10">
                    <label class="flex gap10">
                        <span>Search by management</span>
                        <input v-model="filterBy.filter.search" type="text" placeholder="search"/>
                    </label>
                    <v-btn color="primary" type="submit" class="">Search</v-btn>
                </form>
                <form @submit.prevent="" class="flex column gap10">
                    <div v-for="(item, idx) in editData.generateItems" :key="idx" class="generate-items flex align-center gap5">
                        <button class="remove-btn flexx align-center justify-center" @click="removeGenerateItem(idx)"><span>X</span></button>
                        <label class="flex align-center gap10">
                            <span>Monitor field</span>
                            <!-- <input v-model="item.field" type="text" placeholder="monitor field"/> -->
                            <select v-model="item.field" placeholder="monitor field">
                                <option v-for="field in Object.keys(monitorOptsMap)" :key="field" :label="field" :value="field"/>
                            </select>
                        </label>
                        <label class="flex align-center gap10">
                            <span>Monitor Value</span>
                            <input v-model="item.value" type="text" placeholder="monitor value" :list="'monitor-value-' + idx"/>
                            <datalist :id="'monitor-value-' + idx">
                                <option v-for="val in (monitorOptsMap[item.field] || [])" :key="val" :label="val" :value="val"/>
                            </datalist>
                        </label>
                        <label v-if="isToShowDrugParam(item)" class="flex align-center gap10 drug-side">
                            <span>Side drug</span>
                            <input class="side-num" v-model="item.drug" type="number" max="2" min="1"/>
                        </label>
                    </div>
                    <v-btn class="self-start" @click="addAnotherGenerateItem" :disabled="!AllGeneratorsValid">Add one more</v-btn>
                    <v-btn class="self-start" @click="generateData" :disabled="!(AllGeneratorsValid && editData.generateItems.length)">Do it!</v-btn>
                </form>
            </v-card>
            <v-card class="results-container">
                <div class="flex align-center space-between">
                    <h2>
                        Management search Results: 
                    </h2>
                    <v-btn @click="selectAllWtmInteractions" :disabled="!dBankWtms.length">Select All</v-btn>
                    <v-btn @click="unSelectAllWtmInteractions" :disabled="!dBankWtms.length">Unselect All</v-btn>
                </div>
                <p v-if="isLoadingRes">Getting results..</p>
                <p v-else-if="!dBankWtms.length">No results..</p>
                <ul v-else>
                    <li v-for="item in dBankWtms" :key="item._id" class="flex gap10">
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
                <featured-interaction-filter 
                    @filter-changed="setFilter"
                />
                <featured-interaction-grouped-list 
                    :showActions="false"
                    baseItemUrl="/d-bank-interaction"
                    :groups="wtmGroups" 
                    :groupCount="groupsCount" 
                    :isLoading="isLoading"
                    @sort-changed="setFilter"
                    @pagination-changed="setFilter"
                />
            </v-card>
            <icons-map />
        </div>
    </section>
</template>

<script>
import { eventBus } from '@/cms/services/eventBus.service';
import featuredInteractionGroupedList from '@/cms/cmps/featured-interaction/FeaturedInteractionGroupedList';
import featuredInteractionFilter from '@/cms/cmps/featured-interaction/FeaturedInteractionFilter';
import iconsMap from '@/cms/cmps/general/IconsMap';
import monitorOptsMap from './monitorOptsMap.json';

delete monitorOptsMap.drugParameter;

export default {
    name: 'DrugBankWtmApp',
    data() {
        return {
            monitorOptsMap,
            isLoading: false,
            isLoadingRes: false,
            filterBy: {
                filter: {
                    search: ''
                }
            },
            editData: {
                ids: [],
                searchBy: '',
                generateItems: [] // [ { field, value, drug: { side, name } } ]
            },
        }
    },
    created() {
        eventBus.$on('dBankWtmProcessIsDone', this.markWtmItemAsDone);
    },
    destroyed() {
        eventBus.$on('dBankWtmProcessIsDone', this.markWtmItemAsDone);
    },
    watch: {
        'filterBy.filter.search'(val) {
            this.editData.searchBy = val;
        },
        dBankWtms() {
            this.editData.ids = [];
        },
        '$route.query': {
            handler() {
                this.loadAllDbankWtms();
            },
            immediate: true
        }
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
            return this.editData.generateItems.every(c => c.field && c.value);
        },

        allDbankWtmInteractionsFilterBy() {
            return this.$store.getters.allDbankWtmInteractionsFilterBy;
        }
    },
    methods: {
        isToShowDrugParam(generateItem) {
            const iosDrugParameter = generateItem.field === 'drugParameter';
            const isValidValue =  !![
                { val: 'blood drug level', label: 'labTests' },
                { val: 'drug toxicity', label: 'symptoms' },
                { val: 'exacerbation of drug adverse reactions', label: 'symptoms' },
                { val: 'exacerbation of symptoms for which the drug is being given', label: 'symptoms' },
                { val: 'exacerbation of toxicity symptoms', label: 'symptoms' },
                { val: 'potentiation or reduction of drug efficacy', label: 'symptoms' },
                { val: 'reduction of drug efficacy', label: 'symptoms' },
            ].find(c => (c.val === generateItem.value) && (c.label === generateItem.field));
            return iosDrugParameter || isValidValue;
        },
        async markWtmItemAsDone(id) {
            await this.$store.dispatch({ type: 'markWtmItemAsDone', id });
            eventBus.$emit('doneTogglingInt', id);
        },
        selectAllWtmInteractions() {
            this.editData.ids = this.dBankWtms.map(c => c._id);
        },
        unSelectAllWtmInteractions() {
            this.editData.ids = [];
        },
        setFilter(filterBy) {
            const criteria = {
                ...this.$route.query,
                ...filterBy,
                colName: 'drugBankInteractionMonitor'
            };
            if (criteria.side1Name) criteria.page = 0;
            const queryStr = '?' + new URLSearchParams(criteria).toString();
            this.$router.push(queryStr);
        },
        addAnotherGenerateItem() {
            this.editData.generateItems.push(
                { field: '', value: '', drug: null }
            );
        },
        removeGenerateItem(idx) {
            this.editData.generateItems.splice(idx, 1);
        },
        async loadResultsData() {
            this.isLoadingRes = true;
            await this.$store.dispatch({ type: 'loadDBankWtms', filterBy: this.filterBy });
            this.isLoadingRes = false;
        },
        async generateData() {
            this.editData.searchBy = this.filterBy.filter.search;
            this.editData.forEach(c => {
                if (!this.isToShowDrugParam(c)) c.drug = null;
            });
            await this.$store.dispatch({ type: 'generateData', data: this.editData });
            this.initEditData();
        },
        initEditData() {
            this.editData = {
                ids: [],
                searchBy: '',
                generateItems: [] // [ { field, value, drug: { side, name } } ]
            }
        },

        async loadAllDbankWtms() {
            this.isLoading = true;
            const filterBy = this.$route.query;
            filterBy.isGroups = true;
            filterBy.sortBy = filterBy.sortBy || 'name';
            filterBy.isDesc = filterBy.isDesc || false;
            filterBy.limit = filterBy.limit || Number.MAX_SAFE_INTEGER;
            filterBy.colName = 'drugBankInteractionMonitor';
            await this.$store.dispatch({ type: 'getDbankWtmGroups', filterBy });
            this.isLoading = false;
        }
    },
    mounted(){
        if(this.height){
            window.scrollTo(0, this.height);
        }
    },
    components: {
        featuredInteractionGroupedList,
        featuredInteractionFilter,
        iconsMap
    }
}
</script>

<style lang="scss">
.drug-bank-wtm-app {
    form {
        padding: 16px;
        input, select {
            border: 1px solid rgba(0, 0, 0, 0.5);
            border-radius: 3px;
            width: 200px;
            padding-inline-start: 5px;
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
    .remove-btn {
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
}
</style>
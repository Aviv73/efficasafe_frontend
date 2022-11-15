<template>
    <section class="horizontal-list">
        <div v-if="$route.name === 'Results'" class="results-header" >
            <div class="checkbox-container">
                <checkbox class="checkbox" @change="handleCheckbox" :isChecked="isChecked" :biggerRadius="true"></checkbox>
                <h4 class="checkbox-title">Theoretical interactions</h4>
                <span v-if="theoreticalDiff" class="badge diff-badge">{{theoreticalDiff}}</span>
                <tooltip v-if="!isScreenNarrow" on="hover" leftBottomCorner>
                    <template #content>
                        <div class="tooltip-content">
                            <p>Check the box to see Theoretical Drug-Drug interactions. They are presented with a gray background.</p>
                        </div>
                    </template>
                    <information-outline-icon
                        class="tooltip-trigger"
                        :size="18"
                        title=""
                    />
                </tooltip>
            </div>
            <div class="btn-container">
                <button @click="showResults('all')" :class="{selected: isSelected('all')}">All Results</button>
                <button @click="showResults('supp')" :class="{selected: isSelected('supp')}">{{suppDrugBtnTxt}}</button>
                <button @click="showResults('drug')" :class="{selected: isSelected('drug')}">Drug - Drug</button>
            </div>
        </div>
        <header class="horizontal-list-header" v-if="$route.name !== 'Boosters'">
            <span class="horizontal-list-header-item">
                <label
                    class="flex-align-center"
                    title="Sort A-Z / Z-A"
                    tabindex="0"
                >
                    <input type="checkbox" hidden @change="emitSort('name', $event.target.checked)" />
                    <sort-vertical-icon class="sort-icon" title="" />
                    <span>{{ side1Name }} vs {{ side2Name }}</span>
                </label>
                <button
                    @click="changeSortBySide"
                    class="swap-side-btn"
                >
                    <sort-vertical-icon
                        class="swap-side-icon"
                        color="#329D9C"
                        title=""
                    />
                </button>
            </span>
            <span class="horizontal-list-header-item">
            <label
                    class="flex-align-center"
                    :title="sortRecommendationTxt"
                    tabindex="0"
                >
                    <input type="checkbox" hidden @change="emitSort('recommendation', !$event.target.checked)" />
                    <sort-vertical-icon class="sort-icon" title="" />
                    <span>Recommendation</span>
                </label>
                <information-outline-icon
                    class="clickable"
                    :size="12"
                    title=""
                    @click="openAllRecommendations"
                />
            </span>
            <span class="horizontal-list-header-item">
                <div
                    class="flex-align-center"
                    title="Sort by level of evidence"
                    tabindex="0"
                >
                    <span>Level of Evidence</span>
                </div>
                <tooltip on="hover" leftBottomCorner>
                    <template #content>
                        <div class="tooltip-content">
                            <ul>
                                <h3 class="loe-tootltip-header">DRUGBANK Ratings</h3>
                                <li>1 - Drug label</li>
                                <li>2 - Research</li>
                                <h3 class="loe-tootltip-header mt">Efficasafe Ratings</h3>
                                <li>A - multi clinical or meta analysis</li>
                                <li>B - 1 clinical or cohort + pre-clinical</li>
                                <li>C - 1 clinical or cohort</li>
                                <li>D - case report</li>
                                <li>E - multi pre-clinical</li>
                                <li>F - 1 pre-clinical</li>
                                <li>Z - no rating</li>
                            </ul>
                        </div>
                    </template>
                    <information-outline-icon
                        class="tooltip-trigger"
                        :size="12"
                        title=""
                    />
                </tooltip>
            </span>
        </header>
        <ul class="horizontal-list-list">
            <li v-if="$route.name === 'Monitor' && isDBankInteractions" class="horizontal-list-list-item boosters-opener flex-center txt-center">Monitoring guidance for Drug-Drug interactions can be found inside each interaction page.</li>
            <li
                class="horizontal-list-list-item"
                v-if="$route.name === 'Monitor' && total"
            >
                <monitor-summary :interactions="interactions" />
            </li>
            <!-- <li
                class="horizontal-list-list-item boosters-opener flex-center"
                v-else-if="$route.name === 'Boosters' && !isScreenNarrow"
            >
                <span>
                    To see an explanation tour about this tab
                    <button
                        class="tour-btn font-medium"
                        @click="$tours['boosters-tour'].start()"
                        title="Get to know the Optimizers"
                    >
                        Click here
                    </button>
                </span>
            </li> -->
            <li
                class="horizontal-list-list-item"
                v-for="(interaction, idx) in interactions"
                :key="interaction._id + idx"
            >
                <interaction-preview
                    :interaction="interaction"
                    :materials="materials"
                    :link="$route.name !== 'Monitor'"
                    :idx="idx"
                />
            </li>
            <button v-if="(currSuppInteractions.length || emptySuppInteractions.length || suppRedInteractions.length) && isLoadingSuppInteractions" class="show-pos-supp-btn loading">
                <p>Optimizers - supplements</p>
                <loader class="loader" />
            </button>
            <div v-show="!isLoadingSuppInteractions">
                <collapse v-if="interactions.length && (currSuppInteractions.length || emptySuppInteractions.length || suppRedInteractions.length)" :showTimes="false" :initial-is-visible="isShowPosSupp">
                    <template #header>
                        <button @click="showPosSupp" class="show-pos-supp-btn">
                            <p>Optimizers - supplements ({{suppCount}})</p>
                            <chevron-up-icon  v-if="isShowPosSupp"/>
                            <chevron-down-icon v-else />
                        </button>
                    </template>
                    <template #content>
                        <div>
                            <li 
                                class="horizontal-list-list-item"
                                v-for="(interaction, idx) in suppInteractionsToShow"
                                :key="interaction._id"
                            >
                                <interaction-preview
                                    :interaction="interaction"
                                    :materials="materials"
                                    :link="$route.name !== 'Monitor'"
                                    :idx="idx"
                                    :isSupp="true"
                                    :counter="renderKey"
                                    @removeInteraction="removeInteraction"
                                    @interactionDone="interactionDone"
                                />
                            </li>
                            <li 
                                class="horizontal-list-list-item"
                                v-for="(interaction, idx) in emptySuppInteractions"
                                :key="interaction._id"
                            >
                                <interaction-preview
                                    :interaction="interaction"
                                    :materials="materials"
                                    :link="$route.name !== 'Monitor'"
                                    :idx="idx"
                                    :isSupp="true"
                                    @removeInteraction="removeInteraction"
                                    @interactionDone="interactionDone"
                                />
                            </li>
                            <li 
                                class="horizontal-list-list-item"
                                v-for="(interaction, idx) in suppRedInteractions"
                                :key="interaction._id"
                            >
                                <interaction-preview
                                    :interaction="interaction"
                                    :materials="materials"
                                    :link="$route.name !== 'Monitor'"
                                    :idx="idx"
                                    :isSupp="true"
                                    @removeInteraction="removeInteraction"
                                    @interactionDone="interactionDone"
                                />
                            </li>
                        </div>
                    </template>
                </collapse>
                <div v-if="!interactions.length && (currSuppInteractions.length || emptySuppInteractions.length || suppRedInteractions)">
                    <li 
                        class="horizontal-list-list-item"
                        v-for="(interaction, idx) in suppInteractionsToShow"
                        :key="interaction._id"
                    >
                        <interaction-preview
                            :interaction="interaction"
                            :materials="materials"
                            :link="$route.name !== 'Monitor'"
                            :idx="idx"
                            :counter="renderKey"
                            :isSupp="true"
                            @removeInteraction="removeInteraction"
                            @interactionDone="interactionDone"
                        />
                    </li>
                    <li 
                        class="horizontal-list-list-item"
                        v-for="(interaction, idx) in emptySuppInteractions"
                        :key="interaction._id"
                    >
                        <interaction-preview
                            :interaction="interaction"
                            :materials="materials"
                            :link="$route.name !== 'Monitor'"
                            :idx="idx"
                            :isSupp="true"
                            @removeInteraction="removeInteraction"
                            @interactionDone="interactionDone"
                        />
                    </li>
                    <li 
                        class="horizontal-list-list-item"
                        v-for="(interaction, idx) in suppRedInteractions"
                        :key="interaction._id"
                    >
                        <interaction-preview
                            :interaction="interaction"
                            :materials="materials"
                            :link="$route.name !== 'Monitor'"
                            :idx="idx"
                            :isSupp="true"
                            @removeInteraction="removeInteraction"
                            @interactionDone="interactionDone"
                        />
                    </li>
                </div> 
            </div>
        </ul>
        <modal-wrap
            :isActive="isAllRecommendationsModalActive"
            @close-modal="closeAllRecommendations"
            >
            <all-recommendations-modal @close-modal="closeAllRecommendations">
            </all-recommendations-modal>
        </modal-wrap>
    </section>
</template>

<script>
import { eventBus, EV_sortby_side_swaped } from '@/cms/services/eventBus.service';

import InteractionPreview from '@/client/cmps/search-engine/InteractionPreview';
import Tooltip from '@/client/cmps/common/Tooltip';
import Collapse from '@/client/cmps/common/Collapse';
import MonitorSummary from '@/client/cmps/search-engine/MonitorSummary';
import Loader from '@/client/cmps/common/icons/Loader';
import ModalWrap from '@/client/cmps/common/ModalWrap';
import AllRecommendationsModal from '@/client/cmps/shared/modals/AllRecommendationsModal';
import Checkbox from "@/client/cmps/common/Checkbox";

import SortVerticalIcon from '@/client/cmps/common/icons/SortVerticalIcon';
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline';
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';
import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';


export default {
    props: {
        interactions: {
            type: Array,
            default: () => []
        },
        suppInteractions: {
            type: Array,
            default: () => []
        },
        suppRedInteractions: {
            type: Array,
            default: () => []
        },
        suppEmptyInteractions: {
            type: Array,
            default: () => []
        },
        pageCount: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        },
        materials: {
            type: Array,
            default: () => []
        },
        evidenceLevelPopupActive: {
            type: Boolean,
            default: false
        },
        isDBankInteractions: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            isShowPosSupp: false,
            showBtn: true,
            interactionDoneLoadingCount: 0,
            suppInteractionsOriginalLength: null,
            isLoadingSuppInteractions: true,
            emptySuppInteractions: [],
            currSuppInteractions: null,
            isAllRecommendationsModalActive: false,
            renderKey: 101,
            isChecked: false
        }
    },
    computed: {
        isShowAllDBI(){
            return this.$store.getters.isShowAllDBI
        },
        side1Name() {
            if (this.listType === 'drug') return 'Drug';
            return (this.sortBySide === 1) ? 'Supplement' : 'Drug';
        },
        side2Name() {
            if (this.listType === 'drug') return 'Drug';
            return (this.sortBySide === 1) ? 'Drug' : 'Supplement';
        },
        sortBySide() {
            return this.$store.getters.firstInteractionSide;
        },
        sortBy(){
            return this.$store.getters.InteractionSort;
        },
        listType(){
            return this.$store.getters.getListType;
        },
        suppInteractionsToShow(){
            const toShow =  this.currSuppInteractions.filter(i => !i.isNotToShow)
            return toShow
        },
        suppCount(){
            return this.$store.getters.getPosSuppBoostersCount
        },
        isSelected(){
            return (type) => {
                return type === this.listType
            }
        },
        suppDrugBtnTxt(){
            if(this.isAllSupp) return 'All Results'
            return 'Supplements - Drug'
        },
        sortRecommendationTxt(){
            if(this.pageCount > 1) return 'sorting is only available for one page at a time'
            return 'Sort by recommendation'
        },
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        },
        theoreticalDiff(){
            return this.$store.getters.theoreticalDiff
        }
    },
    methods: {
        handleCheckbox(isChecked){
            this.isChecked = isChecked
            this.$emit('handle-DBI-filter', isChecked)
        },
        showResults(type){
            this.$store.commit({type: 'setListType', listType: type})
            this.$router.push({ query: { q: [ ...this.$route.query.q ], page: 1 } }).catch(() => {})
        },
        removeInteraction(idx){
            const emptyInteraction = {
                        name: this.currSuppInteractions[idx].name,
                        recommendation: '',
                        vInteractions: [],
                        evidenceLevel: '',
                        isMaterialGroup: true,
                        isEmpty: true,
                        isNotToShow: true,
                        total: 0
                    }
                this.currSuppInteractions.splice(idx,1, emptyInteraction)
                this.emptySuppInteractions.push(emptyInteraction)
                setTimeout(() => {
                    this.isLoadingSuppInteractions = false
                },10000)
        },
        interactionDone(){
            if(!this.currSuppInteractions.length){
                this.isLoadingSuppInteractions = false
                this.renderKey++
                }
            this.interactionDoneLoadingCount++
            if(this.interactionDoneLoadingCount === this.suppInteractionsOriginalLength){
                this.isLoadingSuppInteractions = false
                this.renderKey++
            }
        },
        showPosSupp(){
            this.$store.commit('setIsPosSuppOpen')
            this.isShowPosSupp = !this.isShowPosSupp
        },
        emitSort(sortBy, isChecked) {
            this.$emit('list-sorted', { sortBy, side: this.sortBySide, isDesc: !isChecked });
            if(this.$route.name === 'Results'){
                const newSort = [sortBy, isChecked]
                this.$store.commit({ type: 'setSortBy', newSort});
            }
        },
        getInteractionKey(interaction) {
            return (interaction.side2Material) ? `${interaction._id}-${interaction.side2Material._id}` : interaction._id;
        },
        changeSortBySide() {
            let side;
            if (this.sortBySide === 1) side = 2;
            else side = 1;
            this.$store.commit({ type: 'setFirstInteractionSide', side });
            eventBus.$emit(EV_sortby_side_swaped, this.sortBySide);
        },
        restoreCollapses(){
            if(this.$store.getters.getIsPosSuppOpen){
                this.isShowPosSupp = true
            }
        },
        restoreSort(){
            if(this.$route.name === 'Results'){
                this.$nextTick(() => {
                    this.emitSort(this.sortBy[0], this.sortBy[1])
                })
                this.$nextTick(() => {
                    eventBus.$emit(EV_sortby_side_swaped, this.sortBySide);
                })
            }
        },
        openAllRecommendations(){
            this.isAllRecommendationsModalActive = true
        },
        closeAllRecommendations(){
            this.isAllRecommendationsModalActive = false
        }
    },
    mounted(){
        setTimeout(() => {
            eventBus.$emit('interaction-list-mounted')
        }, 0)
    },
    created(){
        this.currSuppInteractions = JSON.parse(JSON.stringify(this.suppInteractions))
        if(!this.currSuppInteractions.length){
            this.isLoadingSuppInteractions = false
            this.renderKey++
            }
        this.suppInteractionsOriginalLength = this.suppInteractions.length
        this.restoreCollapses();
        this.restoreSort();
        this.isChecked = this.isShowAllDBI
        this.$nextTick(()=>{
            eventBus.$emit(EV_sortby_side_swaped, this.sortBySide);
        })
    },
    watch: {
        suppEmptyInteractions:{
            handler(){
                this.emptySuppInteractions = JSON.parse(JSON.stringify(this.suppEmptyInteractions))
            },
            immediate: true
        },
        suppInteractions:{
            handler(){
                this.currSuppInteractions = JSON.parse(JSON.stringify(this.suppInteractions))
            },
            immediate: true
        },
    },
    components: {
        InteractionPreview,
        SortVerticalIcon,
        InformationOutlineIcon,
        Tooltip,
        ModalWrap,
        AllRecommendationsModal,
        Collapse,
        MonitorSummary,
        ChevronDownIcon,
        ChevronUpIcon,
        Loader,
        Checkbox,
    }
};
</script>
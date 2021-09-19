<template>
    <section class="interaction-preview positive-booster" v-if="currInteraction && currInteraction.vInteractions.length">
        <collapse
            v-for="(group, idx) in currInteraction.vInteractions"
            :key="group._id + idx"
            @collapse-closed="onCollapseToggle(idx, group.cacheKey)"
            :initial-is-visible="isInitialiOpen(idx)"
        >
            <template #header>
                <div class="interaction-preview-header table-row child" @click="onCollapseToggle(idx, group.cacheKey)">
                    <span class="table-col">
                        <minus-icon
                            class="minus-icon"
                            title=""
                        />
                        <positive-inner-list-count :key="renderKey" :group="group" :length="group.innerLength"/>
                        <interaction-capsules
                            :name="getInnerGroupName(group)"
                            :isMaterialGroup="true"
                            :color="getInteractionColor(group.recommendation)"
                            :showDraftName="false"
                            :vInteractionCount="0"
                            :localize="true"
                        />
                    </span>
                    <span class="table-col" :title="group.recommendation">
                        {{ getShortRecommendation(group.recommendation) }}
                    </span>
                    <span class="table-col">
                        <tooltip
                            :txt="getLongEvidenceLevel(group.evidenceLevel)"
                            right
                        >
                            <span class="evidence-level">
                                {{ group.evidenceLevel }}
                            </span>
                        </tooltip>
                        <span class="de-activator">
                            <chevron-up-icon class="opened" title="" />
                            <chevron-down-icon class="closed" title="" />
                        </span>
                    </span>
                </div>
            </template>
            <template #content>
                <div class="interaction-preview-content">
                    <positive-interaction-inner-list
                        :side1-id="group.side1Material._id"
                        :side2-id="group.side2Material._id"
                        :main-side2-material-id="interaction.mainMaterialId"
                        :materials="materials"
                        :exactName="interaction.exactName"
                        :isSupp="isSupp"
                        :groupIdx="idx"
                        @remove="removeGroup"
                        @groupDone="groupDone"
                        @setInnerInteractionsLength="setInnerInteractionsLength"
                    />
                </div>
            </template>
            <template #de-activator>
                <collapse-toggle-icon />
            </template>
        </collapse>
    </section>
</template>

<script>
import { interactionUIService } from '@/cms/services/interaction-ui.service';
import { interactionService } from '@/cms/services/interaction.service';

import Collapse from '@/client/cmps/common/Collapse';
import Tooltip from '@/client/cmps/common/Tooltip';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';
import PositiveInteractionInnerList from '@/client/cmps/search-engine/PositiveInteractionInnerList';
import PositiveInnerListCount from '@/client/cmps/search-engine/PositiveInnerListCount';

import CollapseToggleIcon from '@/client/cmps/common/icons/CollapseToggleIcon';
import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';
import MinusIcon from 'vue-material-design-icons/Minus';

export default {
    props: {
        interaction: {
            type: Object,
            required: true
        },
        materials: {
            type: Array,
            required: true
        },
        parentIdx: {
            type: Number,
            required: true
        },
        isSupp: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            openCollapses: [],
            currInteraction: null,
            groupsDoneLoadingCount: 0,
            vInteractionsOriginalLength: null,
            renderKey: 101
        }
    },
    methods: {
        getBadgeColor({recommendation}){
            const color = interactionUIService.getInteractionColor(recommendation);
            if(color === '#F6D55C') return 'background-color: #F6D55C; color: blue'
            return 'background-color: #55C595'
        },
        setInnerInteractionsLength(data){
            if(this.currInteraction.vInteractions[data.idx]) {
                this.currInteraction.vInteractions[data.idx].innerLength = data.length
            }
            this.renderKey++
        },
        removeGroup(idx){
            this.currInteraction.vInteractions.splice(idx,1)
            this.$emit('setCount', this.currInteraction.vInteractions.length)
            if(!this.currInteraction.vInteractions.length){
                this.$emit('removeInteraction', this.parentIdx)
            } 
        },
        groupDone(){
            this.groupsDoneLoadingCount++
            const ids = this.currInteraction.vInteractions.map(vInt => `${this.currInteraction.mainMaterialId}-${vInt.side1Material._id}-${vInt.side2Material._id}`)
            this.$nextTick(() => {
                this.$store.commit('setPosSuppIds', { ids })
                if(this.groupsDoneLoadingCount === this.vInteractionsOriginalLength){
                    this.$emit('interactionDone')
                }
            })
        },
        isInitialiOpen(idx) {
            return this.openCollapses.includes(idx);
        },
        onCollapseToggle(idx, key) {
            const chacheData = {
                key,
                idx,
                parentIdx: this.parentIdx
            };
            interactionService.chacheSearchState(chacheData);
        },
        getInteractionColor(recommendation) {
            return interactionUIService.getInteractionColor(recommendation);
        },
        getInnerGroupName(group) {
            let idx = 0
            if(this.isSupp && this.interaction.mainMaterialId === group.side1Material._id) idx = 1
            return group.name.split('&')[idx].trim();
        },
        getShortRecommendation(fullRec) {
            return interactionUIService.getShortRecommendation(fullRec);
        },
        getLongEvidenceLevel(evidenceLevel) {
            if (!evidenceLevel) return '';
            switch (evidenceLevel.toString().toUpperCase()) {
                case 'A':
                    return 'A - multi clinical or meta analysis';
                case 'B':
                    return 'B - 1 clinical or cohort + pre-clinical';
                case 'C':
                    return 'C - 1 clinical or cohort';
                case 'D':
                    return 'D - case report';
                case 'E':
                    return 'E - multi pre-clinical';
                case 'F':
                    return 'F - 1 pre-clinical';
                case '1':
                    return 'information formally provided in official prescribing information';
                case '2':
                    return 'based on scientific and clinical knowledge referenced from a variety of evidence sources';
                default:
                    return '';
            }
        }
    },
    created() {
        this.interaction.vInteractions.forEach(({ cacheKey }) => {
            if(!cacheKey) return 
            const res = interactionService.getChache(cacheKey);
            if(!res?.searchState) return;
            Object.values(res.searchState).forEach(value => {
                Object.keys(value).forEach(idx => {
                    this.openCollapses.push(+idx);
                });
            });
        });
         this.currInteraction = JSON.parse(JSON.stringify(this.interaction))
         this.vInteractionsOriginalLength = this.currInteraction.vInteractions.length
    },
    components: {
        Collapse,
        MinusIcon,
        InteractionCapsules,
        Tooltip,
        ChevronUpIcon,
        ChevronDownIcon,
        PositiveInteractionInnerList,
        PositiveInnerListCount,
        CollapseToggleIcon
    }
}
</script>
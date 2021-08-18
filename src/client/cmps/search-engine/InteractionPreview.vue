<template>
    <section class="interaction-preview">
        <collapse
            @collapse-closed="onCollapseToggle"
            :initial-is-visible="initialCollapseIsVisible"
        >
            <template #header>
                <component
                    :is="headerCmp"
                    :to="interactionURL"
                    @click="onCollapseToggle"
                >
                    <div
                        class="interaction-preview-header table-row"
                        :class="{
                            'child': isChild,
                            'dups-list': isDuplicate,
                            'empty-group': interaction.isEmpty
                        }"
                    >
                        <span
                            class="table-col"
                            :class="{ 'flex-align-center': isDuplicate }"
                        >
                            <minus-icon
                                class="minus-icon"
                                v-if="isChild"
                                title=""
                            />
                            <interaction-capsules
                                :name="interactionName"
                                :color="getInteractionColor(interaction.recommendation)"
                                :vInteractionCount="getVinteractionsCount(interaction)"
                                :localize="!isCompoundPart"
                                :showDraftName="isDuplicate"
                                :draftName="interaction.side2DraftName"
                                :isLabel="!!interaction.side2Label"
                                :isMaterialGroup="!!interaction.isMaterialGroup"
                                :exactName="exactName"
                                :isPositive="isPositive"
                            />
                        </span>
                        <span class="table-col" :title="interaction.recommendation">
                            {{ getShortRecommendation(interaction.recommendation) }}
                        </span>
                        <span class="table-col">
                            <tooltip
                                :txt="getLongEvidenceLevel(interaction.evidenceLevel || interaction.evidence_level)"
                                right
                            >
                                <span class="evidence-level">
                                    {{ interaction.evidenceLevel || interaction.evidence_level }}
                                </span>
                            </tooltip>
                            <span
                                class="refs" 
                                v-if="interaction.refs && !interaction.side2Label"
                            >
                                {{ getRefsCount(interaction) }}
                            </span>
                            <span
                                v-if="((!interaction.refs && !interaction.severity) || interaction.side2Label) && !interaction.isEmpty"
                                class="de-activator"
                            >
                                <chevron-up-icon class="opened" title="" />
                                <chevron-down-icon class="closed" title="" />
                            </span>
                        </span>
                    </div>
                </component>
            </template>
            <template #content>
                <div
                    class="interaction-preview-content"
                    :class="{ 'link': link }"
                    v-if="!interaction.side2Label && interaction.side2Material"
                >
                    <div v-if="!link">
                        <div v-if="$route.name === 'Monitor'">
                           <ul
                                class="monitor-list"
                                v-if="interaction.monitor.general || interaction.monitor.labTests || interaction.monitor.otherTests || interaction.monitor.symptoms"
                            >
                               <li v-if="interaction.monitor.general">
                                   <span class="monitor-list-header font-bold">General:</span>
                                   {{ interaction.monitor.general | remove-ending-dot }}
                               </li>
                               <li v-if="interaction.monitor.labTests">
                                   <span class="monitor-list-header font-bold">Lab tests:</span>
                                   {{ interaction.monitor.labTests | remove-ending-dot }}
                               </li>
                               <li v-if="interaction.monitor.otherTests">
                                   <span class="monitor-list-header font-bold">Other tests:</span>
                                   {{ interaction.monitor.otherTests | remove-ending-dot }}
                               </li>
                               <li v-if="interaction.monitor.symptoms">
                                   <span class="monitor-list-header font-bold">Symptoms:</span>
                                   {{ interaction.monitor.symptoms | remove-ending-dot }}
                               </li>
                           </ul>
                           <p class="monitor-list" v-else>There is nothing to monitor for this interaction.</p>
                        </div>
                        <div v-else>
                            <h3 class="font-bold">Summary</h3>
                            <long-txt
                                :txt="interaction.summary"
                                :maxChars="250"
                                :expandable="false"
                                :overflowSymb="getInteractionLink(interaction)"
                                isHTML
                            />
                        </div>
                    </div>
                    <chevron-up-icon
                        class="chevron-icon"
                        :class="{
                            'u-hide': $route.name === 'Monitor'
                        }"
                        title=""
                    />
                </div>
                <div
                    class="interaction-preview-content"
                    :class="{ 'child': isChild  }"
                    v-else-if="interaction.side2Label && !interaction.side2Material"
                >
                    <label-interaction-preview
                        :interaction="interaction"
                        :material="materials[0]"
                        :materialIds="materialIds"
                        :shortRecommendation="getShortRecommendation(interaction.recommendation)"
                        :color="getInteractionColor(interaction.recommendation)"
                        :link="link"
                        :parent-idx="idx"
                    />
                </div>
                <div v-else-if="!!interaction.isMaterialGroup">
                    <positive-interaction-preview
                        :interaction="interaction"
                        :materials="materials"
                        :parent-idx="idx"
                        :isSupp="isSupp"
                    />
                </div>
                <div 
                    v-else
                    class="interaction-preview-content"
                    :class="{
                        'child': isChild,
                        'group': true
                    }"
                >
                    <p
                        class="msg"
                        v-if="interaction.isCompoundGroup === false"
                    >
                        There are different interactions, dependent on {{ getSide2Name(interaction.name) }} use:
                    </p>
                    <div
                        v-for="(vInteraction, index) in interaction.vInteractions"
                        :key="index"
                    >
                        <interaction-preview
                            :interaction="vInteraction"
                            :materials="materials"
                            :isCompoundPart="isCompoundPart || interaction.isCompoundGroup"
                            :isDuplicate="interaction.isCompoundGroup === false"
                            :link="link"
                            :idx="index"
                            :parent-idx="idx"
                            is-child
                        />
                    </div>
                </div>
            </template>
            <template #de-activator>
                <collapse-toggle-icon />
            </template>
        </collapse>
    </section>
</template>

<script>
import { eventBus, EV_sortby_side_swaped } from '@/cms/services/eventBus.service';
import { interactionUIService } from '@/cms/services/interaction-ui.service';
import { interactionService } from '@/cms/services/interaction.service';

import Collapse from '@/client/cmps/common/Collapse';
import Tooltip from '@/client/cmps/common/Tooltip';
import LongTxt from '@/client/cmps/common/LongTxt';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';
import LabelInteractionPreview from '@/client/cmps/search-engine/LabelInteractionPreview';
import PositiveInteractionPreview from '@/client/cmps/search-engine/PositiveInteractionPreview';

import CollapseToggleIcon from '@/client/cmps/common/icons/CollapseToggleIcon';
import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';
import MinusIcon from 'vue-material-design-icons/Minus';

export default {
    name: 'InteractionPreview',
    props: {
        interaction: {
            type: Object,
            required: true
        },
        link: {
            type: Boolean,
            default: false
        },
        isChild: {
            type: Boolean,
            default: false
        },
        isPositive: {
            type: Boolean,
            default: false
        },
        materials: {
            type: Array,
            required: true
        },
        isCompoundPart: {
            type: Boolean,
            default: false
        },
        isDuplicate: {
            type: Boolean,
            default: false
        },
        idx: {
            type: Number,
            required: true
        },
        parentIdx: {
            type: Number,
            required: false
        },
        exactName: {
            type: String,
            required: false
        },
        isSupp: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            pathwayRefCount: 0,
            primarySideInView: 1,
            initialCollapseIsVisible: false,
        }
    },
    computed: {
        collapsesState() {
            return this.$store.getters.openCollapses;
        },
        interactionName() {
            if (this.primarySideInView === 1) {
                return this.interaction.name;
            }
            return this.interaction.name.split(' & ').reverse().join(' & ');
        },
        materialIds() {
            return this.materials.reduce((acc, { _id, labels }) => {
                if (!acc.includes(_id)) acc.push(_id);
                labels.forEach(label => {
                    if (!acc.includes(label._id)) acc.push(label._id);
                });
                return acc;
            }, []);
        },
        isGroup() {
            return !this.link || !!this.interaction.vInteractions || !!this.interaction.side2Label;
        },
        headerCmp() {
            return this.isGroup ? 'span' : 'router-link';
        },
        interactionURL() {
            const { interaction } = this;
            if (interaction.subject_drug) return `/interaction/drug2drug/${interaction._id}`;
            return interaction.isVirtual ? `/interaction/${interaction._id}/${interaction.side2Material._id}` : `/interaction/${interaction._id}`;
        },
    },
    methods: {
        restoreCollapses() {
            if (!this.collapsesState[this.$route.name]) return;
            Object.entries(this.collapsesState[this.$route.name]).forEach(([ key, value ]) => {
                if (this.parentIdx === undefined && this.idx === +key) {
                    this.initialCollapseIsVisible = this.isGroup;
                }
                Object.keys(value).forEach(innerKey => {
                    if (this.parentIdx === +key && this.idx === +innerKey) {
                        this.initialCollapseIsVisible = this.isGroup;
                    }
                });
            });
        },
        onCollapseToggle() {
            const chacheData = {
                key: this.$route.fullPath,
                idx: this.idx,
                parentIdx: this.parentIdx
            };
            interactionService.chacheSearchState(chacheData);
        },
        getSide2Name(name) {
            const side2Name = name.split(' & ')[1].trim();
            if (!this.isCompoundPart && this.$store.getters.materialNamesMap[side2Name]) {
                return this.$store.getters.materialNamesMap[side2Name][0];
            }
            return side2Name;
        },
        getRefsCount(interaction) {
            if (interaction.refs) {
                return `(${interaction.refs.length + this.pathwayRefCount})`;
            }
            return '';
        },
        async getPathwayRefsCount() {
            const { interaction } = this;
            if (!interaction.side2Material) return 0;
            let side2Material = this.materials.find(material => material._id === interaction.side2Material._id);
            if (!side2Material) {
                side2Material = await this.$store.dispatch({
                    type: 'loadMaterial',
                    matId: interaction.side2Material._id
                });
            }
            const side2Pathways = side2Material.pathways.reduce((acc, pathway) => {
                if (
                    ((pathway.type === 'enzyme' || pathway.type === 'transporter') &&
                    (pathway.actions.includes('substrate') || pathway.actions.includes('binder')))
                    ||
                    (pathway.type === 'carrier' &&
                    (!pathway.actions.includes('inducer') && !pathway.actions.includes('inhibitor')))
                ) {
                    acc.push(pathway);
                }

                return acc;
            }, []);
            const seenRefsMap = {};
            const side2Refs = side2Pathways.reduce((acc, pathway) => {
                pathway.references.forEach(ref => {
                    if (!seenRefsMap[ref]) {
                        acc.push(ref);
                        seenRefsMap[ref] = true;
                    }
                });
                return acc;
            }, []);
            let side1Material = this.materials.find(material => material._id === interaction.side1Material._id);
            let side1PathwayRefs = [];
            if (!side1Material) {
                side1Material = await this.$store.dispatch({
                    type: 'loadMaterial',
                    matId: interaction.side1Material._id
                });
            }
            side1PathwayRefs = side1Material.pathways.reduce((acc, pathway) => {
            const idx = side2Pathways.findIndex(side2Pathway => side2Pathway.name.replace('CYP', '').toUpperCase() === pathway.name.replace('CYP', '').toUpperCase());
            if (idx !== -1) {
                const refs = interactionUIService.getRefsOrder(pathway.influence);
                refs.forEach(ref => {
                    if (!seenRefsMap[ref]) {
                        if (!interaction.refs.includes(ref)) {
                            acc.push(ref);
                        }
                        seenRefsMap[ref] = true;
                    }
                });
            }
                return acc;
            }, []);
            const refs = interactionUIService.getRefsOrder(side1Material.effectOnDrugMetabolism);
            refs.forEach(ref => {
                if (!seenRefsMap[ref]) {
                    if (!interaction.refs.includes(ref)) {
                        side1PathwayRefs.push(ref);
                    }
                    seenRefsMap[ref] = true;
                }
            });
            
            this.$store.commit({ type: 'updateSupplementsRefs', refs: side1PathwayRefs });
            this.pathwayRefCount = side1PathwayRefs.length + side2Refs.length;
        },
        getVinteractionsCount(interaction) {
            if (!('vInteractions' in interaction)) return 0;
            return interaction.vInteractions.reduce((acc, vInteraction) => {
                if (!vInteraction.vInteractions) acc++;
                else acc += vInteraction.vInteractions.length;

                return acc;
            }, 0);
        },
        getInteractionLink(interaction) {
            const url = interaction.isVirtual ? `/interaction/${interaction._id}/${interaction.side2Material._id}` : `/interaction/${interaction._id}`;
            return `.
                <a class="interaction-link" href="${url}">
                    Read more...
                </a>
            `;
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
        },
        getShortRecommendation(fullRec) {
            return interactionUIService.getShortRecommendation(fullRec);
        },
        getInteractionColor(recommendation) {
            return interactionUIService.getInteractionColor(recommendation);
        },
        swapSideNames(side) {
            this.primarySideInView = side;
        },
        setIsLabelChildEmpty(isEmpty){
            this.isLabelChildEmpty = !isEmpty
        }
    },
    created() {
        this.getPathwayRefsCount();
        eventBus.$on(EV_sortby_side_swaped, this.swapSideNames);
        this.restoreCollapses();
    },
    beforeDestroy() {
        eventBus.$off(EV_sortby_side_swaped, this.swapSideNames);
    },
    components: {
        Collapse,
        InteractionCapsules,
        ChevronUpIcon,
        LongTxt,
        LabelInteractionPreview,
        Tooltip,
        ChevronDownIcon,
        MinusIcon,
        PositiveInteractionPreview,
        CollapseToggleIcon
    }
}
</script>
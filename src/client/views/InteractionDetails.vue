<template>
    <section class="interaction-details">
        <header class="interaction-details-header">
            <div class="interaction-details-header-container">
                <span class="brim-start" />
                <div class="flex-space-between">
                    <span class="interaction-details-header-link no-print">
                        <button class="flex-align-center" @click="$router.go(-1)">
                            <chevron-left-icon title="" />
                            Back to search
                        </button>
                    </span>
                    <router-link to="/" class="interaction-details-header-logo">
                        <img :src="require('@/client/assets/imgs/logo-vector.svg')" alt="Logo" />
                    </router-link>
                    <span class="interaction-details-header-actions">
                        <button
                            class="print-btn print-btn-icon no-print"
                            title="Print"
                            :disabled="!loggedInUser"
                            @click="printWindow()"
                        >
                            <printer-icon title="" />
                        </button>
                        <button
                            class="share-btn share-btn-icon no-print"
                            title="Share"
                            :disabled="!loggedInUser"
                            @click="isShareModalActive = true"
                        >
                            <share-variant-icon title="" :size="isScreenNarrow ? 18 : 24" />
                        </button>
                    </span>
                </div>
                <span />
            </div>
        </header>
        <article class="interaction-details-content" v-if="!isLoading && ((!isVirtual && interaction) || (isVirtual && interaction && side2Material))">
            <header class="interaction-details-content-header">
                <div class="main-container">
                    <div class="flex-center p-relative">
                        <interaction-capsules
                            class="capsules"
                            :name="interactionName"
                            :color="interactionColor"
                            :vInteractionCount="0"
                            :localize="false"
                            :showDraftName="false"
                            on-details-page
                        />
                        <span
                            class="recommendation-capsule"
                            :class="{ 'txt-dark': interactionColor === '#F6D55C' }"
                            :style="{ 'background-color': interactionColor }"
                        >
                            <component :is="recommendationIconName" :size="14" />
                            <span class="clip-txt">{{ interaction.recommendation }}</span>
                        </span>
                        <span class="evidence-level">
                            {{ interaction.evidenceLevel }}
                            <tooltip on="hover" right-top>
                                <template #content>
                                    <div class="evidence-level-tooltip-content" v-html="refsDetailsTxt" />
                                </template>
                                <span class="refs">
                                    <span class="refs-count">({{ combinedRefs.length }})</span> 
                                    <information-outline-icon :size="12" title="" />
                                </span>
                            </tooltip>
                        </span>
                    </div>
                </div>
            </header>
            <main class="interaction-details-details">
                <div class="main-container p-relative mobile-coloumn">
                    <span
                        class="recommendation-capsule mobile"
                        :class="{ 'txt-dark': interactionColor === '#F6D55C' }"
                        :style="{ 'background-color': interactionColor }"
                    >
                        <component :is="recommendationIconName" :size="14" />
                        {{ interaction.recommendation }}
                    </span>
                    <div
                        class="narrow-therapuetic-warnning"
                        v-if="side2Material.isNarrowTherapeutic"
                    >
                        Attention: {{ side2Material.name }} has a narrow therapeutic range. Differences
                        in dose or blood concentration may lead to serious therapeutic failures and/or adverse
                        drug reactions.
                    </div>
                    <div
                        class="note-container flex-center"
                        v-if="!isPrimaryMaterial && interaction.note"
                    >
                        <span class="note">
                            <span class="font-bold">Note:</span> {{ interaction.note }}
                        </span>
                    </div>
                    <div class="evidence-level-mobile">
                        <span class="font-bold">Level of evidence:</span> {{ interaction.evidenceLevel }}
                        <div class="sub-txt" v-html="refsDetailsTxt" />
                    </div>
                    <h2
                        v-if="interaction.summary"
                        class="subheader"
                    >
                        Summary
                    </h2>
                    <p
                        class="paragraph"
                        v-if="interaction.summary"
                        v-html="formatRefs(interaction.summary)"
                        v-refs-tooltip="{
                            combinedRefs,
                            side2Refs
                        }"
                    />
                    <div
                        class="monitor"
                        v-if="interaction.monitor.labTests || interaction.monitor.otherTests || interaction.monitor.symptoms || interaction.monitor.general"
                    >
                        <h2 class="subheader">What to monitor</h2>
                        <div v-if="interaction.monitor.general">
                            <span class="font-medium">General: </span>
                            {{ interaction.monitor.general | remove-ending-dot | capitalize}}
                        </div>
                        <div v-if="interaction.monitor.labTests">
                            <span class="font-medium">Lab tests: </span>
                            {{ interaction.monitor.labTests | remove-ending-dot | capitalize}}
                        </div>
                        <div v-if="interaction.monitor.otherTests">
                            <span class="font-medium">Other tests: </span>
                            {{ interaction.monitor.otherTests | remove-ending-dot | capitalize}}
                        </div>
                        <div v-if="interaction.monitor.symptoms">
                            <span class="font-medium">Symptoms: </span>
                            {{ interaction.monitor.symptoms | remove-ending-dot | capitalize}}
                        </div>
                    </div>
                    <collapse
                        class="review-of-studies"
                        v-if="interaction.reviewOfStudies"
                        hide-de-activator
                        allow-overflow
                    >
                        <template #header>
                            <h2 class="subheader flex-align-center">
                                Review of studies
                                <span class="de-activator">
                                    <chevron-up-icon class="opened" title="" />
                                    <chevron-down-icon class="closed" title="" />
                                </span>
                            </h2>
                        </template>
                        <template #content>
                            <p
                                class="paragraph"
                                v-html="formatRefs(interaction.reviewOfStudies)"
                                v-refs-tooltip="{
                                    combinedRefs,
                                    side2Refs
                                }"
                            />
                        </template>
                    </collapse>
                    <collapse
                        class="pharmacokinetics"
                        hide-de-activator
                        allow-overflow
                    >
                        <template #header>
                            <h2 class="subheader flex-align-center">
                                Pharmacokinetics
                                <span
                                    class="badge"
                                    :class="worstPathwayEffectClassName"
                                    v-if="relevantSide1Pathways.length"
                                >
                                    {{ relevantSide1Pathways.length }}
                                </span>
                                <span class="de-activator">
                                    <chevron-up-icon class="opened" title="" />
                                    <chevron-down-icon class="closed" title="" />
                                </span>
                            </h2>
                        </template>
                        <template #content>
                            <collapse
                                hide-de-activator
                                allow-overflow
                            >
                                <template #header>
                                    <h3 class="subheader2 flex-align-center">
                                        <span class="de-activator">
                                            <chevron-up-icon class="opened" title="" />
                                            <chevron-down-icon class="closed" title="" />
                                        </span>
                                        Drug metabolism
                                    </h3>
                                </template>
                                <template #content>
                                    <side2-pathways
                                        v-if="relevantSide2Pathways.length"
                                        :side2Pathways="relevantSide2Pathways"
                                        :combinedRefs="combinedRefs"
                                        :side2Refs="side2Refs"
                                        :materialName="interactionName.split(' & ')[1]"
                                    />
                                    <p v-else class="side2-pathways">There is no data on {{side2Material.name}} metabolism</p>
                                </template>
                            </collapse>
                            <collapse
                                hide-de-activator
                                allow-overflow
                            >
                                <template #header>
                                    <h3 class="subheader2 flex-align-center">
                                        <span class="de-activator">
                                            <chevron-up-icon class="opened" title="" />
                                            <chevron-down-icon class="closed" title="" />
                                        </span>
                                        {{ interaction.side1Material.name }} effect on drug metabolism
                                    </h3>
                                </template>
                                <template #content>
                                    <side1-pathways
                                        :pathways="relevantSide1Pathways"
                                        :summary="effectOnDrugMetabolism"
                                        :materialName="interaction.side1Material.name"
                                        :unrelevantPathways="unRelevantSide2Pathways"
                                        :formatRefs="formatRefs"
                                        :combinedRefs="combinedRefs"
                                        :side2Refs="side2Refs"
                                    />
                                </template>
                            </collapse>
                        </template>
                    </collapse>
                </div>
            </main>
            <footer class="interaction-details-refs">
                <div class="main-container">
                    <h2 class="subheader">References</h2>
                    <reference-list
                        :refs="combinedRefs"
                    />
                </div>
            </footer>
        </article>
        <error-404 v-else-if="!isLoading && ((!isVirtual && !interaction) || (isVirtual && (!interaction || !side2Material)))" />
        <loader
            class="loader"
            v-else-if="isLoading"
        />
        <modal-wrap
            :isActive="isShareModalActive"
            @close-modal="isShareModalActive = false"
        >
            <share-modal @close-modal="isShareModalActive = false" />
        </modal-wrap>
    </section>
</template>

<script>
import { interactionUIService } from '@/cms/services/interaction-ui.service';
import { utilService } from '@/cms/services/util.service';

import Side2Pathways from '@/client/cmps/interaction-details/Side2Pathways';
import Side1Pathways from '@/client/cmps/interaction-details/Side1Pathways';
import ReferenceList from '@/client/cmps/interaction-details/ReferenceList';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';
import Tooltip from '@/client/cmps/common/Tooltip';
import Collapse from '@/client/cmps/common/Collapse';
import ModalWrap from '@/client/cmps/common/ModalWrap';
import Error404 from '@/client/cmps/shared/Error404';
import ShareModal from '@/client/cmps/shared/modals/ShareModal';

import Loader from '@/client/cmps/common/icons/Loader';
import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft';
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';
import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';
import PrinterIcon from 'vue-material-design-icons/Printer';
import ShareVariantIcon from 'vue-material-design-icons/ShareVariant';
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline';

export default {
  side1Refs: [],
    data() {
        return {
            interaction: null,
            side2Material: null,
            side1Pathways: [],
            interactionRefs: [],
            isLoading: false,
            effectOnDrugMetabolism: '',
            isShareModalActive: false,
        }
    },
    watch: {
        '$route.params': {
            async handler() {
                await this.getInteractionData();
                this.sortInteractionRefs();
            },
            immediate: true
        }
    },
    computed: {
        combinedRefs() {
            return this.interactionRefs.concat(this.relevantSide2Refs, this.side1PathwayRefs);
        },
        refsDetailsTxt() {
            const { getRefsCountByType, interactionRefs } = this;
            const side2Refs = this.relevantSide2Refs.concat(this.side1PathwayRefs);

            const metaCount1 = getRefsCountByType(interactionRefs, 'meta');
            const systematicCount1 = getRefsCountByType(interactionRefs, 'systematic');
            const clinicalCount1 = getRefsCountByType(interactionRefs, 'clinical');
            const caseCount1 = getRefsCountByType(interactionRefs, 'case');
            const preclinicalCount1 = getRefsCountByType(interactionRefs, 'pre-clinical');
            const articlesCount1 = getRefsCountByType(interactionRefs, 'articles');
            
            const metaCount2 = getRefsCountByType(side2Refs, 'meta');
            const systematicCount2 = getRefsCountByType(side2Refs, 'systematic');
            const clinicalCount2 = getRefsCountByType(side2Refs, 'clinical');
            const caseCount2 = getRefsCountByType(side2Refs, 'case');
            const preclinicalCount2 = getRefsCountByType(side2Refs, 'pre-clinical');
            const articlesCount2 = getRefsCountByType(side2Refs, 'articles');
            
            let txt = `<span class="font-medium">The interaction is based on:</span>`
            if (metaCount1) txt += `
                &bull; ${metaCount1} meta analysis${metaCount1 > 1 ? 'es' : ''}`;
            if (systematicCount1) txt += `
                &bull; ${systematicCount1} systematic review${systematicCount1 > 1 ? 's' : ''}`;
            if (clinicalCount1) txt += `
                &bull; ${clinicalCount1} clinical stud${clinicalCount1 > 1 ? 'ies' : 'y'}`;
            if (caseCount1) txt += `
                &bull; ${caseCount1} case stud${caseCount1 > 1 ? 'ies' : 'y'}`;
            if (preclinicalCount1) txt += `
                &bull; ${preclinicalCount1} pre-clinical stud${preclinicalCount1 > 1 ? 'ies' : 'y'}`;
            if (articlesCount1) txt += `
                &bull; ${articlesCount1} article${articlesCount1 > 1 ? 's' : ''}`;

            if (clinicalCount2 || preclinicalCount2 || articlesCount2 || caseCount2 || metaCount2 || systematicCount2) {
                txt += `
                    <span class="font-medium">The pharmacokinetic section is based on:</span>`;

                if (metaCount2) txt += `
                    &bull; ${metaCount2} meta analysis${metaCount2 > 1 ? 'es' : ''}`;
                if (systematicCount2) txt += `
                    &bull; ${systematicCount2} systematic review${systematicCount2 > 1 ? 's' : ''}`;
                if (clinicalCount2) txt += `
                    &bull; ${clinicalCount2} clinical stud${clinicalCount2 > 1 ? 'ies' : 'y'}`;
                if (caseCount2) txt += `
                    &bull; ${caseCount2} case stud${caseCount2 > 1 ? 'ies' : 'y'}`;
                if (preclinicalCount2) txt += `
                    &bull; ${preclinicalCount2} pre-clinical stud${preclinicalCount2 > 1 ? 'ies' : 'y'}`;
                if (articlesCount2) txt += `
                    &bull; ${articlesCount2} article${articlesCount2 > 1 ? 's' : ''}`;
            }
            
            return txt;
        },
        relevantSide2Refs() {
            let nextDraftIdx = 1;
            return this.relevantSide2Pathways.reduce((acc, pathway) => {
                pathway.references.forEach((pubmedId, idx) => {
                    const isValidUrl = (typeof pubmedId === 'string' && pubmedId.startsWith('http'));
                    const ref = {
                        draftIdx: nextDraftIdx++,
                        type: '',
                        txt: pathway.fullReferences[idx],
                        link: (isValidUrl) ? pubmedId : `https://pubmed.ncbi.nlm.nih.gov/${pubmedId}`,
                        pubmedId: (isValidUrl) ? 0 : pubmedId
                    };
                    const isUnique = acc.findIndex(currRef => currRef.link === ref.link) === -1;
                    if (isUnique) acc.push(ref);
                });
                return acc;
            }, []);
        },
        side2Refs() {
            return this.side2Material.pathwayRefs.filter((ref, idx, refs) => {
                return refs.findIndex(currRef => currRef.link === ref.link) === idx;
            });
        },
        isVirtual() {
            return !!this.$route.params.matId;
        },
        interactionColor() {
            return interactionUIService.getInteractionColor(this.interaction.recommendation);
        },
        interactionName() {
            if (this.isVirtual) return `${this.interaction.side1Material.name} & ${this.side2Material.name}`;
            return `${this.interaction.side1Material.name} & ${this.interaction.side2Material.name}`;
        },
        side1PathwayRefs() {
            const txt = this.effectOnDrugMetabolism + ' ' + this.relevantSide1Pathways.reduce((acc, pathway) => {
                acc += pathway.influence + ' ';
                return acc;
            }, '');
            const sortedRefs = interactionUIService.getSortedRefs(txt, this.$options.side1Refs);
            return sortedRefs.filter(ref => this.interactionRefs.findIndex(currRef => currRef.link === ref.link) === -1);
        },
        relevantSide2Pathways() {
            return this.side2Material.pathways.filter(pathway => (pathway.type === 'enzyme' && (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))) ||
            (pathway.type === 'transporter' && (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))) ||
            (pathway.type === 'carrier' && (!pathway.actions.includes('inducer') && !pathway.actions.includes('inhibitor'))));
        },
        relevantSide1Pathways() {
            return this.side1Pathways.filter(pathway => {
                const idx = this.relevantSide2Pathways.findIndex(side2Pathway => side2Pathway.name.replace('CYP', '').toUpperCase() === pathway.name.replace('CYP', '').toUpperCase());
                return idx !== -1;
            });
        },
        worstPathwayEffectClassName() {
            let red = '', yellow = '', green = '';
            this.relevantSide1Pathways.forEach(({ influence }) => {
                let firstLine = influence.split('</p>')[0];
                if (!firstLine) return;
                firstLine = firstLine.toLowerCase();

                if (firstLine.includes('may induce') || firstLine.includes('may inhibit') || firstLine.includes('may bind')) {
                    red = 'badge-red';
                } else if (firstLine.includes('is unclear')) {
                    yellow = 'badge-yellow';
                } else if (firstLine.includes('not likely to affect')) {
                    green = 'badge-green';
                }
            });
            return red || yellow || green;
        },
        unRelevantSide2Pathways() {
            return this.relevantSide2Pathways.filter(pathway => {
                const idx = this.side1Pathways.findIndex(side1Pathway => side1Pathway.name.replace('CYP', '').toUpperCase() === pathway.name.replace('CYP', '').toUpperCase());
                return idx === -1;
            });
        },
        isPrimaryMaterial() {
            const { interaction } = this;
            return interaction.side2Label && interaction.side2Label.primaryMaterialIds.includes(this.side2Material._id);
        },
        recommendationIconName() {
            switch (this.interactionColor) {
                case '#E63946':
                    return 'cancel-icon';
                case '#F6D55C':
                    return 'alert-circle-outline-icon';
                case '#56C596':
                    return 'check-icon';
                default:
                    return 'circle-outline';
            }
        },
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        }
    },
    methods: {
        printWindow(){
            window.print();
        },
        async getInteractionData() {
            this.isLoading = true;
            const { id, matId } = this.$route.params;
            if (!this.isVirtual) {
                const interaction = await this.$store.dispatch({ type: 'loadInteraction', id });
                if (!interaction) {
                    this.isLoading = false;
                    return;
                }
                const [ side2Material, { refs, pathways, effectOnDrugMetabolism } ] = await Promise.all([
                    this.$store.dispatch({ type: 'loadMaterial', matId: interaction.side2Material._id }),
                    this.$store.dispatch({ type: 'loadMaterial', matId: interaction.side1Material._id })
                ]);
                this.interaction = interaction;
                this.side2Material = side2Material;
                this.side1Pathways = pathways;
                this.$options.side1Refs = refs;
                this.effectOnDrugMetabolism = effectOnDrugMetabolism;
                this.interactionRefs = refs.filter(ref => this.interaction.refs.includes(ref.draftIdx));
            } else {
                const [ interaction, material ] = await Promise.all([
                    this.$store.dispatch({ type: 'loadInteraction', id }),
                    this.$store.dispatch({ type: 'loadMaterial', matId })
                ]);
                if (!interaction || !material) {
                    this.isLoading = false;
                    return;
                }
                const { refs, pathways, effectOnDrugMetabolism } = await this.$store.dispatch({
                    type: 'loadMaterial',
                    matId: interaction.side1Material._id
                });
                this.interaction = interaction;
                this.side2Material = material;
                this.side1Pathways = pathways;
                this.$options.side1Refs = refs;
                this.effectOnDrugMetabolism = effectOnDrugMetabolism;
                this.interactionRefs = refs.filter(ref => this.interaction.refs.includes(ref.draftIdx));
            }
            this.isLoading = false;
        },
        sortInteractionRefs() {
            if (!this.interaction) return;
            const txt = `${this.interaction.summary} ${this.interaction.reviewOfStudies}`;
            const sortedRefs = interactionUIService.getSortedRefs(
                txt,
                this.interactionRefs
            );
            this.interactionRefs = sortedRefs;
        },
        getRefsCountByType(refs, type) {
            let iterateFunc = null;
            switch (type) {
                case 'clinical':
                    iterateFunc = ref => ref.type === 'clinical' || ref.type === 'retrospective';
                break;
                case 'pre-clinical':
                    iterateFunc = ref => ref.type === 'in vitro' || ref.type === 'animal';
                break;
                case 'systematic':
                    iterateFunc = ref => ref.type === 'systematic'
                break;
                case 'meta':
                    iterateFunc = ref => ref.type === 'meta'
                break;
                case 'case':
                    iterateFunc = ref => ref.type === 'case'
                break;
                case 'articles':
                    iterateFunc = ref => ref.type === 'review' || ref.type === 'drug label' || ref.type === 'book' || ref.type === 'Book' || !ref.type  
                break;
            }

            return refs.filter(iterateFunc).length;
        },
        formatRefs(txt, isPathwaysRefs = false) {
            if (!this.interactionRefs.length) return txt;
            const refsOrder = interactionUIService.getRefsOrder(txt, false, false).filter(num => txt.indexOf(num) > -1);
            let lastRefIdx = 0;
            refsOrder.forEach((refNum) => {
                let draftIdx = this.combinedRefs.findIndex(ref => ref && ref.draftIdx === refNum) + 1;
                if (isPathwaysRefs) {
                    const sameRefs = this.combinedRefs.filter(ref => ref && ref.draftIdx === refNum);
                    if (sameRefs.length > 1) {
                        const ref = sameRefs.find(ref => this.side2Refs.findIndex(currRef => currRef.link === ref.link) === -1);
                        draftIdx = this.combinedRefs.indexOf(ref) + 1;
                    }
                }
                let refIdx = txt.indexOf(refNum, lastRefIdx + draftIdx.toString().length);
                if (!utilService.checkIfInsideRef(txt, refIdx) || lastRefIdx === refIdx) {
                    let cnt = 0;
                    while (txt.charAt(refIdx) === txt.charAt(refIdx + cnt)) {
                        cnt++;
                    }
                    refIdx = txt.indexOf(refNum, refIdx + cnt);
                }
                if (lastRefIdx + draftIdx.toString().length > refIdx) lastRefIdx = refIdx + draftIdx.toString().length;
                else lastRefIdx = refIdx;
                if (refIdx > -1) {
                    txt = txt.slice(0, lastRefIdx) +
                    txt.slice(lastRefIdx, (lastRefIdx + refNum.toString().length)).replace(refNum, draftIdx) +
                    txt.slice(lastRefIdx + refNum.toString().length);
                }
            });
            return txt;
        }
    },
    components: {
        ChevronLeftIcon,
        PrinterIcon,
        ShareVariantIcon,
        InteractionCapsules,
        InformationOutlineIcon,
        Tooltip,
        Collapse,
        ChevronDownIcon,
        ChevronUpIcon,
        Side2Pathways,
        Side1Pathways,
        ReferenceList,
        Error404,
        Loader,
        ModalWrap,
        ShareModal,
        CancelIcon: () => import('vue-material-design-icons/Cancel'),
        AlertCircleOutlineIcon: () => import('vue-material-design-icons/AlertCircleOutline'),
        CheckIcon: () => import('vue-material-design-icons/Check'),
        CircleOutlineIcon: () => import('vue-material-design-icons/CircleOutline')
    }
}
</script>
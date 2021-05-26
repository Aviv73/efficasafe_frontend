<template>
    <section class="interaction-details">
        <header class="interaction-details-header">
            <div class="main-container">
                <div class="flex-space-between">
                    <span class="interaction-details-header-link">
                        <button class="flex-align-center" @click="$router.go(-1)">
                            <chevron-left-icon />
                            Back to search
                        </button>
                    </span>
                    <span class="interaction-details-header-actions">
                        <button
                            class="print-btn"
                            title="Print"
                        >
                            <printer-icon />
                        </button>
                        <button
                            class="share-btn"
                            title="Share"
                        >
                            <share-icon />
                        </button>
                    </span>
                </div>
            </div>
        </header>
        <article class="interaction-details-content" v-if="interaction">
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
                            {{ interaction.recommendation }}
                        </span>
                        <span class="evidence-level">
                            {{ interaction.evidenceLevel }}
                            <tooltip on="hover" right-top>
                                <template #content>
                                    <div class="evidence-level-tooltip-content">
                                        Based On {{ clinicalRefCount }} Clinical Trial{{ clinicalRefCount > 1 ? 's' : '' }},
                                        {{ preClinicalRefCount }} Pre-clinical {{ preClinicalRefCount > 1 ? 'Studies' : 'Study' }} And {{ articlesRefCount }} Article{{ articlesRefCount > 1 ? 's' : '' }}
                                    </div>
                                </template>
                                <span class="refs">
                                    <span class="refs-count">({{ combinedRefs.length }})</span> 
                                    <information-outline-icon :size="12" />
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
                        <!-- <recommendation-icon /> -->
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
                        <span class="evidence-level">
                            {{ interaction.evidenceLevel }}
                            <tooltip on="focus" right-top>
                                <template #content>
                                    <div class="evidence-level-tooltip-content">
                                        Based On {{ clinicalRefCount }} Clinical Trial{{ clinicalRefCount > 1 ? 's' : '' }},
                                        {{ preClinicalRefCount }} Pre-clinical {{ preClinicalRefCount > 1 ? 'Studies' : 'Study' }} And {{ articlesRefCount }} Article{{ articlesRefCount > 1 ? 's' : '' }}
                                    </div>
                                </template>
                                <span class="refs">
                                    <span class="refs-count">({{ combinedRefs.length }})</span> 
                                    <information-outline-icon :size="12" />
                                </span>
                            </tooltip>
                        </span>
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
                            {{ interaction.monitor.general | remove-ending-dot }}
                        </div>
                        <div v-if="interaction.monitor.labTests">
                            <span class="font-medium">Lab tests: </span>
                            {{ interaction.monitor.labTests | remove-ending-dot }}
                        </div>
                        <div v-if="interaction.monitor.otherTests">
                            <span class="font-medium">Other tests: </span>
                            {{ interaction.monitor.otherTests | remove-ending-dot }}
                        </div>
                        <div v-if="interaction.monitor.symptoms">
                            <span class="font-medium">Symptoms: </span>
                            {{ interaction.monitor.symptoms | remove-ending-dot }}
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
                                    <chevron-up-icon class="opened" />
                                    <chevron-down-icon class="closed" />
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
                                    <chevron-up-icon class="opened" />
                                    <chevron-down-icon class="closed" />
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
                                            <chevron-up-icon class="opened" />
                                            <chevron-down-icon class="closed" />
                                        </span>
                                        Drug metabolism
                                    </h3>
                                </template>
                                <template #content>
                                    <side2-pathways
                                        :side2Pathways="relevantSide2Pathways"
                                        :combinedRefs="combinedRefs"
                                        :side2Refs="side2Refs"
                                        :materialName="interactionName.split(' & ')[1]"
                                    />
                                </template>
                            </collapse>
                            <collapse
                                hide-de-activator
                                allow-overflow
                            >
                                <template #header>
                                    <h3 class="subheader2 flex-align-center">
                                        <span class="de-activator">
                                            <chevron-up-icon class="opened" />
                                            <chevron-down-icon class="closed" />
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

import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft';
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';
import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';
import PrinterIcon from 'vue-material-design-icons/Printer';
import ShareIcon from 'vue-material-design-icons/Share';
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
            effectOnDrugMetabolism: ''
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
            let nextDraftIdx = 1;
            const side2Refs = this.relevantSide2Pathways.reduce((acc, pathway) => {
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
            
            return this.interactionRefs.concat(side2Refs, this.side1PathwayRefs);
        },
        clinicalRefCount() {
            return this.combinedRefs.filter(ref => ref.type === 'clinical' || ref.type === 'retrospective').length;
        },
        preClinicalRefCount() {
            return this.combinedRefs.filter(ref => ref.type === 'in vitro' || ref.type === 'animal').length;
        },
        articlesRefCount() {
            return this.combinedRefs.length - this.clinicalRefCount - this.preClinicalRefCount;
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
        // recommendationIconName() {
        //     //// reds - Cancel | yellows - AlertCircleOutline | greens - Check
        //     //// get recommendation color and return right icon name
        //     return 'Cancel'
        // }
    },
    methods: {
        async getInteractionData() {
            this.isLoading = true;
            const { id, matId } = this.$route.params;
            if (!this.isVirtual) {
                const interaction = await this.$store.dispatch({ type: 'loadInteraction', id });
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
            const txt = `${this.interaction.summary} ${this.interaction.reviewOfStudies}`;
            const sortedRefs = interactionUIService.getSortedRefs(
                txt,
                this.interactionRefs
            );
            this.interactionRefs = sortedRefs;
        },
        formatRefs(txt, isPathwaysRefs = false) {
            if (!this.interactionRefs.length) return;
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
        ShareIcon,
        InteractionCapsules,
        InformationOutlineIcon,
        Tooltip,
        Collapse,
        ChevronDownIcon,
        ChevronUpIcon,
        Side2Pathways,
        Side1Pathways,
        ReferenceList,
        // RecommendationIcon: () => import(`vue-material-design-icons/${recommendationIconName}`)
    }
}
</script>
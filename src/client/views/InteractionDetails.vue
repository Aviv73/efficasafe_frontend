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
            <header>
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
                            :style="{ 'background-color': interactionColor }"
                        >
                            {{ interaction.recommendation }}
                        </span>
                        <span class="evidence-level">
                            {{ interaction.evidenceLevel }}
                            <tooltip on="hover" right-top>
                                <template #content>
                                    <div class="evidence-level-tooltip-content">
                                        Based On {{ clinicalRefCount }} Clinical Trials,
                                        {{ preClinicalRefCount }} Pre-clinical Trials And {{ articlesRefCount }} Articles
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
                <div class="main-container">
                    <div class="note flex-center" v-if="!isPrimaryMaterial && interaction.note">
                        <span><span class="font-bold">Note:</span> {{ interaction.note }}</span>
                    </div>
                    <h2 class="subheader">Summary</h2>
                    <p
                        class="paragraph"
                        v-html="interaction.summary"
                    />
                    <div v-if="interaction.monitor.labTests || interaction.monitor.otherTests || interaction.monitor.symptoms || interaction.monitor.general">
                        <h2 class="subheader">What to monitor</h2>
                        <!-- CONTINUE HERE LAB TEST, OTHER TESTS.. -->
                    </div>
                </div>
            </main>
            <div class="interaction-details-refs">
                <div class="main-container">
                    
                </div>
            </div>
        </article>
    </section>
</template>

<script>
import { interactionService } from '@/cms/services/interaction.service';

import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';
import Tooltip from '@/client/cmps/common/Tooltip';

import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft';
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
            isLoading: false
        }
    },
    watch: {
        '$route.params': {
            handler() {
                this.getInteractionData();
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
            return this.interactionRefs.concat(side2Refs, this.side2PathwayRefs);
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
        isVirtual() {
            return !!this.$route.params.matId;
        },
        interactionColor() {
            return interactionService.getInteractionColor(this.interaction.recommendation);
        },
        interactionName() {
            if (this.isVirtual) return `${this.interaction.side1Material.name} & ${this.side2Material.name}`;
            return `${this.interaction.side1Material.name} & ${this.interaction.side2Material.name}`;
        },
        side2PathwayRefs() {
            const txt = this.relevantSide1Pathways.reduce((acc, pathway) => {
                acc += pathway.influence + ' ';
                return acc;
            }, '');
            const sortedRefs = interactionService.getSortedRefs(txt, this.$options.side1Refs);
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
        isPrimaryMaterial() {
            const { interaction } = this;
            return interaction.side2Label && interaction.side2Label.primaryMaterialIds.includes(this.side2Material._id);
        }
    },
    methods: {
        async getInteractionData() {
            this.isLoading = true;
            const { id, matId } = this.$route.params;
            if (!this.isVirtual) {
                const interaction = await this.$store.dispatch({ type: 'loadInteraction', id });
                const [ side2Material, { refs, pathways } ] = await Promise.all([
                    this.$store.dispatch({ type: 'loadMaterial', matId: interaction.side2Material._id}),
                    this.$store.dispatch({ type: 'loadMaterial', matId: interaction.side1Material._id})
                ]);
                this.interaction = interaction;
                this.side2Material = side2Material;
                this.side1Pathways = pathways;
                this.$options.side1Refs = refs;
                this.interactionRefs = refs.filter(ref => this.interaction.refs.includes(ref.draftIdx));
            } else {
                const [ interaction, material ] = await Promise.all([
                    this.$store.dispatch({ type: 'loadInteraction', id }),
                    this.$store.dispatch({ type: 'loadMaterial', matId })
                ]);
                const { refs, pathways } = await this.$store.dispatch({
                    type: 'loadMaterial',
                    matId: interaction.side1Material._id
                });
                this.interaction = interaction;
                this.side2Material = material;
                this.side1Pathways = pathways;
                this.$options.side1Refs = refs;
                this.interactionRefs = refs.filter(ref => this.interaction.refs.includes(ref.draftIdx));
            }
            this.isLoading = false;
        }
    },
    components: {
        ChevronLeftIcon,
        PrinterIcon,
        ShareIcon,
        InteractionCapsules,
        InformationOutlineIcon,
        Tooltip
    }
}
</script>
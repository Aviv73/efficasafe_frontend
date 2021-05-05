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
                            :style="{ 'background-color': interactionColor }"
                        >
                            {{ interaction.recommendation }}
                        </span>
                        <span class="evidence-level">
                            {{ interaction.evidence_level }}
                            <tooltip on="hover" right-top>
                                <template #content>
                                    <div class="evidence-level-tooltip-content">
                                        <p
                                            class="d-flex"
                                            v-if="interaction.evidence_level === 1"
                                        >
                                            <span>1.</span>
                                            information formally provided in official prescribing information
                                        </p>
                                        <p
                                            class="d-flex"
                                            v-else-if="interaction.evidence_level === 2"
                                        >
                                            <span>2.</span>
                                            based on scientific and clinical knowledge referenced from a variety of evidence sources
                                        </p>
                                    </div>
                                </template>
                                <span class="refs">
                                    <span class="refs-count">({{ interactionRefs.length }})</span> 
                                    <information-outline-icon :size="12" />
                                </span>
                            </tooltip>
                        </span>
                    </div>
                </div>
            </header>
            <main class="interaction-details-details">
                <div class="main-container p-relative mobile-coloumn">
                    <figure class="drugbank-logo">
                        <img :src="require(`@/cms/assets/drugbank.png`)" alt="DrugBank logo" />
                        <figcaption class="caption">powered by</figcaption>
                    </figure>
                    <h2
                        v-if="interaction.summary"
                        class="subheader"
                    >
                        Summary
                    </h2>
                    <p
                        class="paragraph"
                        v-if="interaction.summary"
                        v-text="interaction.summary"
                    />
                    <h2
                        v-if="interaction.severity"
                        class="subheader"
                    >
                        Severity
                    </h2>
                    <p
                        class="paragraph"
                        v-if="interaction.severity"
                        v-text="interaction.severity"
                    />
                    <h2
                        v-if="interaction.extended_description"
                        class="subheader"
                    >
                        Extended description
                    </h2>
                    <p
                        class="paragraph"
                        v-if="interaction.extended_description"
                        v-html="getRefsToDisplay(interaction.extended_description)"
                        v-refs-tooltip.dBank="{
                            interactionRefs
                        }"
                    />
                    <h2
                        v-if="interaction.management"
                        class="subheader"
                    >
                        Management
                    </h2>
                    <p
                        class="paragraph"
                        v-if="interaction.management"
                        v-html="getRefsToDisplay(interaction.management)"
                        v-refs-tooltip.dBank="{
                            interactionRefs
                        }"
                    />
                </div>
            </main>
            <footer class="interaction-details-refs">
                <div class="main-container">
                    <h2 class="subheader">References</h2>
                    <reference-list
                        :refs="interactionRefs"
                        d-bank-refs
                    />
                </div>
            </footer>
        </article>
    </section>
</template>

<script>
import { drugBankService } from '@/cms/services/drug-bank.service';
import { interactionUIService } from '@/cms/services/interaction-ui.service';

import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';
import Tooltip from '@/client/cmps/common/Tooltip';
import ReferenceList from '@/client/cmps/interaction-details/ReferenceList';

import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft';
import PrinterIcon from 'vue-material-design-icons/Printer';
import ShareIcon from 'vue-material-design-icons/Share';
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline';

export default {
    wrongRefsMap: drugBankService.getWrongRefsMap(),
    data() {
        return {
            interaction: null,
            isLoading: false
        }
    },
    watch: {
        '$route.params': {
            handler() {
                this.getInteraction();
            },
            immediate: true
        }
    },
    computed: {
        interactionName() {
            return `${this.interaction.subject_drug.name} & ${this.interaction.affected_drug.name}`;
        },
        interactionColor() {
            return interactionUIService.getInteractionColor(this.interaction.recommendation);
        },
        interactionRefs() {
            let refIdx = 1;
            return Object.keys(this.interaction.references).reduce((acc, key) => {
                const moreRefs = this.interaction.references[key].map(
                    ({ ref_id, pubmed_id, citation, title, url }) => {
                    return {
                        ref_id,
                        pubmed_id: pubmed_id || '',
                        citation: citation || '',
                        title: title || '',
                        url: url || '',
                        draftIdx: refIdx++
                    }
                });
                acc = acc.concat(moreRefs);
                return acc;
            }, []);
        }
    },
    methods: {
        async getInteraction() {
            this.isLoading = true;
            const { id } = this.$route.params;
            this.interaction = await drugBankService.getInteraction(id);
            this.isLoading = false;
        },
        getRefsToDisplay(txt) {
            const regex = /\[(.*?)\]/g;
            const matches = txt.match(regex);
            if (!matches) return txt;
            matches.forEach(match => {
                let formatedMatch = this.replaceWrongRefs(match);
                this.interactionRefs.forEach(({ ref_id, draftIdx }) => {
                    if (formatedMatch.includes(ref_id)) {
                        formatedMatch = formatedMatch.replace(ref_id, draftIdx);
                    } else {
                        const refId = ref_id.replace(/\D/g,'');
                        formatedMatch = formatedMatch.replace(refId, draftIdx);
                    }
                });
                formatedMatch = formatedMatch.replace('[', '(');
                formatedMatch = formatedMatch.replace(']', ')');
                formatedMatch = `<sub>${interactionUIService.formatRefStrs(formatedMatch)}</sub>`;
                
                const beforeIdx = txt.indexOf(match) - 1;
                if (txt.charAt(beforeIdx) === '.') {
                    txt = txt.substring(0, beforeIdx) + txt.substring(beforeIdx + 1);
                    formatedMatch = ` ${formatedMatch}.`;
                }
                
                txt = txt.replace(match, formatedMatch);
            });
            return txt;
        },
        replaceWrongRefs(refStr) {
            const { wrongRefsMap } = this.$options;
            Object.keys(wrongRefsMap).forEach(wrongRef => {
                if (refStr.includes(wrongRef)) {
                    refStr = refStr.replaceAll(wrongRef, wrongRefsMap[wrongRef]);
                }
            });
            return refStr;
        }
    },
    components: {
        ChevronLeftIcon,
        PrinterIcon,
        ShareIcon,
        InteractionCapsules,
        InformationOutlineIcon,
        Tooltip,
        ReferenceList
    }
}
</script>
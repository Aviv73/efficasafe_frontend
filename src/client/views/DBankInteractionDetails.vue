<template>
    <section class="interaction-details" :class="{'not-allowed-select-txt': isNotAllowedSelect}">
        <header class="interaction-details-header">
            <h1 class="invisible-header" v-if="interaction">Interaction between {{interaction.subject_drug.name}} and {{interaction.affected_drug.name}}</h1>
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
                            <share-variant-icon title="" />
                        </button>
                    </span>
                </div>
                <span />
            </div>
        </header>
        <article class="interaction-details-content" v-if="!isLoading && interaction">
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
                            :isLink="true"
                            :isInteractionDetails="true"
                            @go-to-material="goToMaterial"
                            @openModal="(ev) => this.pageLoc = ev"
                            on-details-page
                        />
                        <template v-if="pageLoc">
                        <div v-if="!isScreenNarrow" class="capsule-title" :style="{'top':(pageLoc.offset+5)+'px','left':(pageLoc.pageX-20)+'px'}">Press for more info
                        <div class="arrow-down"></div>
                        </div>
                        </template>

                        <span
                            class="recommendation-capsule"
                            :class="{ 'txt-dark': interactionColor === '#F6D55C' }"
                            :style="{ 'background-color': interactionColor }"
                            :title="interaction.recommendation"
                        >
                            <component :is="recommendationIconName" :size="14" />
                            <span class="clip-txt">{{ interaction.recommendation }}</span>
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
                                            1- Information formally provided in official prescribing documentation 
                                        </p>
                                        <p
                                            class="d-flex"
                                            v-else-if="interaction.evidence_level === 2"
                                        >
                                            2- Based on scientific research
                                        </p>
                                    </div>
                                </template>
                                <span class="refs">
                                    <span class="refs-count">({{ interactionRefs.length }})</span> 
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
                        class="recommendation-capsule mobile drugbank"
                        :class="{ 'txt-dark': interactionColor === '#F6D55C' }"
                        :style="{ 'background-color': interactionColor }"
                    >
                        <component :is="recommendationIconName" :size="14" />
                        {{ interaction.recommendation }}
                    </span>
                    <figure class="drugbank-logo">
                        <img :src="require(`@/cms/assets/drugbank.png`)" alt="DrugBank logo" />
                        <figcaption class="caption">powered by</figcaption>
                    </figure>
                    <warnings v-if="side1Material && side2Material" :side1Material="side1Material" :side2Material="side2Material" :isDb="true"/>
                    <div class="evidence-level-mobile">
                        <span class="font-bold">Level of evidence:</span> {{ interaction.evidence_level }} - {{levelOfEvidenceTxt}}
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
        <error-404 v-else-if="!isLoading && !interaction" />
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
import { drugBankService } from '@/cms/services/drug-bank.service';
import { materialService } from '@/cms/services/material.service';
import { interactionUIService } from '@/cms/services/interaction-ui.service';

import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';
import Tooltip from '@/client/cmps/common/Tooltip';
import Warnings from '@/client/cmps/interaction-details/Warnings';
import ReferenceList from '@/client/cmps/interaction-details/ReferenceList';
import Error404 from '@/client/cmps/shared/Error404';
import ModalWrap from '@/client/cmps/common/ModalWrap';
import ShareModal from '@/client/cmps/shared/modals/ShareModal';

import Loader from '@/client/cmps/common/icons/Loader';
import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft';
import PrinterIcon from 'vue-material-design-icons/Printer';
import ShareVariantIcon from 'vue-material-design-icons/ShareVariant';
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline';

export default {
    wrongRefsMap: drugBankService.getWrongRefsMap(),
    data() {
        return {
            pageLoc:null,
            interaction: null,
            isLoading: false,
            isShareModalActive: false,
            linkInfos: false,
            side1Material: false,
            side2Material: false
        }
    },
    metaInfo () {
        return {
        title: this.pageTitle
        }
    },
    watch: {
        '$route.params': {
            async handler() {
                this.isLoading = true;
                await this.getInteraction();
                await this.getLinks();
                this.isLoading = false;
            },
            immediate: true
        }
    },
    computed: {
        pageTitle(){
            if(this.interaction){
                return `Interaction of ${this.interaction.subject_drug.name} & ${this.interaction.affected_drug.name}`
            }

            return ''
        },
        interactionName() {
            return `${this.interaction.subject_drug.name} & ${this.interaction.affected_drug.name}`;
        },
        interactionColor() {
            return interactionUIService.getInteractionColor(this.interaction.recommendation);
        },
        searchedMaterials(){
            return this.$store.getters.materials
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
        isNotAllowedSelect() {
            if(!this.$store.getters.loggedInUser) return true
            return !this.$store.getters.loggedInUser.isAllowedToSelectTxt;
        },
        levelOfEvidenceTxt(){
            if(this.interaction.evidence_level === 1) return 'Information formally provided in official prescribing documentation'
            return 'Based on scientific research'
        },
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        }
    },
    methods: {
        goToMaterial(name){
            const linkInfo = this.linkInfos.find( i => i.name === name)
            let routeData = this.$router.resolve({path: `/material/${linkInfo.id}`});
            window.open(routeData.href, '_blank');
        },
        printWindow(){
            window.print();
        },
        async getInteraction() {
            const { id } = this.$route.params;
            this.interaction = await drugBankService.getInteraction(id);
            const [ side1Material, side2Material ] = await Promise.all([
                    materialService.getByDBId(this.interaction.affected_drug.drugbank_id),
                    materialService.getByDBId(this.interaction.subject_drug.drugbank_id)
                ]);
            this.side1Material = side1Material
            this.side2Material = side2Material
        },
        async getLinks(){
            const criteria = {
                isSearchResults: true,
                q: [this.interaction.affected_drug.name, this.interaction.subject_drug.name],
            };
            const materials = await this.$store.dispatch({ type: 'getMaterials', criteria });
            this.linkInfos = materials.map( m => {
                if(this.searchedMaterials){
                    const originalMaterial = this.searchedMaterials.find( mat => mat.name === m.userQuery)
                    if(originalMaterial) return { name: originalMaterial.userQuery, id: originalMaterial._id}
                }
                return { name: m.userQuery, id: m._id}
            })
        },
        getRefsToDisplay(txt) {
            // const regex = /\[[a-zA-Z][0-9]*]/g; // for matching [A12345]
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
        ShareVariantIcon,
        InteractionCapsules,
        InformationOutlineIcon,
        Tooltip,
        Warnings,
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
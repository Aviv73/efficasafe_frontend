<template>
    <section class="v-interaction-details">
        <div class="container">
            <div class="mb-5">
                <v-btn color="primary" :to="`/interaction/${$route.params.id}`">
                    <v-icon small left>mdi-arrow-left</v-icon>Back to
                    Interaction
                </v-btn>
            </div>
            <v-card
                v-if="interaction && material"
                class="v-interaction-details-content px-2"
            >
                <v-card-title class="v-interaction-details-title px-0 justify-center my-4">
                    <h2>
                        {{ interaction.side1Material.name }}
                        <span>&amp;</span>
                        {{ material.name }}
                    </h2>
                </v-card-title>

                <div class="text-capitalize">Recommendation:</div>
                <div v-recommendation-color>{{ interaction.recommendation }}</div>

                <div class="text-capitalize">Level of evidence:</div>
                <div>{{ interaction.evidenceLevel }}</div>

                <div class="text-capitalize" v-if="!isPrimaryMaterial && interaction.note">Note:</div>
                <div v-if="!isPrimaryMaterial && interaction.note">{{ interaction.note }}</div>

                <div class="text-capitalize">Summary:</div>
                <div v-html="txtWithRefs(interaction.summary)" ref="summary"></div>

                <div class="text-capitalize">What to monitor:</div>
                <div> 
                    <span class="text-capitalize">Lab tests: </span>
                    <span>{{ interaction.monitor.labTests }}</span>

                    <span class="text-capitalize" v-if="interaction.monitor.otherTests">Other tests: </span>
                    <span v-if="interaction.monitor.otherTests">{{ interaction.monitor.otherTests }}</span>

                    <span class="text-capitalize" v-if="interaction.monitor.symptons">Symptons: </span>
                    <span v-if="interaction.monitor.symptons">{{ interaction.monitor.symptons }}</span>
                </div>

                <div class="text-capitalize">Review of studies:</div>
                <div
                    v-html="txtWithRefs(interaction.reviewOfStudies)"
                    ref="reviewOfStudies"
                ></div>

                <div class="text-capitalize" v-if="material.pathways.length">Pathways:</div>
                <div v-if="material.pathways.length">
                    <p ref="pathway">
                        <span class="font-weight-medium">
                            {{ material.name }}
                        </span>
                        is metabolized by the enzymes:
                        <span v-for="(pathway, idx) in material.pathways" :key="idx">
                            <span>{{ idx === 0 ? '' : ',' }} </span>
                            <span class="text-uppercase">{{ pathway.enzyme }} </span>
                            <sub>{{ getMaterialRefNums(pathway.references) }}</sub>
                        </span>
                    </p>
                    <div ref="pathway2">
                        <p v-if="relevantSide1Pathways.length">
                            <span class="font-weight-medium">{{ interaction.side1Material.name }}</span>
                            effect on the enzymes:
                            <span v-for="(pathway, idx) in relevantSide1Pathways" :key="idx">
                                <span>{{ idx === 0 ? '' : ',' }} </span>
                                <span class="text-uppercase">{{ pathway.enzyme }}</span>
                            </span>
                        </p>
                        <div v-for="(pathway, idx) in relevantSide1Pathways" :key="'pathway' + idx">
                            <h6>{{ pathway.enzyme }}</h6>
                            <p v-highlight-text:[material.name] v-html="txtWithRefs(pathway.influence, true)"></p>
                        </div>
                        <div>
                            <p>
                                There is no evidence regarding the effect of {{ interaction.side1Material.name }} on
                                <span v-for="(pathway, idx) in unRelevantSide1Pathways" :key="'unrelevantPathway' + idx">{{ (idx === 0) ? '' : ', ' }}{{ pathway.enzyme.toUpperCase() }}</span> activity.
                            </p>
                        </div>
                    </div>
                </div>
               
                <reference-table
                    class="refs-table"
                    :isInteraction="true"
                    :references="combinedRefs"
                    v-if="combinedRefs.length"
                />

                <div class="text-capitalize">Side 1 material:</div>
                <div>
                    <router-link
                        :to="`/material/${interaction.side1Material._id}`"
                    >
                        {{ interaction.side1Material.name }}
                    </router-link>
                </div>

                <div class="text-capitalize">Side 2 material:</div>
                <div>
                    <router-link :to="`/material/${material._id}`">
                        {{ material.name }}
                    </router-link>
                </div>

            </v-card>
            <icons-map />
        </div>
    </section>
</template>

<script>
import { interactionService } from '@/services/interaction.service';
import referenceTable from '@/cmps/common/ReferenceTable';
import iconsMap from '@/cmps/general/IconsMap';

export default {
    side1Refs: [],
    data() {
        return {
            interaction: null,
            material: null,
            interactionRefs: [],
            materialRefs: [],
            side1Pathways: []
        };
    },
    computed: {
        combinedRefs() {
            return this.interactionRefs.concat(this.materialRefs, this.pathwayRefs);
        },
        pathwayRefs() {
            const txt = this.relevantSide1Pathways.reduce((acc, pathway) => {
                acc += pathway.influence + ' ';
                return acc;
            }, '');
            return interactionService.getSortedRefs(txt, this.$options.side1Refs);
        },
        relevantSide1Pathways() {
            return this.side1Pathways.filter(pathway => {
                const idx = this.material.pathways.findIndex(matPathway => matPathway.enzyme.toUpperCase() === pathway.enzyme.replace('CYP', '').toUpperCase());
                return idx !== -1;
            });
        },
        unRelevantSide1Pathways() {
            return this.material.pathways.filter(pathway => {
                const idx = this.side1Pathways.findIndex(matPathway => matPathway.enzyme.replace('CYP', '').toUpperCase() === pathway.enzyme.toUpperCase());
                return idx === -1;
            });
        },
        isPrimaryMaterial() {
            if (!this.interaction || !this.material) return false;
            return this.interaction.side2Label.primaryMaterialIds.includes(this.material._id);
        }
    },
    methods: {
        async getVinteractionSides() {
            const { id, matId } = this.$route.params;
            const [interaction, material] = await Promise.all([
                this.$store.dispatch({ type: 'loadInteraction', intId: id }),
                this.$store.dispatch({ type: 'loadMaterial', matId }),
            ]);
            this.interaction = interaction;
            this.material = material;
            if (this.material) {
                for (let i = 0; i < material.refs.length; i++) {
                    const ref = material.refs[i];
                    const idx = this.materialRefs.findIndex(matRef => matRef.pubmedId === ref.pubmedId);
                    if (idx === -1) {
                        this.materialRefs.push(ref);
                    }
                }
            }
            if (this.interaction) {
                await this.getReferences();
                this.setRefsToolTip();
            }
        },
        getMaterialRefNums(pubmedIds) {
            if (!this.interactionRefs.length || !this.materialRefs.length || !pubmedIds.length) return;
            const refIdx  = this.combinedRefs.findIndex(ref => pubmedIds.includes(ref.pubmedId));
            if (pubmedIds.length === 1) {
                return `(${refIdx + 1})`;
            }
            let refsStr = '';
            for (let i = 0; i < pubmedIds.length; i++) {
                const idx = this.combinedRefs.findIndex(ref => pubmedIds[i] === ref.pubmedId);
                refsStr += (idx + 1) + ', ';
            }
            return `(${refsStr.split(', ').filter(ref => ref).sort((a, b) => a - b).join(', ')})`;
        },
        async getReferences() {
            const matId = this.interaction.side1Material._id;
            const material = await this.$store.dispatch({
                type: 'loadMaterial',
                matId,
            });
            this.$options.side1Refs = material.refs;
            this.interactionRefs = material.refs.filter((ref) =>
                this.interaction.refs.includes(ref.draftIdx)
            );
            this.side1Pathways = material.pathways;
            this.sortRefs();
        },
        sortRefs() {
            const txt = `${this.interaction.summary} ${this.interaction.reviewOfStudies}`;
            const sortedRefs = interactionService.getSortedRefs(
                txt,
                this.interactionRefs
            );
            this.interactionRefs = sortedRefs;
        },
        txtWithRefs(txt, isDBKRefs = false) {
            if (!this.interactionRefs.length) return;
            const refsOrder = interactionService.getRefsOrder(txt, false);
            let lastRefIdx = 0;
            refsOrder.forEach((refNum) => {
                let draftIdx = this.combinedRefs.findIndex(ref => ref && ref.draftIdx === refNum) + 1;
                if (isDBKRefs) {
                    const sameRefs = this.combinedRefs.filter(ref => ref && ref.draftIdx === refNum);
                    const ref = sameRefs[sameRefs.length - 1];
                    draftIdx = this.combinedRefs.indexOf(ref) + 1;
                }

                const refIdx = txt.indexOf(refNum, lastRefIdx);
                if (refIdx > -1) {
                    lastRefIdx = refIdx;
                }
                txt = txt.slice(0, refIdx) + txt.slice(refIdx).replace(refNum, draftIdx);
            });
            return txt;
        },
        setRefsToolTip() {
            const { summary, reviewOfStudies, pathway, pathway2 } = this.$refs;
            const summarySubs = summary.querySelectorAll('sub');
            const reviewSubs = reviewOfStudies.querySelectorAll('sub');
            const pathwaySubs = (pathway) ? pathway.querySelectorAll('sub') : [];
            const pathway2Subs = (pathway2) ? pathway2.querySelectorAll('sub') : [];
            const elSubs = [ ...summarySubs, ...reviewSubs, ...pathwaySubs, ...pathway2Subs ];

            for (let i = 0; i < elSubs.length; i++) {
                const refIdxs = interactionService.getRefsOrder(elSubs[i].innerText);
                if (!refIdxs.length) continue;

                elSubs[i].innerText = interactionService.formatRefStrs(elSubs[i].innerText);
                elSubs[i].addEventListener('mouseenter', this.setTooltipPos);
                
                const refs = this.getRefsFromIdxs(refIdxs);
                const elTooltip = document.createElement('aside');
                elTooltip.classList.add('refs-tooltip');
                
                let htmlStr = '<ul>';
                for (let j = 0; j < refs.length; j++) {
                    let draftIdx = this.combinedRefs.findIndex(ref => ref && ref.draftIdx === refs[j].draftIdx) + 1;
                    if (i >= elSubs.length - pathway2Subs.length) {
                        const sameRefs = this.combinedRefs.filter(ref => ref && ref.draftIdx === refs[j].draftIdx);
                        const ref = sameRefs[sameRefs.length - 1];
                        draftIdx = this.combinedRefs.indexOf(ref) + 1;
                    }
                    if (i >= (summarySubs.length + reviewSubs.length) && i < (summarySubs.length + reviewSubs.length + pathwaySubs.length)) {
                        draftIdx = this.materialRefs.findIndex(ref => ref && ref.draftIdx === refs[j].draftIdx) + 1 + this.interactionRefs.length;
                    } 
                    
                    htmlStr += `<li class="tooltip-item">
                                    <p><span>${draftIdx}</span>. ${this.formatedRefTxt(refs[j].txt)}</p>
                                    <a href="${refs[j].link}" class="ref-link" target="_blank">${refs[j].link}</a>
                                </li>`;
                }
                htmlStr += '</ul>';
                elTooltip.innerHTML = htmlStr;
                elSubs[i].appendChild(elTooltip);
            }
        },
        setTooltipPos(ev) {
            const elTooltip = ev.target.querySelector('.refs-tooltip');
            if (ev.clientX + elTooltip.offsetWidth > window.innerWidth) {
                elTooltip.style.transformOrigin = 'top right';
                elTooltip.style.left = `unset`;
                elTooltip.style.right = `0`;
            }
        },
        getRefsFromIdxs(refIdxs) {
            const refs = [];
            refIdxs.forEach((idx) => {
                refs.push({ ...this.combinedRefs[idx - 1] });
            });
            return refs;
        },
        formatedRefTxt(fullRefTxt) {
            if (!fullRefTxt) return '';
            const doiIdx = fullRefTxt.indexOf('doi');
            if (doiIdx !== -1) {
                return fullRefTxt.substring(0, doiIdx).trim();
            }
            const PmidIdx = fullRefTxt.indexOf('PMID');
            if (PmidIdx !== -1) {
                return fullRefTxt.substring(0, PmidIdx).trim();
            }
            return fullRefTxt;
        }
    },
    created() {
        this.getVinteractionSides();
    },
    components: {
        referenceTable,
        iconsMap,
    },
};
</script>
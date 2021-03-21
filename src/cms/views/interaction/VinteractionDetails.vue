<template>
    <section class="v-interaction-details">
        <div class="container">
            <div class="mb-5">
                <v-btn color="primary" @click="$router.go(-1)">
                    <v-icon small left>mdi-arrow-left</v-icon>Back
                </v-btn>
            </div>
            <main v-if="!isLoading && interaction && material">
                <v-card class="v-interaction-details-content px-2">
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

                    <div
                        class="text-capitalize"
                        v-if="interaction.monitor.labTests || interaction.monitor.otherTests || interaction.monitor.symptons"
                    >
                        What to monitor:
                    </div>
                    <div v-if="interaction.monitor.labTests || interaction.monitor.otherTests || interaction.monitor.symptons"> 
                        <div v-if="interaction.monitor.labTests" class="mb-2">
                            <span 
                                class="text-capitalize"
                                v-if="interaction.monitor.labTests"    
                            >
                                Lab tests: 
                            </span>
                            <span v-if="interaction.monitor.labTests">{{ interaction.monitor.labTests }}</span>
                        </div>

                        <div v-if="interaction.monitor.otherTests" class="mb-2">
                            <span class="text-capitalize"> Other tests: </span>
                            <span>{{ interaction.monitor.otherTests }}</span>
                        </div>

                        <div v-if="interaction.monitor.symptons" class="mb-2">
                            <span class="text-capitalize"> Symptons: </span>
                            <span>{{ interaction.monitor.symptons }}</span>
                        </div>
                    </div>

                    <div class="text-capitalize">Review of studies:</div>
                    <div
                        v-html="txtWithRefs(interaction.reviewOfStudies)"
                        ref="reviewOfStudies"
                    ></div>

                    <div class="text-capitalize" v-if="material.pathways.length">Pathways:</div>
                    <interaction-pathways
                        ref="pathwaySection"
                        v-if="material.pathways.length"
                        :side1Name="interaction.side1Material.name"
                        :side2Name="material.name"
                        :side1Pathways="side1Pathways"
                        :side2Pathways="material.pathways"
                        :side1RefsLength="interactionRefs.length"
                        :side2RefsLength="side2Refs.length"
                        :combinedRefs="combinedRefs"
                        :relevantSide1Pathways="relevantSide1Pathways"
                        :txtWithRefs="txtWithRefs"
                    />
                
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
            </main>
            <entity-not-found 
                entity="interaction or side 2 material"
                v-if="!isLoading && (!interaction || !material)"
            />
            <loader class="v-interaction-details-loader" v-if="isLoading" />
        </div>
    </section>
</template>

<script>
import { interactionService } from '@/cms/services/interaction.service';
// import { utilService } from '@/cms/services/util.service';
import interactionPathways from '@/cms/cmps/interaction/InteractionPathways';
import referenceTable from '@/cms/cmps/common/ReferenceTable';
import iconsMap from '@/cms/cmps/general/IconsMap';
import entityNotFound from '@/cms/cmps/general/EntityNotFound';
import loader from '@/cms/cmps/general/LoadingCmp';

export default {
    side1Refs: [],
    data() {
        return {
            interaction: null,
            material: null,
            interactionRefs: [],
            side2Refs: [],
            side1Pathways: [],
            isLoading: false
        };
    },
    computed: {
        combinedRefs() {
            let nextDraftIdx = 1;
            /// this reduce is necessary because some pathways are omitted, so pathwayRefs isn't relevant
            /// otherways this.side2Refs instead of side2Refs will do
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
            return this.interactionRefs.concat(side2Refs, this.pathwayRefs);
        },
        relevantSide2Pathways() {
            return this.material.pathways.filter(pathway => (pathway.type === 'enzyme' && (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))) ||
            (pathway.type === 'transporter' && (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))) ||
            (pathway.type === 'carrier' && (!pathway.actions.includes('inducer') && !pathway.actions.includes('inhibitor'))))
        },
        pathwayRefs() {
            const txt = this.relevantSide1Pathways.reduce((acc, pathway) => {
                acc += pathway.influence + ' ';
                return acc;
            }, '');
            const sortedRefs = interactionService.getSortedRefs(txt, this.$options.side1Refs);
            return sortedRefs.filter(ref => this.interactionRefs.findIndex(currRef => currRef.link === ref.link) === -1);
        },
        relevantSide1Pathways() {
            return this.side1Pathways.filter(pathway => {
                const idx = this.relevantSide2Pathways.findIndex(matPathway => matPathway.name.replace('CYP', '').toUpperCase() === pathway.name.replace('CYP', '').toUpperCase());
                return idx !== -1;
            });
        },
        isPrimaryMaterial() {
            if (!this.interaction || !this.material) return false;
            return this.interaction.side2Label.primaryMaterialIds.includes(this.material._id);
        }
    },
    methods: {
        async getVinteractionSides() {
            this.isLoading = true;
            const { id, matId } = this.$route.params;
            const [interaction, side2Material] = await Promise.all([
                this.$store.dispatch({ type: 'loadInteraction', intId: id }),
                this.$store.dispatch({ type: 'loadMaterial', matId }),
            ]);
            this.interaction = interaction;
            this.material = side2Material;
            this.isLoading = false;
            if (this.material) {
                this.side2Refs = this.material.pathwayRefs.filter((ref, idx, refs) => {
                    return refs.findIndex(currRef => currRef.link === ref.link) === idx;
                });
            }
            if (this.interaction) {
                await this.getReferences();
                this.setRefsToolTip();
            }
        },
        async getReferences() {
            const matId = this.interaction.side1Material._id;
            const side1Material = await this.$store.dispatch({
                type: 'loadMaterial',
                matId,
            });
            this.$options.side1Refs = side1Material.refs;
            this.interactionRefs = side1Material.refs.filter((ref) =>
                this.interaction.refs.includes(ref.draftIdx)
            );
            this.side1Pathways = side1Material.pathways;
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
        txtWithRefs(txt, isPathwaysRefs = false) {
            if (!this.interactionRefs.length) return;
            const refsOrder = interactionService.getRefsOrder(txt, false, false).filter(num => txt.indexOf(num) > -1);
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
                let refIdx = txt.indexOf(refNum, lastRefIdx);
                ///~ this is in case CYP1A2 will match if refNum is 2
                ///~ maybe a better way is to fix the regex instead
                if (txt.charAt(refIdx - 1).match(/[a-z]/i)) {
                    refIdx = txt.indexOf(refNum, refIdx + 1);
                }
                lastRefIdx = refIdx;
                if (refIdx > -1) {
                    txt = txt.slice(0, lastRefIdx) +
                    txt.slice(lastRefIdx, (lastRefIdx + refNum.toString().length)).replace(refNum, draftIdx) +
                    txt.slice(lastRefIdx + refNum.toString().length);
                }
            });
            return txt;
        },
        setRefsToolTip() {
            const { pathways, pathways2 } = this.$refs.pathwaySection ? this.$refs.pathwaySection.$refs : { pathways: null, pathways2: null };
            const { summary, reviewOfStudies } = this.$refs;
            const summarySubs = summary.querySelectorAll('sub');
            const reviewSubs = reviewOfStudies.querySelectorAll('sub');
            const pathwaySubs = (pathways) ? pathways.querySelectorAll('sub') : [];
            const pathway2Subs = (pathways2) ? pathways2.querySelectorAll('sub') : [];
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
                        if (sameRefs.length > 1) {
                            const ref = sameRefs.find(ref => this.side2Refs.findIndex(currRef => currRef.link === ref.link) === -1);
                            draftIdx = this.combinedRefs.indexOf(ref) + 1;
                        }
                    }
                    if (i >= (summarySubs.length + reviewSubs.length) && i < (summarySubs.length + reviewSubs.length + pathwaySubs.length)) {
                        draftIdx = this.side2Refs.findIndex(ref => ref && ref.draftIdx === refs[j].draftIdx) + 1 + this.interactionRefs.length;
                    } 
                    
                    htmlStr += `
                    <li class="tooltip-item">
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
        interactionPathways,
        referenceTable,
        iconsMap,
        loader,
        entityNotFound
    },
};
</script>
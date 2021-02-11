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
                    <div> 
                        <div v-if="interaction.monitor.labTests" class="mb-2">
                            <span class="text-capitalize">Lab tests: </span>
                            <span>{{ interaction.monitor.labTests }}</span>
                        </div>

                        <div v-if="interaction.monitor.otherTests" class="mb-2">
                            <span class="text-capitalize">Other tests: </span>
                            <span>{{ interaction.monitor.otherTests }}</span>
                        </div>

                        <div v-if="interaction.monitor.symptons" class="mb-2">
                            <span class="text-capitalize">Symptons: </span>
                            <span>{{ interaction.monitor.symptons }}</span>
                        </div>
                    </div>

                    <div class="text-capitalize">Review of studies:</div>
                    <div
                        v-html="txtWithRefs(interaction.reviewOfStudies)"
                        ref="reviewOfStudies"
                    ></div>

                    <div class="text-capitalize" v-if="material.pathways.length">Pathways:</div>
                    <div v-if="material.pathways.length">
                        <div ref="pathway">
                            <div v-if="enzymePathways.length" class="mb-4">
                                <span class="font-weight-medium">
                                    {{ material.name }}
                                </span>
                                is metabolized by the enzymes:
                                <span v-for="(pathway, idx) in enzymePathways" :key="idx">
                                    <span>{{ idx === 0 ? '' : ',' }} </span>
                                    <span :class="`text-uppercase pathway-name enzyme-${idx}`">{{ pathway.name }} </span>
                                    <v-tooltip bottom :activator="`.enzyme-${idx}`">
                                        <div v-if="pathway.fullName">{{ pathway.fullName }}</div>
                                        <span class="text-capitalize" v-if="pathway.actions.length">
                                            {{ pathway.actions.join(', ') }} 
                                        </span>
                                        <p v-if="!pathway.fullName && !pathway.actions.length" class="ma-0">No additional info :(</p>
                                    </v-tooltip>
                                    <sub>{{ getMaterialRefNums(pathway.references) }}</sub>
                                </span>
                            </div>
                            <div v-if="transporterPathways.length" class="mb-4">
                                <span class="font-weight-medium">
                                    {{ material.name }}
                                </span>
                                is metabolized by the transporters:
                                <span v-for="(pathway, idx) in transporterPathways" :key="idx">
                                    <span>{{ idx === 0 ? '' : ',' }} </span>
                                    <span :class="`text-uppercase pathway-name transporter-${idx}`">{{ pathway.name }} </span>
                                    <v-tooltip bottom :activator="`.transporter-${idx}`">
                                        <div v-if="pathway.fullName">{{ pathway.fullName }}</div>
                                        <span class="text-capitalize" v-if="pathway.actions.length">
                                            {{ pathway.actions.join(', ') }} 
                                        </span>
                                        <p v-if="!pathway.fullName && !pathway.actions.length" class="ma-0">No additional info :(</p>
                                    </v-tooltip>
                                    <sub>{{ getMaterialRefNums(pathway.references) }}</sub>
                                </span>
                            </div>
                            <div v-if="carrierPathways.length" class="mb-4">
                                <span class="font-weight-medium">
                                    {{ material.name }}
                                </span>
                                is metabolized by the carriers:
                                <span v-for="(pathway, idx) in carrierPathways" :key="idx">
                                    <span>{{ idx === 0 ? '' : ',' }} </span>
                                    <span :class="`text-uppercase pathway-name carrier-${idx}`">{{ pathway.name }} </span>
                                    <v-tooltip bottom :activator="`.carrier-${idx}`">
                                        <div v-if="pathway.fullName">{{ pathway.fullName }}</div>
                                        <span class="text-capitalize" v-if="pathway.actions.length">
                                            {{ pathway.actions.join(', ') }} 
                                        </span>
                                        <p v-if="!pathway.fullName && !pathway.actions.length" class="ma-0">No additional info :(</p>
                                    </v-tooltip>
                                    <sub>{{ getMaterialRefNums(pathway.references) }}</sub>
                                </span>
                            </div>
                        </div>
                        <div ref="pathway2" class="mt-12">
                            <p v-if="relevantSide1Pathways.length">
                                <span class="font-weight-medium">{{ interaction.side1Material.name }}</span>
                                effect on the enzymes:
                                <span v-for="(pathway, idx) in relevantSide1Pathways" :key="idx">
                                    <span>{{ idx === 0 ? '' : ',' }} </span>
                                    <span class="text-uppercase">{{ pathway.name }}</span>
                                </span>
                            </p>
                            <div v-for="(pathway, idx) in relevantSide1Pathways" :key="'pathway' + idx">
                                <h6>{{ pathway.name }}</h6>
                                <p v-highlight-text:[material.name] v-html="txtWithRefs(pathway.influence, true)" />
                            </div>
                            <div>
                                <p>
                                    There is no evidence regarding the effect of {{ interaction.side1Material.name }} on
                                    <span v-for="(pathway, idx) in unRelevantSide1Pathways" :key="'unrelevantPathway' + idx">{{ (idx === 0) ? '' : ', ' }}{{ pathway.name.toUpperCase() }}</span> activity.
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
import { interactionService } from '@/services/interaction.service';
import referenceTable from '@/cmps/common/ReferenceTable';
import iconsMap from '@/cmps/general/IconsMap';
import entityNotFound from '@/cmps/general/EntityNotFound';
import loader from '@/cmps/general/LoadingCmp';

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
            return this.interactionRefs.concat(this.side2Refs, this.pathwayRefs);
        },
        pathwayRefs() {
            const txt = this.relevantSide1Pathways.reduce((acc, pathway) => {
                acc += pathway.influence + ' ';
                return acc;
            }, '');
            const sortedRefs = interactionService.getSortedRefs(txt, this.$options.side1Refs);
            return sortedRefs.filter(ref => this.interactionRefs.findIndex(currRef => currRef === ref) === -1);
        },
        relevantSide1Pathways() {
            return this.side1Pathways.filter(pathway => {
                const idx = this.material.pathways.findIndex(matPathway => matPathway.name.replace('CYP', '').toUpperCase() === pathway.name.replace('CYP', '').toUpperCase());
                return idx !== -1;
            });
        },
        unRelevantSide1Pathways() {
            return this.material.pathways.filter(pathway => {
                const idx = this.side1Pathways.findIndex(matPathway => matPathway.name.replace('CYP', '').toUpperCase() === pathway.name.replace('CYP', '').toUpperCase());
                return idx === -1;
            });
        },
        isPrimaryMaterial() {
            if (!this.interaction || !this.material) return false;
            return this.interaction.side2Label.primaryMaterialIds.includes(this.material._id);
        },
        enzymePathways() {
            return this.material.pathways.filter(e => e.type === 'enzyme');
        },
        transporterPathways() {
            return this.material.pathways.filter(e => e.type === 'transporter');
        },
        carrierPathways() {
            return this.material.pathways.filter(e => e.type === 'carrier');
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
        getMaterialRefNums(pubmedIds) {
            if (!this.interactionRefs.length || !this.side2Refs.length || !pubmedIds.length) return;
            if (!pubmedIds.length) return '';
            if (pubmedIds.length === 1) {
                const field = (typeof pubmedIds[0] === 'number') ? 'pubmedId' : 'link';
                const refIdx  = this.combinedRefs.findIndex(ref => pubmedIds.includes(ref[field]));
                return `(${refIdx + 1})`;
            }
            let refsStr = '';
            for (let i = 0; i < pubmedIds.length; i++) {
                const field = (typeof pubmedIds[i] === 'number') ? 'pubmedId' : 'link';
                const idx = this.combinedRefs.findIndex(ref => pubmedIds[i] === ref[field]);
                refsStr += (idx + 1) + ', ';
            }
            return `(${refsStr.split(', ').filter(str => str).sort((a, b) => a - b).join(', ')})`;
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
                        const ref = sameRefs.find(ref => this.side2Refs.findIndex(currRef => currRef === ref) === -1);
                        draftIdx = this.combinedRefs.indexOf(ref) + 1;
                    }
                }
                const refIdx = txt.indexOf(refNum, lastRefIdx);
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
                        if (sameRefs.length > 1) {
                            const ref = sameRefs.find(ref => this.side2Refs.findIndex(currRef => currRef === ref) === -1);
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
        referenceTable,
        iconsMap,
        loader,
        entityNotFound
    },
};
</script>
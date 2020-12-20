<template>
    <div>
        <section class="material-details" v-if="material">
            <div class="container">
                <confirm-delete
                    v-model="dialog"
                    type="material"
                    :dialog="dialog"
                    @delete-confirm="removeMaterial"
                    @delete-cancel="dialog = false"
                />
                <div class="action-container">
                    <v-btn class="base-btn action-btn" color="primary" :to="(isArchive) ? '/archive' : '/material'">
                        <v-icon small left>mdi-arrow-left</v-icon>{{ (isArchive) ? 'Back to Archive' : 'Back to Materials' }}
                    </v-btn>
                    <v-btn
                        class="base-btn action-btn"
                        color="primary"
                        :to="{
                            path: '/interaction',
                            query: { material: `${material._id}` },
                        }"
                    >
                        <v-icon small left>mdi-view-list</v-icon>Interactions
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                        class="base-btn action-btn"
                        color="primary"
                        :to="`/material/edit/${material._id}`"
                        v-if="!isArchive"
                    >
                        <v-icon small left>mdi-pencil</v-icon>Edit
                    </v-btn>
                    <v-btn color="error" @click="displayDialog" v-if="!isArchive">
                        <v-icon small left>mdi-delete</v-icon>Delete
                    </v-btn>
                </div>

                <v-card class="info-container">
                    <v-card-title class="material-details-title">
                        {{ material.name }}
                    </v-card-title>

                    <h3 class="info-title">Type:</h3>
                    <div class="info-value">{{ material.type }}</div>

                    <h3 class="info-title" v-if="material.updatedAt">Last Update At:</h3>
                    <div class="info-value" v-if="material.updatedAt">{{ material.updatedAt | moment('MMM Do YYYY') }}</div>

                    <h3 class="info-title" v-if="material.atcId">ATC Code:</h3>
                    <div class="info-value" v-if="material.atcId">{{ material.atcId }}</div>

                    <h3 class="info-title" v-if="material.drugBankId">DrugBank ID:</h3>
                    <div class="info-value" v-if="material.drugBankId">{{ material.drugBankId }}</div>

                    <h3 class="info-title" v-if="material.aliases.length">Synonyms:</h3>
                    <v-chip-group column v-if="material.aliases.length">
                        <v-chip v-for="(alias, idx) in material.aliases" :key="idx">{{
                            alias
                        }}</v-chip>
                    </v-chip-group>

                    <h3 class="info-title" v-if="material.brands.length">Brands:</h3>
                    <v-chip-group column v-if="material.brands.length">
                        <v-chip v-for="(brand, idx) in material.brands" :key="idx">
                            {{ brand }}
                        </v-chip>
                    </v-chip-group>

                    <h3
                        class="info-title"
                        v-if="material.type === 'herb' && material.botanicalFamily"
                    >
                        Botanical Family
                    </h3>
                    <div
                        class="info-value"
                        v-if="material.type === 'herb' && material.botanicalFamily"
                    >
                        {{ material.botanicalFamily }}
                    </div>

                    <h3 class="info-title" v-if="material.desc">Description:</h3>
                    <p class="info-value" v-if="material.desc" v-html="material.desc"></p>

                    <h3
                        class="info-title"
                        v-if="material.type === 'herb' && material.plantPartUsed"
                    >
                        Plant Part Used
                    </h3>
                    <div
                        class="info-value"
                        v-if="material.type === 'herb' && material.plantPartUsed"
                    >
                        {{ material.plantPartUsed }}
                    </div>

                    <h3 class="info-title" v-if="material.qualities.length">
                        Qualities:
                    </h3>
                    <div class="info-value" v-if="material.qualities.length">
                        <v-chip-group column>
                            <v-chip
                                v-for="(quality, idx) in material.qualities"
                                :key="idx"
                                >{{ quality }}</v-chip
                            >
                        </v-chip-group>
                    </div>

                    <h3 class="info-title" v-if="material.activeConstituents">
                        Active Constituents:
                    </h3>
                    <div
                        class="info-value"
                        v-if="material.activeConstituents"
                        v-html="material.activeConstituents"
                    ></div>

                    <h3 class="info-title" v-if="material.medicinalActions.length">
                        Medicinal Actions:
                    </h3>
                    <div class="info-value" v-if="material.medicinalActions.length">
                        <v-chip-group column>
                            <v-chip
                                v-for="(medAction, idx) in material.medicinalActions"
                                :key="idx"
                                >{{ medAction }}</v-chip
                            >
                        </v-chip-group>
                    </div>

                    <h3 class="info-title" v-if="material.indications.length">Indications:</h3>
                    <v-chip-group column v-if="material.indications.length">
                        <v-chip
                            v-for="(indication, idx) in material.indications"
                            :key="idx"
                            >{{ indication }}</v-chip
                        >
                    </v-chip-group>

                    <h3 class="info-title" v-if="material.dosage">Dosage:</h3>
                    <div class="info-value dosage" v-if="material.dosage" v-html="material.dosage"></div>

                    <h3 class="info-title" v-if="material.sensitivities">
                        Sensitivities:
                    </h3>
                    <p
                        class="info-value"
                        v-if="material.sensitivities"
                        v-html="material.sensitivities"
                    ></p>

                    <h3 class="info-title" v-if="material.adverseReactions">Adverse Reactions:</h3>
                    <p class="info-value" v-if="material.adverseReactions" v-html="txtWithRefs('adverseReactions')"></p>

                    <h3 class="info-title" v-if="material.overdosage">Overdosage:</h3>
                    <p
                        class="info-value"
                        v-if="material.overdosage"
                        v-html="txtWithRefs('overdosage')"
                    ></p>

                    <h3 class="info-title" v-if="material.precautions">Precautions:</h3>
                    <p class="info-value" v-if="material.precautions" v-html="txtWithRefs('precautions')"></p>

                    <h3 class="info-title" v-if="material.contraindications">
                        Contraindications:
                    </h3>
                    <p
                        class="info-value"
                        v-if="material.contraindications"
                        v-html="txtWithRefs('contraindications')"
                    ></p>

                    <h3 class="info-title" v-if="material.toxicity">Toxicity:</h3>
                    <p
                        class="info-value"
                        v-if="material.toxicity"
                        v-html="txtWithRefs('toxicity')"
                    ></p>

                    <h3 class="info-title" v-if="material.pregnancy">Pregnancy:</h3>
                    <p
                        class="info-value"
                        v-if="material.pregnancy"
                        v-html="txtWithRefs('pregnancy')"
                    ></p>

                    <h3 class="info-title" v-if="material.lactation">Lactation:</h3>
                    <p
                        class="info-value"
                        v-if="material.lactation"
                        v-html="txtWithRefs('lactation')"
                    ></p>

                    <h3 class="info-title" v-if="material.effectOnDrugMetabolism">
                        Effect on drug metabolism:
                    </h3>
                    <p
                        class="info-value"
                        v-if="material.effectOnDrugMetabolism"
                        v-html="txtWithRefs('effectOnDrugMetabolism')"
                    ></p>

                    <h3 class="info-title" v-if="material.detailedPharmacology">
                        Detailed Pharmacology:
                    </h3>
                    <p
                        class="info-value"
                        v-if="material.detailedPharmacology"
                        v-html="txtWithRefs('detailedPharmacology')"
                    ></p>

                    <h3 class="info-title" v-if="material.mechanismOfAction">
                        Mechanism Of Action:
                    </h3>
                    <div
                        class="info-value"
                        v-if="material.mechanismOfAction"
                        v-html="material.mechanismOfAction"
                    ></div>

                    <h3 class="info-title" v-if="material.draft">Draft:</h3>
                    <div class="info-value" v-if="material.draft">
                        {{ material.draft }}
                    </div>

                    <h3 class="info-title" v-if="material.editorDraft">
                        Editor draft:
                    </h3>
                    <p class="info-value" v-if="material.editorDraft">
                        {{ material.editorDraft }}
                    </p>

                    <h3 class="info-title" v-if="material.regions.length">Regions:</h3>
                    <v-chip-group column v-if="material.regions.length">
                        <v-chip v-for="region in material.regions" :key="region">
                            <v-avatar left>
                                <v-img
                                    :src="
                                        require(`@/assets/icons/regions/${region}.svg`)
                                    "
                                ></v-img>
                            </v-avatar>
                            {{ region.toUpperCase() }}
                        </v-chip>
                    </v-chip-group>

                    <h3 class="info-title" v-if="material.subMaterials.length">
                        Sub Materials:
                    </h3>
                    <sub-material-list :subMats="material.subMaterials" />

                    <h3 class="info-title" v-if="material.atcPaths.length">
                        ATC Paths:
                    </h3>
                    <label-path-list
                        v-if="material.atcPaths.length"
                        :atcPaths="material.atcPaths"
                        :isEdit="false"
                    />

                    <h3 class="info-title" v-if="material.pathways.length">Pathways:</h3>
                    <v-chip-group column v-if="material.pathways.length">
                        <v-chip v-for="(pathway, idx) in material.pathways" :key="idx">
                            {{ pathway.enzyme.toUpperCase() }}
                        </v-chip>
                    </v-chip-group>


                    <h3 class="info-title" v-if="material.compounds.length">Compounds:</h3>
                    <v-expansion-panels class="material-details-expand-panel" v-if="material.compounds.length">
                        <v-expansion-panel>
                            <v-expansion-panel-header class="material-details-expand-panel-header pa-0">
                                Click to view compounds
                            </v-expansion-panel-header>
                            <v-expansion-panel-content class="pa-0">
                                <v-chip-group column>
                                    <v-chip v-for="(compound, idx) in material.compounds" :key="idx">
                                        {{ compound }}
                                    </v-chip>
                                </v-chip-group>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>

                    <h3 class="info-title" v-if="material.labels.length">Labels</h3>
                    <v-chip-group column v-if="material.labels.length">
                        <v-chip
                            v-for="label in material.labels"
                            :key="label._id"
                        >
                        <router-link :to="`/label/${label._id}`">
                            {{ label.name }}
                        </router-link>
                        </v-chip>
                    </v-chip-group>

                    <reference-table
                        class="ref-table"
                        :references="material.refs"
                        v-if="material.refs.length"
                    />
                </v-card>
                <icons-map />
            </div>
        </section>
        <entity-not-found v-if="isNotFound" entity="material"></entity-not-found>
    </div>
</template>

<script>
import { interactionService } from '@/services/interaction.service';
import subMaterialList from '@/cmps/material/SubMaterialList';
import labelPathList from '@/cmps/material/details/LabelPathList';
import confirmDelete from '@/cmps/general/ConfirmDelete';
import referenceTable from '@/cmps/common/ReferenceTable';
import iconsMap from '@/cmps/general/IconsMap';
import entityNotFound from '@/cmps/general/EntityNotFound';

export default {
    data() {
        return {
            material: null,
            dialog: false,
            isArchive: false,
            isNotFound: false
        };
    },
    watch: {
        '$route.params.id': function () {
            this.loadMaterial();
        },
    },
    methods: {
        setRefsToolTip() {
            const elSubs = Array.from(document.querySelectorAll('sub'));
            for (let i = 0; i < elSubs.length; i++) {
                elSubs[i].addEventListener('mouseenter', this.setTooltipPos);
                const refsOrder = interactionService.getRefsOrder(elSubs[i].innerText);
                
                const refs = this.getRefsFromIdxs(refsOrder);
                const elTooltip = document.createElement('aside');
                elTooltip.classList.add('refs-tooltip');
                let htmlStr = '<ul>';
                for (let j = 0; j < refs.length; j++) {
                    htmlStr += `<li class="tooltip-item">
                        <p><span>${refs[j].draftIdx}</span>.${refs[j].txt}</p>
                        <a href="${refs[j].link}" class="ref-link" target="_blank">${refs[j].link}</a>
                    </li>`;
                }
                htmlStr += '</ul>';
                elTooltip.innerHTML = htmlStr;
                elSubs[i].appendChild(elTooltip);
            }
        },
        txtWithRefs(propName) {
            const regex = /\(([\d- ,\d]+)\)|<sub>\(([\d- ,\d]+)\)<\/sub>/g;
            let txt = this.material[propName];
            const matches = txt.match(regex);
            if (matches) {
                let lastidx = 0;
                matches.forEach(match => {
                    if (this.isRefStr(match)) {
                        const idx = txt.indexOf(match, lastidx);
                        if (idx < 0) return;
                        lastidx = idx + 6;
                        txt = txt.slice(0, idx) + txt.slice(idx).replace(match, `<sub>${match}</sub>`);
                    }
                });
            }
            return txt;
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
            refIdxs.forEach(idx => {
                refs.push({ ...this.material.refs[idx - 1] });
            })
            return refs;
        },
        isRefStr(refStr) {
            let doReturn = true;
            let formatted = refStr.replaceAll(/[-,()]/g, '__');
            formatted = formatted.split('__').filter(idxStr => +idxStr);
            formatted.forEach(numStr => {
                if (numStr.length >= 4) doReturn = false;
            });
            return doReturn;
        },
        async loadMaterial() {
            const matId = this.$route.params.id;
            if (matId) {
                const material = await this.$store.dispatch({
                    type: (this.isArchive) ? 'loadArchiveMaterial' : 'loadMaterial',
                    matId,
                });
                this.material = material;
                if (!this.material) {
                    this.isNotFound = true;
                }
            }
        },
        removeMaterial() {
            const material = JSON.parse(JSON.stringify(this.material));
            const matId = material._id;
            const saveToArchive = this.$store.dispatch({
                type: 'saveMaterialToArchive',
                material,
            });
            const removeMaterial = this.$store.dispatch({
                type: 'removeMaterial',
                matId,
            });
            Promise.all([saveToArchive, removeMaterial]).then(() => {
                this.$router.push('/material');
            });
        },
        displayDialog() {
            this.dialog = true;
        },
    },
    created() {
        if (this.$route.name === 'ArchiveMaterialDetails') {
            this.isArchive = true;   
        }
        this.loadMaterial();
    },
    updated() {
        this.setRefsToolTip();
    },
    components: {
        subMaterialList,
        labelPathList,
        referenceTable,
        confirmDelete,
        iconsMap,
        entityNotFound
    },
};
</script>
<template>
    <div>
        <section class="material-details" v-if="material" ref="materialDetails">
            <div class="container">
                <confirm-delete
                    v-model="dialog"
                    type="material"
                    :dialog="dialog"
                    @delete-confirm="removeMaterial"
                    @delete-cancel="dialog = false"
                />
                <div class="action-container">
                    <v-btn class="base-btn action-btn" color="primary" @click="$router.go(-1)">
                        <v-icon small left>mdi-arrow-left</v-icon>Back
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
                        <v-avatar left class="mr-2" size="20">
                            <v-img
                                :src="require(`@/cms/assets/icons/${material.type}.svg`)"
                            ></v-img>
                        </v-avatar>
                        {{ material.name }}
                    </v-card-title>

                    <div class="info-title narrow-therapeutic" v-if="material.isNarrowTherapeutic">
                        <v-icon>mdi-pill</v-icon>
                        Narrow therapeutic drug.
                    </div>

                    <h3 class="info-title">Type:</h3>
                    <div class="info-value">{{ material.type }}</div>

                    <h3 class="info-title" v-if="material.updatedAt">Last Update At:</h3>
                    <div class="info-value" v-if="material.updatedAt">{{ material.updatedAt | moment('MMM Do YYYY') }}</div>

                    <h3 class="info-title" v-if="material.atcId">ATC Code:</h3>
                    <div class="info-value" v-if="material.atcId">{{ material.atcId }}</div>

                    <h3 class="info-title" v-if="material.drugBankId">DrugBank ID:</h3>
                    <div class="info-value" v-if="material.drugBankId">{{ material.drugBankId }}</div>

                    <h3 class="info-title" v-if="material.fdaLabel">FDA Label:</h3>
                    <div class="info-value" v-if="material.fdaLabel">
                        <a :href="material.fdaLabel" target="_blank">{{ material.fdaLabel }}</a>
                    </div>

                    <h3 class="info-title" v-if="material.atcIds.length">ATC IDs:</h3>
                    <v-chip-group column v-if="material.atcIds.length">
                        <v-chip v-for="id in material.atcIds" :key="id">
                            {{ id }}
                        </v-chip>
                    </v-chip-group>

                    <h3 class="info-title" v-if="material.brands.length">Brands:</h3>
                    <v-chip-group column v-if="material.brands.length">
                        <v-chip v-for="(brand, idx) in material.brands" :key="idx">
                            {{ brand }}
                        </v-chip>
                    </v-chip-group>

                    <h3 class="info-title" v-if="material.aliases.length">Synonyms:</h3>
                    <v-chip-group column v-if="material.aliases.length">
                        <v-chip v-for="(alias, idx) in material.aliases" :key="idx">{{
                            alias
                        }}</v-chip>
                    </v-chip-group>

                    <h3 class="info-title" v-if="material.dBankAliases.length">DrugBank's Synonyms:</h3>
                    <v-chip-group column v-if="material.dBankAliases.length">
                        <v-chip v-for="(alias, idx) in material.dBankAliases" :key="idx">{{
                            alias
                        }}</v-chip>
                    </v-chip-group>

                    <h3
                        class="info-title"
                        v-if="material.botanicalFamily"
                    >
                        Botanical Family
                    </h3>
                    <div
                        class="info-value"
                        v-if="material.botanicalFamily"
                    >
                        {{ material.botanicalFamily }}
                    </div>

                    <h3
                        class="info-title"
                        v-if="material.plantPartUsed"
                    >
                        Plant Part Used
                    </h3>
                    <div
                        class="info-value"
                        v-if="material.plantPartUsed"
                    >
                        {{ material.plantPartUsed }}
                    </div>

                    <h3 class="info-title" v-if="material.desc">Description:</h3>
                    <p class="info-value" v-if="material.desc" v-html="material.desc"></p>

                    <h3 class="info-title text-capitalize" v-if="material.dBankDesc">DrugBank's description:</h3>
                    <p class="info-value" v-if="material.dBankDesc" v-html="material.dBankDesc"></p>

                    <h3 class="info-title text-capitalize" v-if="material.dBankClinicalDesc">DrugBank's clinical description:</h3>
                    <p class="info-value" v-if="material.dBankClinicalDesc" v-html="material.dBankClinicalDesc"></p>

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
                        >
                            {{ indication }}
                        </v-chip>
                    </v-chip-group>

                    <h3 class="info-title" v-if="material.dBankIndications.length">DrugBank's Indications:</h3>
                    <v-chip-group column v-if="material.dBankIndications.length">
                        <v-chip
                            v-for="(indication, idx) in material.dBankIndications"
                            :key="idx"
                        >
                            {{ indication }}
                        </v-chip>
                    </v-chip-group>

                    <h3 class="info-title" v-if="material.dosage">Dosage:</h3>
                    <div class="info-value dosage" v-if="material.dosage" v-html="material.dosage"></div>

                    <h3 class="info-title" v-if="material.sensitivities">
                        Sensitivities:
                    </h3>
                    <p
                        class="info-value"
                        v-if="material.sensitivities"
                        v-html="txtWithRefs('sensitivities')"
                    />

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

                    <h3 class="info-title" v-if="material.regions.length">Regions:</h3>
                    <v-chip-group column v-if="material.regions.length">
                        <v-chip v-for="region in material.regions" :key="region">
                            <v-avatar left>
                                <v-img
                                    :src="
                                        require(`@/cms/assets/icons/regions/${region.toLowerCase()}.svg`)
                                    "
                                ></v-img>
                            </v-avatar>
                            {{ region.toUpperCase() }}
                        </v-chip>
                    </v-chip-group>

                    <h3 class="info-title" v-if="material.pathways.length">Pathways:</h3>
                    <v-chip-group column v-if="material.pathways.length">
                        <v-tooltip
                            v-for="(pathway, idx) in material.pathways"
                            :key="idx"
                            bottom
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-chip
                                    class="pathway"
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    {{ pathway.name.toUpperCase() }}
                                </v-chip>
                            </template>
                            <div v-if="pathway.fullName">{{ pathway.fullName }}</div>
                            <div class="text-capitalize" v-if="pathway.type">{{ pathway.type }}</div>
                            <span class="text-capitalize" v-if="pathway.actions.length">
                                {{ pathway.actions.join(', ') }} 
                            </span>
                            <p v-if="!pathway.fullName && !pathway.type && !pathway.actions.length" class="ma-0">No additional info :(</p>
                        </v-tooltip>
                    </v-chip-group>

                    <h3 class="text-capitalize info-title" v-if="material.dBankCategories.length">
                        Categories:
                        <span class="d-block caption">(DrugBank's)</span>
                    </h3>
                    <v-expansion-panels
                        class="material-details-expand-panel"
                        flat
                        v-if="material.dBankCategories.length"
                    >
                        <v-expansion-panel>
                            <v-expansion-panel-header class="material-details-expand-panel-header pa-0">
                                Click to view DrugBank's categories:
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-chip-group column>
                                    <v-chip v-for="(category, idx) in material.dBankCategories" :key="idx">
                                        {{ category }}
                                    </v-chip>
                                </v-chip-group>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>

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

                    <h3 class="info-title" v-if="material.structuredAdverseEffects.length">
                        Adverse Effects:
                        <span class="d-block caption">(DrugBank's)</span>
                    </h3>
                    <v-expansion-panels class="material-details-expand-panel" v-if="material.structuredAdverseEffects.length">
                        <v-expansion-panel>
                            <v-expansion-panel-header class="material-details-expand-panel-header pa-0">
                                Click to view structured adverse effects.
                            </v-expansion-panel-header>
                            <v-expansion-panel-content class="pa-0">
                                <v-chip-group column>
                                    <v-chip v-for="(effect, idx) in material.structuredAdverseEffects" :key="idx">
                                        {{ effect }}
                                    </v-chip>
                                </v-chip-group>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>

                    <h3 class="info-title" v-if="material.structuredContraIndications.length">
                        Contra Indications:
                        <span class="d-block caption">(DrugBank's)</span>
                    </h3>
                    <v-expansion-panels class="material-details-expand-panel" v-if="material.structuredContraIndications.length">
                        <v-expansion-panel>
                            <v-expansion-panel-header class="material-details-expand-panel-header pa-0">
                                Click to view structured contra indications.
                            </v-expansion-panel-header>
                            <v-expansion-panel-content class="pa-0">
                                <v-chip-group column>
                                    <v-chip v-for="(indication, idx) in material.structuredContraIndications" :key="idx">
                                        {{ indication }}
                                    </v-chip>
                                </v-chip-group>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>

                    <h3 class="info-title" v-if="material.atcPaths.length">
                        ATC Paths:
                    </h3>
                    <label-path-list
                        v-if="material.atcPaths.length"
                        :atcPaths="material.atcPaths"
                        :isEdit="false"
                    />

                    <h3 class="info-title" v-if="material.labels.length">Labels</h3>
                    <v-chip-group column v-if="material.labels.length" class="material-details-labels">
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

                    <d-bank-reference-table
                        class="d-bank-ref-table"
                        :refs="material.dBankRefs"
                        v-if="material.dBankRefs.length"
                    />

                    <h3 class="text-capitalize info-title" v-if="material.externalLinks.length">External links:</h3>
                    <v-expansion-panels
                        class="material-details-expand-panel"
                        flat
                        v-if="material.externalLinks.length"
                    >
                        <v-expansion-panel>
                            <v-expansion-panel-header class="material-details-expand-panel-header pa-0">
                                Click to view external links:
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-list>
                                    <v-list-item
                                        v-for="(link ,idx) in material.externalLinks"
                                        :key="idx"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>{{ link.resource }}</v-list-item-title>
                                            <v-list-item-subtitle>
                                                <a :href="link.url" target="_blank">{{ link.url }}</a>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>

                    <h3 class="text-capitalize info-title">Pharmacology:</h3>
                    <pharmacology-details
                        class="material-details-expand-panel"
                        :pharmacology="material.pharmacology"
                    >
                        <template #header>
                            <v-expansion-panel-header
                                class="material-details-expand-panel-header pa-0"
                            >
                                Click to view pharmacology:
                            </v-expansion-panel-header>
                        </template>
                    </pharmacology-details>

                    <h3 class="text-capitalize info-title" v-if="material.foodInteractions.length">Food Interactions:</h3>
                    <v-expansion-panels
                        class="material-details-expand-panel"
                        flat
                        v-if="material.foodInteractions.length"
                    >
                        <v-expansion-panel>
                            <v-expansion-panel-header class="material-details-expand-panel-header pa-0">
                                Click to view food interactions:
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-list>
                                    <v-list-item
                                        v-for="(interaction ,idx) in material.foodInteractions"
                                        :key="idx"
                                    >
                                        <v-list-item-content class="pa-0">
                                            &bull; {{ interaction }}
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>

                </v-card>
                <icons-map />
            </div>
        </section>
        <entity-not-found v-if="isNotFound" entity="material"></entity-not-found>
    </div>
</template>

<script>
import { interactionService } from '@/cms/services/interaction.service';
import labelPathList from '@/cms/cmps/material/details/LabelPathList';
import confirmDelete from '@/cms/cmps/general/ConfirmDelete';
import referenceTable from '@/cms/cmps/common/ReferenceTable';
import dBankReferenceTable from '@/cms/cmps/common/DBankRefsTable';
import pharmacologyDetails from '@/cms/cmps/material/details/PharmacologyDetails';
import iconsMap from '@/cms/cmps/general/IconsMap';
import entityNotFound from '@/cms/cmps/general/EntityNotFound';

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
            const elSubs = Array.from(this.$refs.materialDetails.querySelectorAll('sub'));
            for (let i = 0; i < elSubs.length; i++) {
                const refsOrder = interactionService.getRefsOrder(elSubs[i].innerText);
                const refs = this.getRefsFromIdxs(refsOrder);
                
                elSubs[i].addEventListener('mouseenter', this.setTooltipPos);
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
        labelPathList,
        referenceTable,
        dBankReferenceTable,
        pharmacologyDetails,
        confirmDelete,
        iconsMap,
        entityNotFound
    },
};
</script>
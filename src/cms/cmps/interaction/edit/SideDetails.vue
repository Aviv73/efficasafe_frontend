<template>
<section class="side-details" v-if="side">
  <v-card class="px-2 pb-1">
    <v-card-title class="side-details-title px-0">
        <v-avatar left class="mr-2" size="20">
            <v-img v-if="side.type"
                :src="require(`@/cms/assets/icons/${side.type}.svg`)"
            ></v-img>
        </v-avatar>
        {{ side.name }}
    </v-card-title>
    <div class="side-details-row" v-if="side.isNarrowTherapeutic">
        <v-icon>mdi-pill</v-icon>
        Narrow therapeutic drug.
    </div>
    <div class="side-details-row" v-if="side.isG6pd">
        <v-icon>mdi-pill</v-icon>
        G6PD drug.
    </div>
    <div class="side-details-row" v-if="side.isSalicylate">
        <v-icon>mdi-pill</v-icon>
        Salicylate drug.
    </div>
    <div class="side-details-row" v-if="side.isComposite">
        <v-icon>mdi-pill</v-icon>
        Composite drug.
    </div>
    <div class="side-details-row" v-if="side.isTannin">
        <v-icon>mdi-pill</v-icon>
        Tannin drug.
    </div>
    <div class="side-details-row" v-if="side.isPhototoxicity">
        <v-icon>mdi-pill</v-icon>
        Phototoxicity drug.
    </div>
    <div class="side-details-row" v-if="side.isSulfa">
        <v-icon>mdi-pill</v-icon>
        Sulfa drug.
    </div>
    <div class="side-details-row" v-if="side.type">
        <span class="side-details-row-header">Type:</span>
        {{ side.type }}
    </div>
    <div class="side-details-row" v-if="side.drugBankId">
        <span class="side-details-row-header">DrugBank id:</span>
        {{ side.drugBankId }}
    </div>
    <div class="side-details-row" v-if="side.fdaLabel">
        <span class="side-details-row-header">FDA label:</span>
        <a :href="side.fdaLabel" target="_blank">{{ side.fdaLabel }}</a>
    </div>
    <div class="side-details-row" v-if="side.atcIds.length">
        <span class="side-details-row-header">ATC ID's:</span>
        <v-chip-group column>
            <v-chip v-for="(id, idx) in side.atcIds" :key="idx">
                {{ id }}
            </v-chip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.brands.length">
        <span class="side-details-row-header">Brands:</span>
        <v-chip-group column>
            <v-chip v-for="(brand, idx) in side.brands" :key="idx">
                {{ brand }}
            </v-chip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.aliases.length">
        <span class="side-details-row-header">Synonyms:</span>
        <v-chip-group column>
            <v-chip v-for="(alias, idx) in side.aliases" :key="idx">
                {{ alias }}
            </v-chip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.dBankAliases.length">
        <span class="side-details-row-header">DrugBank's synonyms:</span>
        <v-chip-group column>
            <v-chip v-for="(alias, idx) in side.dBankAliases" :key="idx">
                {{ alias }}
            </v-chip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.botanicalFamily">
        <span class="side-details-row-header">Botanical family:</span>
        {{ side.botanicalFamily }}
    </div>
    <div class="side-details-row" v-if="side.plantPartUsed">
        <span class="side-details-row-header">Plant part used:</span>
        {{ side.plantPartUsed }}
    </div>
    <div class="side-details-row" v-if="side.desc">
        <span class="side-details-row-header">Description:</span>
        <div v-html="side.desc"></div>
    </div>
    <div class="side-details-row" v-if="side.dBankDesc">
        <span class="side-details-row-header">DrugBank's description:</span>
        <div v-html="side.dBankDesc"></div>
    </div>
    <div class="side-details-row" v-if="side.dBankClinicalDesc">
        <span class="side-details-row-header">DrugBank's clinical description:</span>
        <div v-html="side.dBankClinicalDesc"></div>
    </div>
    <div class="side-details-row" v-if="side.qualities.length">
        <span class="side-details-row-header">Qualities:</span>
        <v-chip-group column>
            <v-chip v-for="(quality, idx) in side.qualities" :key="idx">
                {{ quality }}
            </v-chip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.activeConstituents">
        <span class="side-details-row-header">Active constituents:</span>
        <div v-html="side.activeConstituents"></div>
    </div>
    <div class="side-details-row" v-if="side.medicinalActions.length">
        <span class="side-details-row-header">Medicinal actions:</span>
        <v-chip-group column>
            <v-chip v-for="(action, idx) in side.medicinalActions" :key="idx">
                {{ action }}
            </v-chip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.indications.length">
        <span class="side-details-row-header">Indications:</span>
        <v-chip-group column>
            <v-chip v-for="(indication, idx) in side.indications" :key="idx">
                {{ indication }}
            </v-chip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.dBankIndications.length">
        <v-expansion-panels flat>
            <v-expansion-panel>
                <v-expansion-panel-header class="pa-0">
                    <span class="side-details-row-header">DrugBank's Indications:</span>    
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pa-0">
                    <v-chip-group column>
                        <v-chip v-for="(indication, idx) in side.dBankIndications" :key="idx">
                            {{ indication }}
                        </v-chip>
                    </v-chip-group>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
    <div class="side-details-row" v-if="side.pathways.length">
        <span class="side-details-row-header">Pathways:</span>
        <v-chip-group column>
            <v-tooltip
                v-for="(pathway, idx) in side.pathways"
                :key="idx"
                bottom
            >
                <template v-slot:activator="{ on, attrs }">
                        <v-chip v-bind="attrs" v-on="on">
                            {{ pathway.name.toUpperCase() }}
                        </v-chip>
                </template>
                <div>{{ pathway.fullName }}</div>
                <div class="text-capitalize">{{ pathway.type }}</div>
                <span
                    class="text-capitalize"
                    v-for="action in pathway.actions"
                    :key="action"
                >
                    {{ action }} 
                </span>
            </v-tooltip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.dosage">
        <span class="side-details-row-header">Dosage:</span>
        <div v-html="side.dosage"></div>
    </div>
    <div class="side-details-row" v-if="side.sensitivities">
        <span class="side-details-row-header">Sensitivities:</span>
        <div v-html="side.sensitivities"></div>
    </div>
    <div class="side-details-row" v-if="side.adverseReactions">
        <span class="side-details-row-header">Adverse reactions:</span>
        <div v-html="side.adverseReactions"></div>
    </div>
    <div class="side-details-row" v-if="side.overdosage">
        <span class="side-details-row-header">Overdosage:</span>
        <div v-html="side.overdosage"></div>
    </div>
    <div class="side-details-row" v-if="side.precautions">
        <span class="side-details-row-header">Precautions:</span>
        <div v-html="side.precautions"></div>
    </div>
    <div class="side-details-row" v-if="side.contraindications">
        <span class="side-details-row-header">Contraindications:</span>
        <div v-html="side.contraindications"></div>
    </div>
    <div class="side-details-row" v-if="side.toxicity">
        <span class="side-details-row-header">Toxicity:</span>
        <div v-html="side.toxicity"></div>
    </div>
    <div class="side-details-row" v-if="side.pregnancy">
        <span class="side-details-row-header">Pregnancy:</span>
        <div v-html="side.pregnancy"></div>
    </div>
    <div class="side-details-row" v-if="side.lactation">
        <span class="side-details-row-header">Lactation:</span>
        <div v-html="side.lactation"></div>
    </div>
    <div class="side-details-row" v-if="side.effectOnDrugMetabolism">
        <span class="side-details-row-header">Effect on drug metabolism:</span>
        <div v-html="side.effectOnDrugMetabolism"></div>
    </div>
    <div class="side-details-row" v-if="side.detailedPharmacology">
        <span class="side-details-row-header">Detailed pharmacology:</span>
        <div v-html="side.detailedPharmacology"></div>
    </div>
    <div class="side-details-row" v-if="side.mechanismOfAction">
        <span class="side-details-row-header">Mechanism of action:</span>
        <div v-html="side.mechanismOfAction"></div>
    </div>
    <div class="side-details-row" v-if="side.regions.length">
        <span class="side-details-row-header">Regions:</span>
        <v-chip-group column>
            <v-chip v-for="(region, idx) in side.regions" :key="'region' + idx" class="text-uppercase">
                <v-avatar left>
                    <v-img v-if="region"
                        :src="require(`@/cms/assets/icons/regions/${region.toLowerCase()}.svg`)"
                    ></v-img>
                </v-avatar>
                {{ region }}
            </v-chip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.dBankCategories.length">
        <span class="side-details-row-header">DrugBank's Categories:</span>
        <v-chip-group column>
            <v-chip v-for="(category, idx) in side.dBankCategories" :key="idx">
                {{ category }}
            </v-chip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.compounds.length">
        <v-expansion-panels flat>
            <v-expansion-panel>
                <v-expansion-panel-header class="pa-0">
                    <span class="side-details-row-header">Compounds:</span>    
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pa-0">
                    <v-chip-group column>
                        <v-chip v-for="(compound, idx) in side.compounds" :key="idx">
                            {{ compound }}
                        </v-chip>
                    </v-chip-group>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
    <div class="side-details-row" v-if="side.structuredAdverseEffects.length">
        <v-expansion-panels flat>
            <v-expansion-panel>
                <v-expansion-panel-header class="pa-0">
                    <span class="side-details-row-header">Structured adverse effects:</span>    
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pa-0">
                    <v-chip-group column>
                        <v-chip v-for="(effect, idx) in side.structuredAdverseEffects" :key="idx">
                            {{ effect }}
                        </v-chip>
                    </v-chip-group>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
    <div class="side-details-row" v-if="side.structuredContraIndications.length">
        <v-expansion-panels flat>
            <v-expansion-panel>
                <v-expansion-panel-header class="pa-0">
                    <span class="side-details-row-header">Structured contraindications:</span>    
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pa-0">
                    <v-chip-group column>
                        <v-chip v-for="(indication, idx) in side.structuredContraIndications" :key="idx">
                            {{ indication }}
                        </v-chip>
                    </v-chip-group>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
    <div class="side-details-row" v-if="side.atcPaths.length">
        <v-expansion-panels flat>
            <v-expansion-panel>
                <v-expansion-panel-header class="pa-0">
                    <span class="side-details-row-header">ATC paths:</span>    
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pa-0">
                    <label-path-list
                        class="narrow"
                        :atcPaths="side.atcPaths"
                        :isEdit="false"
                    />
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
    <div class="side-details-row" v-if="side.labels.length">
        <span class="side-details-row-header">Labels:</span>
        <v-chip-group column>
            <v-chip v-for="label in side.labels" :key="label._id" :style="label.color">
                <router-link :to="`/label/${label._id}`">
                    {{ label.name }}
                </router-link>
            </v-chip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.refs.length">
        <v-expansion-panels flat>
            <v-expansion-panel>
                <v-expansion-panel-header class="pa-0">
                    <span class="side-details-row-header">References table:</span>    
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pa-0">
                    <reference-table
                        class="ref-table"
                        :references="side.refs"
                    />
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
    <div class="side-details-row ref-table" v-if="side.dBankRefs.length">
        <v-expansion-panels flat>
            <v-expansion-panel>
                <v-expansion-panel-header class="pa-0">
                    <span class="side-details-row-header">DrugBank's references table:</span>    
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pa-0">
                    <d-bank-reference-table
                        class="d-bank-ref-table"
                        :refs="side.dBankRefs"
                    />
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
    <v-divider />
    <div class="side-details-row" v-if="side.externalLinks.length">
        <v-expansion-panels flat>
            <v-expansion-panel>
                <v-expansion-panel-header class="pa-0">
                    <span class="side-details-row-header">External links:</span>    
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pa-0">
                    <v-list>
                        <v-list-item
                            v-for="(link ,idx) in side.externalLinks"
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
        <pharmacology-details :pharmacology="side.pharmacology">
            <template #header>
                <v-expansion-panel-header class="pa-0">
                    <span class="side-details-row-header">Pharmacology:</span>    
                </v-expansion-panel-header>
            </template>
        </pharmacology-details>
        <div class="side-details-row" v-if="side.foodInteractions.length">
            <v-expansion-panels flat>
                <v-expansion-panel>
                    <v-expansion-panel-header class="pa-0">
                        <span class="side-details-row-header">Food interactions:</span>    
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="pa-0">
                        <v-list>
                            <v-list-item
                                v-for="(interaction ,idx) in side.foodInteractions"
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
        </div>
    </div>
  </v-card>
</section>
</template>

<script>
import labelPathList from '@/cms/cmps/material/details/LabelPathList';
import referenceTable from '@/cms/cmps/common/ReferenceTable';
import dBankReferenceTable from '@/cms/cmps/common/DBankRefsTable';
import pharmacologyDetails from '@/cms/cmps/material/details/PharmacologyDetails';

export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            side: null
        }
    },
    watch: {
        id: {
            handler() {
                this.loadSide();
            },
            immediate: true
        }
    },
    methods: {
        async loadSide() {
            const { id } = this.$props;
            if (id) {
                const material = await this.$store.dispatch({ type: 'loadMaterial', matId: id });
                this.side = material;
            }
        }
    },
    components: {
        labelPathList,
        referenceTable,
        dBankReferenceTable,
        pharmacologyDetails
    }
}
</script>
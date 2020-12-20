<template>
    <section class="dbank-material-details" v-if="material">
        <v-card elevation="0">
            <v-card-title class="px-0 pr-4 justify-space-between">
                <span>
                    <v-avatar left class="mr-2" size="20">
                        <v-img
                            :src="require(`@/assets/icons/${material.type}.svg`)"
                        ></v-img>
                    </v-avatar>
                    {{ material.name }}
                </span>
                <img :src="require(`@/assets/drugbank.png`)" alt="DrugBank logo" />
            </v-card-title>

            <div class="dbank-material-details-row" v-if="material.drugBankId">
                <span class="dbank-material-details-row-header text-capitalize">DrugBank id:</span>
                {{ material.drugBankId }}
            </div>

            <div class="dbank-material-details-row" v-if="material.updatedAt">
                <span class="dbank-material-details-row-header text-capitalize">Updated at:</span>
                {{ material.updatedAt | moment('MMM Do YYYY') }}
            </div>

            <div class="dbank-material-details-row" v-if="material.fdaLabelLink">
                <span class="dbank-material-details-row-header text-capitalize">FDA label link:</span>
                <a :href="material.fdaLabelLink" target='_blank'>
                    {{ material.fdaLabelLink }}
                </a>
            </div>

            <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.desc">
                <v-expansion-panel>
                    <v-expansion-panel-header class="pa-0">
                        <span class="dbank-material-details-row-header text-capitalize">Description:</span>
                        <span @click.stop="" class="dbank-material-details-row-toggle">
                            <v-checkbox 
                                on-icon="mdi-database-import"
                                off-icon="mdi-database-import-outline"
                                color="primary"
                                @change.self="toggleFieldForExport($event, 'desc')" 
                            />
                        </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content
                        class="dbank-material-details-row-expand-content"
                        v-html="material.desc" 
                    />
                </v-expansion-panel>
            </v-expansion-panels>

            <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.brands.length">
                <v-expansion-panel>
                    <v-expansion-panel-header class="pa-0">
                        <span class="dbank-material-details-row-header text-capitalize">Brands:</span>
                        <span @click.stop="" class="dbank-material-details-row-toggle">
                            <v-checkbox 
                                on-icon="mdi-database-import"
                                off-icon="mdi-database-import-outline"
                                color="primary"
                                @change.self="toggleFieldForExport($event, 'brands')" 
                            />
                        </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-chip-group column>
                            <v-chip
                                v-for="(brand, idx) in material.brands"
                                :key="idx"
                            >
                                {{ brand }}
                            </v-chip>
                        </v-chip-group>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
            
            <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.aliases.length">
                <v-expansion-panel>
                    <v-expansion-panel-header class="pa-0">
                        <span class="dbank-material-details-row-header text-capitalize">Aliases:</span>
                        <span @click.stop="" class="dbank-material-details-row-toggle">
                            <v-checkbox 
                                on-icon="mdi-database-import"
                                off-icon="mdi-database-import-outline"
                                color="primary"
                                @change.self="toggleFieldForExport($event, 'aliases')" 
                            />
                        </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-chip-group column>
                            <v-chip
                                v-for="(alias, idx) in material.aliases"
                                :key="idx"
                            >
                                {{ alias }}
                            </v-chip>
                        </v-chip-group>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

            <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.indications.length">
                <v-expansion-panel>
                    <v-expansion-panel-header class="pa-0">
                        <span class="dbank-material-details-row-header text-capitalize">Indications:</span>
                        <span @click.stop="" class="dbank-material-details-row-toggle">
                            <v-checkbox 
                                on-icon="mdi-database-import"
                                off-icon="mdi-database-import-outline"
                                color="primary"
                                @change.self="toggleFieldForExport($event, 'indications')" 
                            />
                        </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-chip-group column>
                            <v-chip
                                v-for="(indication, idx) in material.indications"
                                :key="idx"
                            >
                                {{ indication }}
                            </v-chip>
                        </v-chip-group>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

            <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.regions.length">
                <v-expansion-panel>
                    <v-expansion-panel-header class="pa-0">
                        <span class="dbank-material-details-row-header text-capitalize">Regions:</span>
                        <span @click.stop="" class="dbank-material-details-row-toggle">
                            <v-checkbox 
                                on-icon="mdi-database-import"
                                off-icon="mdi-database-import-outline"
                                color="primary"
                                @change.self="toggleFieldForExport($event, 'regions')" 
                            />
                        </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-chip-group column>
                            <v-chip
                                v-for="(region, idx) in material.regions"
                                :key="idx"
                            >
                                {{ region }}
                            </v-chip>
                        </v-chip-group>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

            <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.structuredAdverseEffects.length">
                <v-expansion-panel>
                    <v-expansion-panel-header class="pa-0">
                        <span class="dbank-material-details-row-header text-capitalize">Structured adverse effects:</span>
                        <span @click.stop="" class="dbank-material-details-row-toggle">
                            <v-checkbox 
                                on-icon="mdi-database-import"
                                off-icon="mdi-database-import-outline"
                                color="primary"
                                @change.self="toggleFieldForExport($event, 'structuredAdverseEffects')" 
                            />
                        </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-chip-group column>
                            <v-chip
                                v-for="(effect, idx) in material.structuredAdverseEffects"
                                :key="idx"
                            >
                                {{ effect }}
                            </v-chip>
                        </v-chip-group>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

            <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.structuredContraIndications.length">
                <v-expansion-panel>
                    <v-expansion-panel-header class="pa-0">
                        <span class="dbank-material-details-row-header text-capitalize">Structured contra indications:</span>
                        <span @click.stop="" class="dbank-material-details-row-toggle">
                            <v-checkbox 
                                on-icon="mdi-database-import"
                                off-icon="mdi-database-import-outline"
                                color="primary"
                                @change.self="toggleFieldForExport($event, 'structuredContraIndications')" 
                            />
                        </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-chip-group column>
                            <v-chip
                                v-for="(indication, idx) in material.structuredContraIndications"
                                :key="idx"
                            >
                                {{ indication }}
                            </v-chip>
                        </v-chip-group>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

            <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.atcPaths.length">
                <v-expansion-panel>
                    <v-expansion-panel-header class="pa-0">
                        <span class="dbank-material-details-row-header text-capitalize">ATC parent id's:</span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-chip-group column>
                            <v-chip
                                v-for="(atcId, idx) in material.atcPaths"
                                :key="idx"
                            >
                                {{ atcId }}
                            </v-chip>
                        </v-chip-group>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

            <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.externalLinks.length">
                <v-expansion-panel>
                    <v-expansion-panel-header class="pa-0">
                        <span class="dbank-material-details-row-header text-capitalize">External links:</span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-list-item 
                            two-line
                            v-for="(link, idx) in material.externalLinks"
                            :key="idx"
                        >
                        <v-list-item-content>
                            <v-list-item-title>{{ link.resource }}</v-list-item-title>
                            <v-list-item-subtitle>
                                <a :href="link.url" target='_blank'>
                                    {{ link.url }}
                                </a>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        </v-list-item>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

            <div v-if="material.drugBankInfo">
                <span class="dbank-material-details-row-header --main text-capitalize">Pharmacology (DrugBank's):</span>
                <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.drugBankInfo.indication">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="pa-0">
                            <span class="dbank-material-details-row-header --sub text-capitalize">
                                Indication:
                            </span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            {{ material.drugBankInfo.indication }}
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.drugBankInfo.pharmacodynamics">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="pa-0">
                            <span class="dbank-material-details-row-header --sub text-capitalize">Pharmacodynamics:</span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            {{ material.drugBankInfo.pharmacodynamics }}
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.drugBankInfo.mechanism_of_action">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="pa-0">
                            <span class="dbank-material-details-row-header --sub text-capitalize">Mechanism of action:</span>
                            <span @click.stop="" class="dbank-material-details-row-toggle">
                                <v-checkbox 
                                    on-icon="mdi-database-import"
                                    off-icon="mdi-database-import-outline"
                                    color="primary"
                                    @change.self="toggleFieldForExport($event, 'mechanism_of_action')" 
                                />
                            </span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            {{ material.drugBankInfo.mechanism_of_action }}
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.drugBankInfo.absorption">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="pa-0">
                            <span class="dbank-material-details-row-header --sub text-capitalize">Absorption:</span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            {{ material.drugBankInfo.absorption }}
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.drugBankInfo.toxicity">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="pa-0">
                            <span class="dbank-material-details-row-header --sub text-capitalize">Toxicity:</span>
                            <span @click.stop="" class="dbank-material-details-row-toggle">
                                <v-checkbox 
                                    on-icon="mdi-database-import"
                                    off-icon="mdi-database-import-outline"
                                    color="primary"
                                    @change.self="toggleFieldForExport($event, 'toxicity')" 
                                />
                            </span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            {{ material.drugBankInfo.toxicity }}
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.drugBankInfo.protein_binding">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="pa-0">
                            <span class="dbank-material-details-row-header --sub text-capitalize">Protein binding:</span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            {{ material.drugBankInfo.protein_binding }}
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.drugBankInfo.metabolism">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="pa-0">
                            <span class="dbank-material-details-row-header --sub text-capitalize">Metabolism:</span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            {{ material.drugBankInfo.metabolism }}
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.drugBankInfo.half_life">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="pa-0">
                            <span class="dbank-material-details-row-header --sub text-capitalize">Half life:</span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            {{ material.drugBankInfo.half_life }}
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.drugBankInfo.route_of_elimination">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="pa-0">
                            <span class="dbank-material-details-row-header --sub text-capitalize">Route of elimination:</span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            {{ material.drugBankInfo.route_of_elimination }}
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.drugBankInfo.volume_of_distribution">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="pa-0">
                            <span class="dbank-material-details-row-header --sub text-capitalize">Volume of distribution:</span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            {{ material.drugBankInfo.volume_of_distribution }}
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.drugBankInfo.clearance">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="pa-0">
                            <span class="dbank-material-details-row-header --sub text-capitalize">Clearance:</span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            {{ material.drugBankInfo.clearance }}
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-btn
                    color="primary"
                    :disabled="!isDataValid"
                    @click="emitDrugBankData"
                >
                    Import
                </v-btn>

            </div>
        </v-card>
    </section>
</template>

<script>
export default {
    props: {
        material: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            drugBankData: {
                desc: '',
                toxicity: '',
                mechanism_of_action: '',
                structuredAdverseEffects: [],
                structuredContraIndications: [],
                brands: [],
                aliases: [],
                indications: [],
                regions: []
            }
        }
    },
    computed: {
        isDataValid() {
            const values = Object.values(this.drugBankData);
            for (let i = 0; i < values.length; i++) {
                if (typeof values[i] === 'string' && values[i]) return true;
                else if (Array.isArray(values[i]) && values[i].length) return true;
            }
            return false;
        },
        relevantData() {
            return Object.keys(this.drugBankData).reduce((acc, key) => { 
                if (typeof this.drugBankData[key] === 'string' && this.drugBankData[key]) {
                    if (key === 'mechanism_of_action') {
                        acc['mechanismOfAction'] = `<p>${this.drugBankData[key]}</p>`;
                    } else if (key === 'desc') {
                        acc[key] = this.drugBankData[key];
                    } else {
                        acc[key] = `<p>${this.drugBankData[key]}</p>`;
                    }
                } else if (Array.isArray(this.drugBankData[key]) && this.drugBankData[key].length) {
                    if (key === 'structuredAdverseEffects') {
                        acc['adverseReactions'] = `<p>${this.drugBankData[key].join(', ')}</p>`;
                    } else if (key === 'structuredContraIndications') {
                        acc['contraindications'] = `<p>${this.drugBankData[key].join(', ')}</p>`;
                    } else {
                        acc[key] = [ ...this.drugBankData[key] ];
                    }
                }
                return acc;
            }, {});
        }
    },
    methods: {
        toggleFieldForExport(doExport, field) {
            const obj = (field === 'toxicity' || field === 'mechanism_of_action') ? this.material.drugBankInfo : this.material;
            const drugBankData = (typeof obj[field] === 'string') ? obj[field] : [ ...obj[field] ];
            this.drugBankData[field] = (doExport) ? drugBankData : '';
        },
        emitDrugBankData() {
            this.$emit('drugbank-data-export', this.relevantData);
        }
    }
}
</script>
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
                <a :href="material.fdaLabelLink" target='_blank' class="ref-link">
                    {{ material.fdaLabelLink }}
                </a>
            </div>

            <v-expansion-panels class="dbank-material-details-row expandable" v-if="material.desc">
                <v-expansion-panel>
                    <v-expansion-panel-header class="pa-0">
                        <span class="dbank-material-details-row-header text-capitalize">Description:</span>
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
                                <a :href="link.url" target='_blank' class="ref-link">
                                    {{ link.url }}
                                </a>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        </v-list-item>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

            <!-- TO BE REMOVED -->
            <pre>
                {{ material.drugBankInfo }}
            </pre>
            <!-- TO BE REMOVED -->
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
    }
}
</script>
<template>
    <v-expansion-panels flat>
        <v-expansion-panel>
            <slot name="header" />
            <v-expansion-panel-content>
                <h6 v-if="pharmacology.indication">Indication:</h6>
                <p
                    class="mb-4"
                    v-if="pharmacology.indication"
                    v-html="pharmacology.indication"
                />

                <h6 v-if="pharmacology.pharmacodynamics">
                    Pharmacodynamics:
                </h6>
                <p
                    class="mb-4"
                    v-if="pharmacology.pharmacodynamics"
                    v-html="pharmacology.pharmacodynamics"
                />

                <h6 v-if="pharmacology.mechanismOfAction">
                    Mechanism Of Action:
                </h6>
                <p
                    class="mb-4"
                    v-if="pharmacology.mechanismOfAction"
                    v-html="pharmacology.mechanismOfAction"
                />

                <h6 v-if="pharmacology.absorption">Absorption:</h6>
                <p
                    class="mb-4"
                    v-if="pharmacology.absorption"
                    v-html="pharmacology.absorption"
                />

                <h6 v-if="pharmacology.toxicity">Toxicity:</h6>
                <p
                    class="mb-4"
                    v-if="pharmacology.toxicity"
                    v-html="pharmacology.toxicity"
                />

                <h6 v-if="pharmacology.proteinBinding">
                    Protein Binding:
                </h6>
                <p
                    class="mb-4"
                    v-if="pharmacology.proteinBinding"
                    v-html="pharmacology.proteinBinding"
                />

                <h6 v-if="pharmacology.metabolism">Metabolism:</h6>
                <p
                    class="mb-4"
                    v-if="pharmacology.metabolism"
                    v-html="pharmacology.metabolism"
                />

                <h6 v-if="pharmacology.halfLife">Half Life:</h6>
                <p
                    class="mb-4"
                    v-if="pharmacology.halfLife"
                    v-html="pharmacology.halfLife"
                />

                <h6 v-if="pharmacology.routeOfElimination">
                    Route Of Elimination:
                </h6>
                <p
                    class="mb-4"
                    v-if="pharmacology.routeOfElimination"
                    v-html="pharmacology.routeOfElimination"
                />

                <h6 v-if="pharmacology.volumeOfDistribution">
                    Volume Of Distribution:
                </h6>
                <p
                    class="mb-4"
                    v-if="pharmacology.volumeOfDistribution"
                    v-html="pharmacology.volumeOfDistribution"
                />

                <h6 v-if="pharmacology.clearance">Clearance:</h6>
                <p
                    class="mb-4"
                    v-if="pharmacology.clearance"
                    v-html="pharmacology.clearance"
                />
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
export default {
    props: {
        pharmacology: {
            type: Object,
            required: true
        }
    }
};
</script>
<template>
    <section class="result-expand-preview">
        <v-expansion-panels flat class="result-expand-preview-panel">
            <v-expansion-panel v-for="(atcGroup, idx) in atcGroups" :key="idx">
                <v-expansion-panel-header
                    class="result-expand-preview-panel-header pa-0"
                    disable-icon-rotate
                    hide-actions
                >
                <v-chip
                    class="result-expand-preview-panel-chip mb-4"
                    outlined
                    active-class="chip-active"
                    :color="getInteractionColor(interaction)"
                >
                    {{ atcGroup.name }}
                <v-icon small class="ml-2">mdi-family-tree</v-icon>
              </v-chip>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-chip-group>
                        <v-chip
                            class="mb-4"
                            v-for="vInteraction in atcGroup.vInteractions"
                            :key="vInteraction.side2Material._id"
                            outlined
                            :color="getInteractionColor(vInteraction)"
                        >
                            <router-link 
                                class="results-list-link"
                                :to="`/interaction/${vInteraction._id}/${vInteraction.side2Material._id}`" 
                            >
                                {{ `${vInteraction.side1Material.name} & ${vInteraction.side2Material.name}` }}
                            </router-link>
                        </v-chip>
                    </v-chip-group>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </section>
</template>

<script>
export default {
    data() {
        return {
            vInteractions: [],
        };
    },
    props: {
        interaction: {
            type: Object,
            required: true,
        },
    },
    computed: {
        atcGroups() {
            const atcGroupVinteractionMap = this.vInteractions.reduce(
                (acc, vinteraction) => {
                    vinteraction.atcParentGroups.forEach((atcGroup) => {
                        const atcGroupName = atcGroup
                            .split(' ')
                            .splice(1)
                            .join(' ');
                        if (!acc[atcGroupName]) {
                            acc[atcGroupName] = [];
                        }
                        if (
                            !acc[atcGroupName].includes(vinteraction.drugBankId)
                        ) {
                            acc[atcGroupName].push(vinteraction.drugBankId);
                        }
                    });
                    return acc;
                },
                {}
            );

            return Object.keys(atcGroupVinteractionMap).reduce(
                (acc, atcGroup) => {
                    const drugBankIds = atcGroupVinteractionMap[atcGroup];
                    if (drugBankIds.length > 1) {
                        let vInteractions = [];
                        drugBankIds.forEach((drugBankId) => {
                            const matching = this.vInteractions.filter(
                                (vinteraction) =>
                                    vinteraction.drugBankId === drugBankId
                            );
                            vInteractions = [...vInteractions, ...matching];
                        });
                        acc.push({ name: atcGroup, vInteractions });
                    }
                    return acc;
                },
                []
            );
        },
    },
    methods: {
        async getRelatedMaterials() {
            const { interaction } = this;
            const labelId = interaction.side2Label._id;
            const criteria = { limit: 0, labelId };
            const relatedMaterials = await this.$store.dispatch({
                type: 'getMaterials',
                criteria,
            });
            this.vInteractions = relatedMaterials.map(
                ({ _id, name, type, atcPaths, drugBankId }) => {
                    return {
                        _id: interaction._id,
                        side1Material: interaction.side1Material,
                        side2Material: {
                            _id,
                            name,
                            type,
                        },
                        side2Label: null,
                        recommendation: interaction.recommendation,
                        isVirual: true,
                        drugBankId,
                        atcParentGroups: atcPaths
                            .map((atcPath) =>
                                atcPath.filter((path, idx) => idx === 3)
                            )
                            .flat(1),
                    };
                }
            );
        },
        getInteractionColor({ recommendation }) {
            switch (recommendation.toLowerCase()) {
                case 'avoid coadministration':
                case 'coadministration is not advised':
                    return 'error';
                case 'caution should be taken':
                case 'coadministration is not contraindicated but caution should be taken':
                case 'coadministration is possible but caution should be taken':
                    return 'warning';
                case 'coadministration is not contraindicated':
                case 'coadministration is possible':
                case 'coadministration is advised':
                    return 'success';
                default:
                    return 'primary';
            }
        },
    },
    created() {
        this.getRelatedMaterials();
    },
};
</script>
<template>
    <section class="result-expand-preview">
        <v-expansion-panels flat class="result-expand-preview-panel" accordion >
            <v-expansion-panel v-for="(atcGroup, idx) in atcGroupedVinteractions" :key="idx">
                <v-expansion-panel-header
                    class="result-expand-preview-panel-header pa-0"
                    disable-icon-rotate
                    hide-actions
                >
                <v-chip
                    class="result-expand-preview-panel-chip mb-4"
                    outlined
                    active-class="chip-active"
                    color="grey darken-1"
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
                            v-recommendation-color:[interaction.recommendation]
                        >
                            <router-link 
                                class="results-list-link"
                                :to="`/interaction/${vInteraction._id}/${vInteraction.side2Material._id}`" 
                            >
                                {{ `${vInteraction.side1Material.name} & ${vInteraction.side2Material.name}` }}
                            </router-link>
                        </v-chip>
                    </v-chip-group>
                    <v-divider inset />
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-chip-group>
            <v-chip
                class="mb-4"
                v-for="vInteraction in restOfVinteractions"
                :key="vInteraction.side2Material._id"
                outlined
                v-recommendation-color:[interaction.recommendation]
            >
                <router-link 
                    class="results-list-link"
                    :to="`/interaction/${vInteraction._id}/${vInteraction.side2Material._id}`" 
                >
                    {{ `${vInteraction.side1Material.name} & ${vInteraction.side2Material.name}` }}
                </router-link>
            </v-chip>
        </v-chip-group>
        <v-progress-circular 
            class="result-expand-preview-loader"
            v-if="isLoading" 
            color="grey darken-1"
            indeterminate 
        />
        <v-divider v-else />
    </section>
</template>

<script>
export default {
    data() {
        return {
            vInteractions: [],
            isLoading: false
        };
    },
    props: {
        interaction: {
            type: Object,
            required: true,
        },
    },
    computed: {
        atcGroupVinteractionMap() {
            return this.vInteractions.reduce((acc, vinteraction) => {
                vinteraction.atcParentGroups.forEach((atcGroup) => {
                    const atcGroupName = atcGroup.split(' ').splice(1).join(' ');
                    if (!acc[atcGroupName]) {
                        acc[atcGroupName] = [];
                    }
                    if (!acc[atcGroupName].includes(vinteraction.side2Material._id)) {
                        acc[atcGroupName].push(vinteraction.side2Material._id);
                    }
                });
                return acc;
            }, {});
        },
        atcGroupedVinteractions() {
            return Object.keys(this.atcGroupVinteractionMap).reduce(
                (acc, atcGroup) => {
                    const ids = this.atcGroupVinteractionMap[atcGroup];
                    if (ids.length > 1) {
                        let vInteractions = [];
                        ids.forEach((id) => {
                            const matching = this.vInteractions.filter(vinteraction => vinteraction.side2Material._id === id);
                            vInteractions = vInteractions.concat(matching);
                        });
                        acc.push({ name: atcGroup, vInteractions });
                    }
                    return acc;
            }, []);
        },
        restOfVinteractions() {
            const seenDbankIdsMap = {};
            return Object.keys(this.atcGroupVinteractionMap).reduce(
                (acc, atcGroup) => {
                    const ids = this.atcGroupVinteractionMap[atcGroup];
                    if (ids.length === 1 && !seenDbankIdsMap[ids[0]]) {
                        const vInteractions = this.vInteractions.filter(vint => vint.side2Material._id === ids[0]);
                        acc = acc.concat(vInteractions);

                        seenDbankIdsMap[ids[0]] = true;
                    }
                    return acc;
            }, []);
        }
    },
    methods: {
        async getRelatedMaterials() {
            this.isLoading = true;
            const { interaction } = this;
            const labelId = interaction.side2Label._id;
            const criteria = { limit: 0, page: 0, labelId };
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
                        isVirtual: true,
                        side2DraftName: interaction.side2DraftName,
                        drugBankId,
                        atcParentGroups: atcPaths.map((atcPath) => atcPath.filter((path, idx) => idx === 3)).flat(1),
                    };
                }
            );
            this.isLoading = false;
        }
    },
    created() {
        this.getRelatedMaterials();
    }
};
</script>
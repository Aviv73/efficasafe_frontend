<template>
    <section class="search-engine">
        <div class="container">
            <v-card>
                <header class="search-engine-search">
                    <v-card-title class="text-capitalize px-0">
                        Search engine
                    </v-card-title>
                    <autocomplete
                        class="search-engine-header-search-field"
                        :isSoloInverted="true"
                        color="white"
                        @emitAutocomplete="addMaterial"
                    />
                </header>
                <v-divider />
                <main class="search-engine-results">
                    <div class="search-engine-results-materials px-6 py-4">
                        <v-chip-group column>
                            <v-chip
                                class="mb-4"
                                v-for="{ material } in results"
                                :key="material._id"
                                close
                                outlined
                                :color="
                                    material.type === 'herb'
                                        ? 'success'
                                        : 'primary'
                                "
                                @click:close="removeMaterial(material._id)"
                            >
                                <v-avatar left class="mr-2">
                                    <v-img
                                        :src="
                                            require(`@/assets/icons/${material.type}.svg`)
                                        "
                                    ></v-img>
                                </v-avatar>
                                {{ material.name | material-name }}
                            </v-chip>
                        </v-chip-group>
                    </div>
                    <v-divider vertical />
                    <div class="search-engine-results-interactions">
                        <v-tabs 
                            background-color="white"
                            light
                            fixed-tabs
                            optional
                        >
                            <v-tab :to="{ name: 'Results', query: this.$route.query }">
                                Herb to drug
                            </v-tab>
                            <v-tab :to="{ name: 'DBankResults', query: this.$route.query }">
                                Drug to drug
                            </v-tab>
                        </v-tabs>
                        <router-view 
                            class="px-2 py-4" 
                            :isLoading="isLoading"
                            :interactions="relevantInteractions"
                            :dBankInteractions="sortedDbankInteractions"
                        />
                    </div>
                </main>
            </v-card>
            <icons-map />
        </div>
    </section>
</template>

<script>
import { eventBus, EV_clear_autocomplete } from '@/services/eventBus.service';
import { interactionService } from '@/services/interaction.service';
import autocomplete from '@/cmps/Autocomplete';
import iconsMap from '@/cmps/general/IconsMap';

export default {
    recommendationOrderMap: interactionService.getRecommendationOrderMap(),
    data() {
        return {
            results: [],
            dBankInteractions: [],
            isLoading: false
        };
    },
    watch: {
        '$route'(to, from) {
            if (JSON.stringify(from.query) !== JSON.stringify(to.query)) {
                this.getResults();
            }
            if (this.$route.name === 'DBankResults' && from.name !== to.name) {
                this.getDBankResults();
            }
        },
        'results.length'() {
            if (this.$route.name === 'DBankResults') {
                this.getDBankResults();
            }
        }
    },
    computed: {
        relevantInteractions() {
            if (!this.results.length) return [];
            if (this.results.length === 1) {
                return this.getSortedResults(this.results[0].interactions);
            }
            const relevantIdsCountMap = this.results.reduce((acc, { interactions }) => {
                interactions.forEach(interaction => {
                    if (!acc[interaction._id]) acc[interaction._id] = 1;
                    else acc[interaction._id]++;
                });
                return acc;
            }, {});
            const relevantResults = this.results.reduce((acc, { interactions }) => {
                interactions.forEach(interaction => {
                    if (relevantIdsCountMap[interaction._id] > 1 && (acc.findIndex(int => int._id === interaction._id) === -1)) {
                        if (interaction.side2Label) {
                            const materials = this.results.filter(({ material }) => material.labelIds.includes(interaction.side2Label._id)).map(res => res.material);
                            materials.forEach(material => {
                                const vinteraction = {
                                    _id: interaction._id,
                                    side1Material: interaction.side1Material,
                                    side2Material: {
                                        _id: material._id,
                                        name: material.name,
                                        type: material.type
                                    },
                                    side2Label: null,
                                    recommendation: interaction.recommendation,
                                    isVirtual: true,
                                    side2DraftName: interaction.side2DraftName,
                                    evidenceLevel: interaction.evidenceLevel
                                };
                                acc.push(vinteraction);
                            });
                        } else acc.push(interaction);
                    }
                });
                return acc;
            }, []);
            return this.getSortedResults(relevantResults);
        },
        sortedDbankInteractions() {
            return this.dBankInteractions.slice().sort((a, b) => {
                return this.$options.recommendationOrderMap[a.recommendation.toLowerCase()] - this.$options.recommendationOrderMap[b.recommendation.toLowerCase()]
                || b.evidence_level - a.evidence_level
                || this.getDBankInteractionName(a).toLowerCase().localeCompare(this.getDBankInteractionName(b).toLowerCase());
            });
        }
    },
    methods: {
        getSortedResults(results) {
            return results.slice().slice().sort((a, b) => {
                return this.$options.recommendationOrderMap[a.recommendation.toLowerCase()] - this.$options.recommendationOrderMap[b.recommendation.toLowerCase()]
                || a.evidenceLevel.toLowerCase().localeCompare(b.evidenceLevel.toLowerCase())
                || this.getInteractionName(a).toLowerCase().localeCompare(this.getInteractionName(b).toLowerCase());
            });
        },
        async getDBankResults() {
            this.isLoading = true;
            if (!this.results.length) {
                this.isLoading = false;
                this.dBankInteractions = [];
                return;
            }
            const drugBankIds = this.results.reduce((acc, { material: { drugBankId } }) => {
                if (drugBankId && !acc.includes(drugBankId)) acc.push(drugBankId);
                return acc;
            }, []);
            const drugBankId = (drugBankIds.length === 1) ? drugBankIds[0] : drugBankIds;
            const criteria = { drugBankId };
            this.dBankInteractions = await this.$store.dispatch({ type: 'getDBankInteractions', criteria });
            this.isLoading = false;
        },
        async getResults() {
            this.isLoading = true;
            if (!this.$route.query.materialId) {
                this.results = [];
                this.isLoading = false;
                return;
            }
            const criteria = {
                page: 0,
                limit: 0,
                materialId: this.$route.query.materialId,
            };
            const materials = await this.$store.dispatch({
                type: 'getMaterials',
                criteria
            });
            const results = materials.map(
                async ({ _id, labels, name, type, drugBankId }) => {
                    const ids = labels.map((label) => label._id);
                    const filterBy = { limit: 0, page: 0, id: [ _id, ...ids ] };
                    const interactions = await this.$store.dispatch({
                        type: 'getInteractions',
                        filterBy,
                    });
                    return {
                        material: {
                            _id,
                            name,
                            type,
                            labelIds: ids,
                            drugBankId
                        },
                        interactions: interactions.filter(interaction => interaction.isActive).map(
                            ({ _id, side1Material, side2Material, side2Label, recommendation, evidenceLevel, side2DraftName }) => {
                            return {
                                _id,
                                side1Material,
                                side2Material,
                                side2Label,
                                recommendation,
                                isVirtual: false,
                                side2DraftName,
                                evidenceLevel
                            }
                        })
                    };
                }
            );
            this.results = await Promise.all(results);
            this.isLoading = false;
        },
        addMaterial(material) {
            if (!material) return;
            if (this.$route.query.materialId) {
                if (!this.isQueryExists(material._id)) {
                    const ids = [...this.$route.query.materialId, material._id];
                    this.$router.replace({ query: { materialId: ids } });
                }
            } else {
                this.$router.push({ query: { materialId: [ material._id ] } });
            }
            eventBus.$emit(EV_clear_autocomplete);
        },
        removeMaterial(matId) {
            const ids = this.$route.query.materialId.filter(
                (id) => id !== matId
            );
            this.$router.replace({ query: { materialId: ids } });
        },
        isQueryExists(matId) {
            return this.$route.query.materialId.includes(matId);
        },
        getInteractionName(interaction) {
            if (interaction.side2Material) {
                return `${interaction.side1Material.name} & ${interaction.side2Material.name}`
            }
            return interaction.side2Label.name;
        },
        getDBankInteractionName(interaction) {
            return `${interaction.subject_drug.name} & ${interaction.affected_drug.name}`;
        }
    },
    created() {
        if (!Array.isArray(this.$route.query.materialId) && this.$route.query.materialId) {
            this.$route.query.materialId = [ this.$route.query.materialId ];
        }
        this.getResults();
    },
    components: {
        autocomplete,
        iconsMap
    },
};
</script>
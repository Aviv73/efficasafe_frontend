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
                    <div class="search-engine-results-materials px-4 py-3">
                        <v-chip-group column>
                            <v-chip
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
                                {{ material.name }}
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
                        <router-view class="px-2 py-4" :interactions="relevantInteractions" />
                    </div>
                </main>
            </v-card>
            <icons-map />
        </div>
    </section>
</template>

<script>
import autocomplete from '@/cmps/Autocomplete';
import iconsMap from '@/cmps/general/IconsMap';

export default {
    data() {
        return {
            results: []
        };
    },
    watch: {
        '$route.query'() {
            this.getResults();
        }
    },
    computed: {
        relevantInteractions() {
            if (!this.results.length) return [];
            const releventIdsMap = this.results.reduce((acc, { material }) => {
                if (!acc[material._id]) acc[material._id] = true;
                material.labelIds.forEach(labelId => {
                    if (!acc[labelId]) acc[labelId] = true;
                });
                return acc;
            }, {});

            return this.results[0].interactions.filter(interaction => {
                const side2Id = (interaction.side2Material) ? interaction.side2Material._id : (interaction.side2Label) ? interaction.side2Label._id : '';
                return interaction.isActive && (releventIdsMap[interaction.side1Material._id] || releventIdsMap[side2Id]);
            });
        }
    },
    methods: {
        async getResults() {
            if (!this.$route.query.materialId) {
                this.results = [];
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
                        interactions,
                    };
                }
            );
            this.results = await Promise.all(results);
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
    },
    created() {
        if (!Array.isArray(this.$route.query.materialId)) {
            this.$route.query.materialId = [ this.$route.query.materialId ];
        }
        this.getResults();
    },
    components: {
        autocomplete,
        iconsMap,
    },
};
</script>
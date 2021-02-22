<template>
    <section class="search-engine">
        <div class="container">
            <v-card>
                <header class="search-engine-search">
                    <v-card-title class="text-capitalize px-0">
                        Search engine
                    </v-card-title>
                    <search-autocomplete
                        @materials-selected="addMaterials"
                    />
                </header>
                <v-divider />
                <main class="search-engine-results">
                    <div class="search-engine-results-materials px-6 py-4">
                        <v-chip-group column>
                            <v-chip
                                class="mb-4"
                                v-for="material in materials"
                                :key="material._id"
                                close
                                outlined
                                :color="getMaterialColor(material.type)"
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
                        <router-view
                            class="px-2 py-4"
                            :isLoading="isLoading"
                            :materialCount="materialCount"
                            :interactions="formatedInteractions"
                            :pageCount="pageCount"
                            :dBankInteractions="dBankInteractions"
                            :dBankPageCount="dBankPageCount"
                            :featuredInteractions="featuredInteractions"
                            :featuredPageCount="featuredPageCount"
                            @d-bank-page-changed="getDBankInteractions"
                            @page-changed="getInteractions"
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
import searchAutocomplete from '@/cmps/search-engine/SearchAutocomplete';
import iconsMap from '@/cmps/general/IconsMap';

export default {
    data() {
        return {
            materials: [],
            interactions: [],
            pageCount: 0,
            dBankInteractions: [],
            dBankPageCount: 0,
            featuredInteractions: [],
            featuredPageCount: 0,
            isLoading: false
        }
    },
    watch: {
        '$route.query': {
            async handler() {
                const { materialId } = this.$route.query; 
                if (!materialId) return;
                if (!Array.isArray(materialId) && materialId) {
                    this.$route.query.materialId = [ materialId ];
                }
                await this.getMaterials();
                if (this.$route.name === 'Results') this.getInteractions();
                else this.getDBankInteractions();
            },
            deep: true,
            immediate: true
        }
    },
    computed: {
        formatedInteractions() {
            return this.interactions.reduce((acc, interaction) => {
                if (!interaction.side2Label || 
                (this.materials.length === 1 && this.materials[0]._id === interaction.side1Material._id)) acc.push(interaction);
                else {
                    const materials = this.materials.filter(
                        material => material.labels.findIndex(label => label._id === interaction.side2Label._id) !== -1
                    );
                    const vInteractions = materials.map(
                        ({ _id, name, type }) => ({
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
                        })
                    );
                    ///~~ create composed 'interaction', put inside vInteraction and vInteractions[idx]
                    vInteractions.forEach(vInteraction => {
                        const idx = acc.findIndex(vin => vin.side2Material && vin.side2Material._id === vInteraction.side2Material._id);
                        const groupIdx = acc.findIndex(vin => vin._id === `${vInteraction.side1Material._id}-${vInteraction.side2Material._id}`);
                        if (idx === -1 && groupIdx === -1) acc.push(vInteraction);
                        else if (idx !== -1 && groupIdx === -1) {
                            const vInteractionGroup = {
                                _id: `${vInteraction.side1Material._id}-${vInteraction.side2Material._id}`,
                                name: `${vInteraction.side1Material.name} & ${vInteraction.side2Material.name}`,
                                recommendation: this.getMoreSeverRecomm(acc[idx].recommendation, vInteraction.recommendation),
                                vInteractions: [
                                    acc[idx],
                                    vInteraction
                                ]
                            };
                            acc.splice(idx, 1, vInteractionGroup);
                        } else if (groupIdx !== -1 && idx === -1) {
                            acc[groupIdx].vInteractions.push(vInteraction);
                            acc[groupIdx].recommendation = this.getMoreSeverRecomm(acc[groupIdx].recommendation, vInteraction.recommendation);
                        }
                    });
                    // acc = acc.concat(vInteractions);
                }
                return acc;
            }, []);
        },
        materialCount() {
            return (this.$route.query.materialId) ? this.$route.query.materialId.length : 0;
        }
    },
    methods: {
        getMoreSeverRecomm(recomm1, recomm2) {
            const recommendationMap = {
                'avoid coadministration': 3,
                'coadministration is not advised': 3,
                'caution should be taken': 2,
                'coadministration is not contraindicated but caution should be taken': 2,
                'coadministration is possible but caution should be taken': 2,
                'coadministration is not contraindicated': 1,
                'coadministration is possible': 1,
                'coadministration is advised': 1,
                'coadministration is not contraindicated and may even be advised': 1,
                'coadministration is possible and may even be advised': 1
            };
            return (recommendationMap[recomm1.toLowerCase()] > recommendationMap[recomm2.toLowerCase()]) ? recomm1 : recomm2;
        },
        async getDBankInteractions(page = 1) {
            this.isLoading = true;
            const isAllNotDrugs = this.materials.every(material => material.type !== 'drug');
            if (!this.materials.length || isAllNotDrugs) {
                this.dBankInteractions = [];
                this.isLoading = false;
                return;
            }
            const drugBankIds = this.materials.map(mat => mat.drugBankId);
            const drugBankId = (drugBankIds.length === 1) ? drugBankIds[0] : drugBankIds;
            const criteria = { drugBankId, page: --page };
            const { dBankInteractions, pageCount } = await this.$store.dispatch({ type: 'getDBankInteractions', criteria });
            this.dBankInteractions = dBankInteractions;
            this.dBankPageCount = pageCount;
            this.isLoading = false;
        },
        async getInteractions(page = 1) {
            this.isLoading = true;
            const ids = this.materials.reduce((acc, { _id, labels }) => {
                if (!acc.includes(_id)) acc.push(_id);
                labels.forEach(label => {
                    if (!acc.includes(label._id)) acc.push(label._id);
                });
                return acc;
            }, []);
            const filterBy = { isSearchResults: true, page: --page, id: ids, materialCount: this.materials.length };
            const { interactions, pageCount } = await this.$store.dispatch({ type: 'getInteractions', filterBy });
            this.pageCount = pageCount;
            this.interactions = interactions;
            await this.getFeaturedInteractions(page);
            this.isLoading = false;
        },
        async getFeaturedInteractions(page) {
            const DBKIds = this.materials.reduce((acc, { drugBankId }) => {
                if (!acc.includes(drugBankId)) acc.push(drugBankId);
                return acc;
            }, []);
            const filterBy = { page, drugBankId: DBKIds, isSearchResults: true };
            const { featuredInteractions , pageCount } = await this.$store.dispatch({ type: 'getFeaturedInteractions', filterBy });
            this.featuredPageCount = pageCount;
            this.featuredInteractions = featuredInteractions;
        },
        async getMaterials() {
            if (!this.$route.query.materialId || !this.$route.query.materialId.length) {
                this.materials = [];
                this.isLoading = false;
                return;
            }
            const criteria = {
                page: 0,
                limit: 0,
                materialId: this.$route.query.materialId,
            };
            const materials = (await this.$store.dispatch({ type: 'getMaterials', criteria }))
                .map(({  _id, labels, name, type, drugBankId }) => ({  _id, labels, name, type, drugBankId }));
            this.materials = this.sortMaterials(materials);
        },
        sortMaterials(materials) {
            const order = this.$route.query.materialId;
            const res = [];
            order.forEach((id, idx) => {
                res[idx] = materials.find(({ _id }) => _id === id);
            });
            return res;
        },
        addMaterials({ value: materialIds }) {
            materialIds.forEach(id => {
                if (this.$route.query.materialId) {
                    if (!this.isMaterialExists(id)) {
                        const ids = [...this.$route.query.materialId, id];
                        this.$router.replace({ query: { materialId: ids } });
                    }
                } else {
                    this.$router.push({ query: { materialId: [ id ] } });
                }
                eventBus.$emit(EV_clear_autocomplete);
            });
        },
        removeMaterial(materialId) {
            const ids = this.$route.query.materialId.filter(id => id !== materialId);
            this.$router.replace({ query: { materialId: ids } });
        },
        isMaterialExists(matId) {
            return this.$route.query.materialId.includes(matId);
        },
        getMaterialColor(type) {
            switch (type) {
                case 'herb':
                    return 'success';
                case 'drug':
                    return 'primary';
                case 'vitamin':
                    return 'amber';
                case 'mineral':
                    return 'orange';
                case 'amino acid':
                    return 'deep-orange';
                case 'nutraceutical':
                    return 'teal';
                case 'essential oil':
                    return 'cyan';
                case 'food':
                    return 'orange';
            }
        }
    },
    components: {
        searchAutocomplete,
        iconsMap
    }
}
</script>
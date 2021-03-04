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
                            <span
                                v-for="(result, idx) in formatedMaterials"
                                :key="idx"
                            >
                                <v-chip
                                    :class="`mb-4 result-${idx}`"
                                    color="primary"
                                    outlined
                                    close
                                    @click:close="removeMaterials(result.txt)"
                                >
                                    <v-avatar left size="16" v-if="result.materials.length === 1">
                                        <img
                                            :src="require(`@/cms/assets/icons/${result.materials[0].type}.svg`)"
                                        />
                                    </v-avatar>
                                    {{ result.txt }}
                                    <v-icon class="info-icon" v-if="result.materials.length > 1">
                                        mdi-information-variant
                                    </v-icon>
                                </v-chip>
                                <v-tooltip 
                                    class="pa-0" 
                                    v-if="
                                        result.materials.length > 1 || result.txt !== result.materials[0].name
                                    "
                                    bottom 
                                    :activator="`.result-${idx}`"
                                >
                                    <v-list dense flat color="transparent" dark>
                                        <v-subheader class="pa-0">Materials</v-subheader>
                                        <v-list-item
                                            class="d-flex align-center"
                                            v-for="material in result.materials"
                                            :key="material._id"
                                            dense
                                        >
                                            <v-list-item-icon>
                                                <v-avatar class="mr-2" size="24" rounded>
                                                    <v-img
                                                        :src="require(`@/cms/assets/icons/${material.type}.svg`)"
                                                    />
                                                </v-avatar>
                                                <v-list-item-content>
                                                <v-list-item-title>{{ material.name }}</v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item-icon>
                                        </v-list-item>
                                    </v-list>
                                </v-tooltip>
                            </span>
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
                            :msg="msg"
                        />
                    </div>
                </main>
            </v-card>
            <icons-map />
        </div>
    </section>
</template>

<script>
import { eventBus, EV_clear_autocomplete } from '@/cms/services/eventBus.service';
import searchAutocomplete from '@/cms/cmps/search-engine/SearchAutocomplete';
import iconsMap from '@/cms/cmps/general/IconsMap';

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
            isLoading: false,
            msg: 'No results :('
        }
    },
    watch: {
        '$route.query': {
            async handler() {
                const { queries } = this.$route.query; 
                if (!queries) {
                    this.reset();
                    return;
                }
                if (!Array.isArray(queries) && queries) {
                    this.$route.query.queries = [ queries ];
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
        formatedMaterials() {
            const results = this.materials.reduce((acc, material) => {
                const result = acc.find(res => res.txt === material.userQuery);
                if (result) result.materials.push(material);
                else {
                    const newResult = { txt: material.userQuery, materials: [ material ] };
                    acc.push(newResult);
                }
                return acc;
            }, []);
            return results;
        },
        formatedInteractions() {
            if ((this.$route.query.queries && this.$route.query.queries.length) === 1 && this.materials.length > 1) {
                //// it's one 'material' and it's a compound
                this.setMsg('Compound as a single result isn\'t supported, Please provide more material/s');
                return [];
            }
            const formatedInteractions = this.interactions.reduce((acc, interaction) => {
                /// it's the only case we render label interactions as is
                if (this.materials.length === 1 && this.materials[0]._id === interaction.side1Material._id) acc.push(interaction);
                else if (!interaction.side2Label) {
                    /// insert material 2 material interaction
                    this.groupDoubleInteractions(acc, interaction);
                } else {
                    /// format label interactions to vinteractions
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
                    vInteractions.forEach(vInteraction => {
                        this.groupDoubleInteractions(acc, vInteraction);
                    });
                }
                return acc;
            }, []);
            const queryApearanceMap = {};
            return formatedInteractions.reduce((acc, interaction) => {
                let side1Name = '';
                let side2Name = '';
                if (interaction.name) {
                    [ side1Name, side2Name ] = interaction.name.split('&').map(str => str.trim());
                } else {
                    side1Name = interaction.side1Material.name;
                    side2Name = interaction.side2Material.name;
                }
                const userQuery = this.$store.getters.materialNamesMap[side2Name];
                if (!queryApearanceMap[`${side1Name}-${userQuery}`]) {
                    queryApearanceMap[`${side1Name}-${userQuery}`] = interaction;
                    acc.push(interaction);
                } else {
                    const compoundGroup = {
                        _id: `${queryApearanceMap[`${side1Name}-${userQuery}`]._id}-${interaction._id}`,
                        name: `${side1Name}-${userQuery}`,
                        recommendation: this.getMoreSeverRecomm(queryApearanceMap[`${side1Name}-${userQuery}`].recommendation, interaction.recommendation),
                        vInteractions: [
                            queryApearanceMap[`${side1Name}-${userQuery}`],
                            interaction
                        ],
                        isCompoundGroup: true
                    };
                    const existingItemIdx = acc.findIndex(i => i._id === queryApearanceMap[`${side1Name}-${userQuery}`]._id);
                    acc.splice(existingItemIdx, 1, compoundGroup);
                }
                return acc;
            }, []);
        },
        materialCount() {
            return (this.$route.query.queries) ? this.$route.query.queries.length : 0;
        }
    },
    methods: {
        groupDoubleInteractions(acc, interaction) {
            /// index of vinteraction between the same 2 materials
            const idx = acc.findIndex(
                vin => (vin.side2Material && vin.side2Material._id === interaction.side2Material._id) &&
                (vin.side1Material._id === interaction.side1Material._id)
            );
            /// index of a group holding vinteractions between the same 2 materials
            const groupIdx = acc.findIndex(vin => vin._id === `${interaction.side1Material._id}-${interaction.side2Material._id}`);
            if (idx === -1 && groupIdx === -1) acc.push(interaction);
            else if (idx !== -1 && groupIdx === -1) {
                const vInteractionGroup = {
                    _id: `${interaction.side1Material._id}-${interaction.side2Material._id}`,
                    name: `${interaction.side1Material.name} & ${interaction.side2Material.name}`,
                    recommendation: this.getMoreSeverRecomm(acc[idx].recommendation, interaction.recommendation),
                    vInteractions: [
                        acc[idx],
                        interaction
                    ],
                    isCompoundGroup: false
                };
                acc.splice(idx, 1, vInteractionGroup);
            } else {
                acc[groupIdx].vInteractions.push(interaction);
                acc[groupIdx].recommendation = this.getMoreSeverRecomm(acc[groupIdx].recommendation, interaction.recommendation);
            } 
        },
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
            const filterBy = { isSearchResults: true, page: --page, id: ids, materialCount: this.$route.query.queries.length };
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
            if (!this.$route.query.queries || !this.$route.query.queries.length) {
                this.materials = [];
                this.isLoading = false;
                return;
            }
            const criteria = {
                isSearchResults: true,
                q: this.$route.query.queries,
            };
            const materials = (await this.$store.dispatch({ type: 'getMaterials', criteria })).map(
                ({  _id, labels, name, type, drugBankId, userQuery }) => ({  _id, labels, name, type, drugBankId, userQuery })
            );
            this.materials = this.sortMaterials(materials);
            this.$store.commit({ type: 'makeMaterialNamesMap', materials });
        },
        sortMaterials(materials) {
            const { queries } = this.$route.query;
            return materials.sort((a, b) => queries.indexOf(a.userQuery) - queries.indexOf(b.userQuery));
        },
        addMaterials(q) {
            if (this.$route.query.queries) {
                if (!this.isQueryExists(q)) {
                    const queries = [ ...this.$route.query.queries, q ];
                    this.$router.replace({ query: { queries } });
                }
            } else {
                this.$router.push({ query: { queries: [ q ] } });
            }
            eventBus.$emit(EV_clear_autocomplete);
        },
        removeMaterials(userQuery) {
            const queries = this.$route.query.queries.filter(q => q !== userQuery);
            this.$router.replace({ query: { queries } });
        },
        isQueryExists(q) {
            return this.$route.query.queries.indexOf(q) !== -1;
        },
        reset() {
            this.materials = [];
            this.interactions = [];
            this.pageCount = 0;
            this.dBankInteractions = [];
            this.dBankPageCount = 0;
            this.featuredInteractions = [];
            this.featuredPageCount = 0;
            this.isLoading = false;
        },
        setMsg(msg) {
            this.msg = msg;
        }
    },
    components: {
        searchAutocomplete,
        iconsMap
    }
}
</script>
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
                    <div
                        class="search-engine-results-materials px-6 pb-4"
                        :class="{ 'pt-8': !!formatedMaterials.length}"
                    >
                        <v-btn
                            to="/search"
                            v-if="materials.length"
                            title="Clear All"
                            color="error"
                            text
                            rounded
                            small
                        >
                        Clear all
                            <!-- <v-icon small>mdi-close</v-icon> -->
                        </v-btn>
                        <v-chip-group column>
                            <span
                                v-for="(result, idx) in formatedMaterials"
                                :key="idx"
                            >
                                <v-chip
                                    :class="[ `mb-4 result result-${idx}`, { 'ghost': result.isIncluded } ]"
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
                                        result.materials.length > 1 || result.txt !== result.materials[0].name || result.isIncluded
                                    "
                                    bottom 
                                    :activator="`.result-${idx}`"
                                >
                                    <v-list
                                        color="transparent"
                                        dense
                                        flat
                                        dark
                                    >
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
                                    <div
                                        v-if="result.isIncluded"
                                        class="d-flex flex-column align-center"
                                    >
                                        <v-divider class="align-self-stretch" dark />
                                        <v-icon color="error lighten-1" class="my-2">mdi-alert-circle-outline</v-icon>
                                        <p
                                            class="pb-4 text-center error--text text--lighten-1 body-1 font-weight-medium"
                                            style="width: 35ch; margin: 0 auto;"
                                        >
                                            There is no additional interactions for {{ result.materials[0].name }}
                                            as it is a part of {{ getCompoundName(result.materials[0].name, result.txt) }}.
                                        </p>
                                    </div>
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
    recommendationsOrderMap: {
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
    },
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
            return this.materials.reduce((acc, material) => {
                const result = acc.find(res => res.txt === material.userQuery);
                if (result) result.materials.push(material);
                else {
                    const newResult = { 
                        txt: material.userQuery,
                        materials: [ material ],
                        isIncluded: material.isIncluded || false
                    };
                    acc.push(newResult);
                }
                return acc;
            }, []);
        },
        formatedInteractions() {
            if ((this.$route.query.queries && this.$route.query.queries.length) === 1 && this.materials.length > 1) {
                this.setMsg('Compound as a single result isn\'t supported, Please provide more material/s');
                return [];
            }
            /// formatting real interactions into vinteractions if needed & group double vinteractions
            let formatedInteractions = this.interactions.reduce((acc, interaction) => {
                if (this.materials.length === 1 && this.materials[0]._id === interaction.side1Material._id) acc.push(interaction);
                else if (!interaction.side2Label) {
                    this.insertInteraction(acc, interaction);
                } else {
                    const materials = this.materials.filter(
                        material => material.labels.findIndex(label => label._id === interaction.side2Label._id) !== -1
                    );
                    materials.forEach(({ _id, name, type }) => {
                        const vInteraction = {
                            _id: interaction._id,
                            side1Material: interaction.side1Material,
                            side2Material: {
                                _id,
                                name,
                                type
                            },
                            side2Label: null,
                            name: `${interaction.side1Material.name} & ${name}`,
                            recommendation: interaction.recommendation,
                            evidenceLevel: interaction.evidenceLevel,
                            isVirtual: true,
                            side2DraftName: interaction.side2DraftName
                        };
                        this.insertInteraction(acc, vInteraction);
                    });
                }
                return acc;
            }, []);
            const queryApearanceMap = {};
            if (this.materials.length === 1) return formatedInteractions;
            /// duplicating vinteractions if needed - for same material in different compounds
            formatedInteractions = formatedInteractions.reduce((acc, interaction) => {
                const { side1Name, side2Name } = this.getInteractionSidesNames(interaction);
                if (
                    this.$store.getters.materialNamesMap[side1Name] && this.$store.getters.materialNamesMap[side1Name].length > 1 ||
                    this.$store.getters.materialNamesMap[side2Name] && this.$store.getters.materialNamesMap[side2Name].length > 1
                    ) {
                        const copy = JSON.parse(JSON.stringify((interaction.vInteractions && interaction.vInteractions.length === 1) ? interaction.vInteractions[0] : interaction));
                        acc.push(copy);
                    } else acc.push(interaction);
                return acc;
            }, []);
            /// group same compound vinteractions under compound's name
            formatedInteractions = formatedInteractions.reduce((acc, interaction) => {
                const { side1Name, side2Name } = this.getInteractionSidesNames(interaction);
                const userQueries = this.$store.getters.materialNamesMap[side2Name];
                if (!userQueries) return acc;
                userQueries.forEach(userQuery => {
                    const queryApearanceCount = this.$store.getters.queryApearanceCount(userQuery);
                    if (!queryApearanceMap[`${side1Name}-${userQuery}`]) {
                        queryApearanceMap[`${side1Name}-${userQuery}`] = [ interaction ];
                        if (queryApearanceCount <= 1) {
                            const includedMaterial = this.materials.find(
                                m => m._id === (interaction.side2Material && interaction.side2Material._id)
                                && m.isIncluded
                            );
                            if (!includedMaterial) acc.push(interaction);
                        } else {
                            const compoundGroup = {
                                _id: interaction._id,
                                name: `${side1Name} & ${userQuery}`,
                                recommendation: interaction.recommendation,
                                evidenceLevel: interaction.evidenceLevel,
                                vInteractions: [
                                    interaction
                                ],
                                isCompoundGroup: true
                            };
                            acc.push(compoundGroup);
                        }
                    } else {
                        const groupIdx = acc.findIndex(item => item._id === `${queryApearanceMap[`${side1Name}-${userQuery}`].map(i => i._id).join('-')}-${interaction._id}`);
                        if (groupIdx === -1) {
                            const compoundGroup = {
                                _id: `${queryApearanceMap[`${side1Name}-${userQuery}`].map(i => i._id).join('-')}-${interaction._id}`,
                                name: `${side1Name} & ${userQuery}`,
                                recommendation: this.getMoreSeverRecomm(...queryApearanceMap[`${side1Name}-${userQuery}`].map(i => i.recommendation), interaction.recommendation),
                                evidenceLevel: this.getMoreSeverEvidenceLevel(...queryApearanceMap[`${side1Name}-${userQuery}`].map(i => i.evidenceLevel), interaction.evidenceLevel),
                                vInteractions: [
                                    ...queryApearanceMap[`${side1Name}-${userQuery}`],
                                ],
                                isCompoundGroup: true
                            };
                            if (compoundGroup.vInteractions.findIndex(i => i._id === interaction._id ) === -1) {
                                if (!interaction.vInteractions || interaction.vInteractions.length > 1) compoundGroup.vInteractions.push(interaction);
                                else if (interaction.vInteractions.length === 1) {
                                    const vInteraction = JSON.parse(JSON.stringify(interaction.vInteractions[0]));
                                    if (compoundGroup.vInteractions.findIndex(vi => vi._id === vInteraction._id) === -1) {
                                        compoundGroup.vInteractions.push(vInteraction);
                                    }
                                }
                            }
                            queryApearanceMap[`${side1Name}-${userQuery}`].forEach(currInteraction => {
                                acc = acc.filter(i => i._id !== currInteraction._id && i._id !== `${currInteraction._id}-${currInteraction._id}`);
                                acc.push(compoundGroup);
                            });
                        } else {
                            if (acc[groupIdx].vInteractions.findIndex(i => i._id === interaction._id ) === -1) {
                                if (!interaction.vInteractions || interaction.vInteractions.length > 1) {
                                    acc[groupIdx].vInteractions.push(interaction);
                                    acc[groupIdx].recommendation = this.getMoreSeverRecomm(acc[groupIdx].recommendation, interaction.recommendation);
                                    acc[groupIdx].evidenceLevel = this.getMoreSeverEvidenceLevel(acc[groupIdx].evidenceLevel, interaction.evidenceLevel);
                                } else if (interaction.vInteractions.length === 1) {
                                    const vInteraction = JSON.parse(JSON.stringify(interaction.vInteractions[0]));
                                    if (acc[groupIdx].vInteractions.findIndex(vi => vi._id === vInteraction._id) === -1) {
                                        acc[groupIdx].vInteractions.push(vInteraction);
                                    }
                                }
                            }
                        }
                    }
                });
                return acc;
            }, []);
            return this.sortInteractions(formatedInteractions);
        },
        materialCount() {
            return (this.$route.query.queries) ? this.$route.query.queries.length : 0;
        }
    },
    methods: {
        getCompoundName(materialName, query) {
            const queries = this.$store.getters.materialNamesMap[materialName];
            return queries.find(q => q !== query);
        },
        sortInteractions(interactions) {
            const { recommendationsOrderMap: map } = this.$options;
            return interactions.slice().sort((a, b) => {
                return map[b.recommendation.toLowerCase()] - map[a.recommendation.toLowerCase()] ||
                a.evidenceLevel.toLowerCase().localeCompare(b.evidenceLevel.toLowerCase()) ||
                a.name.toLowerCase().localeCompare(b.name.toLowerCase());
            });
        },
        insertInteraction(acc, interaction) {
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
                    evidenceLevel: this.getMoreSeverEvidenceLevel(acc[idx].evidenceLevel, interaction.evidenceLevel),
                    vInteractions: (acc[idx]._id === interaction._id) ? [ acc[idx] ] : [
                        acc[idx],
                        interaction
                    ],
                    isCompoundGroup: false
                };
                acc.splice(idx, 1, vInteractionGroup);
            } else {
                if (acc[groupIdx].vInteractions.findIndex(i => i._id === interaction._id) === -1) {
                    acc[groupIdx].vInteractions.push(interaction);
                    acc[groupIdx].recommendation = this.getMoreSeverRecomm(acc[groupIdx].recommendation, interaction.recommendation);
                    acc[groupIdx].evidenceLevel = this.getMoreSeverEvidenceLevel(acc[groupIdx].evidenceLevel, interaction.evidenceLevel);
                }
            } 
        },
        getMoreSeverRecomm(...recommendations) {
            const { recommendationsOrderMap } = this.$options;
            recommendations.sort((a, b) => {
                return (recommendationsOrderMap[a.toLowerCase()] > recommendationsOrderMap[b.toLowerCase()]) ? -1 : (recommendationsOrderMap[a.toLowerCase()] < recommendationsOrderMap[b.toLowerCase()]) ? 1 : 0;
            });
            return recommendations[0];
        },
        getMoreSeverEvidenceLevel(...evidenceLevels) {
            return evidenceLevels.sort()[0];
        },
        getInteractionSidesNames(interaction) {
            let side1Name = '';
            let side2Name = '';
            if (interaction.name) {
                [ side1Name, side2Name ] = interaction.name.split('&').map(str => str.trim());
            } else {
                side1Name = interaction.side1Material.name;
                side2Name = interaction.side2Material.name;
            }
            return { side1Name, side2Name };
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
            this.checkForIncludedMaterials();
        },
        checkForIncludedMaterials() {
            const countMap = {};
            const dups = this.materials.filter(material => {
                if (!countMap[material._id]) countMap[material._id] = 1;
                else return true;
            });
            dups.forEach(material => {
                const queries = this.$store.getters.materialNamesMap[material.name];
                queries.forEach(query => {
                    if (this.$store.getters.queryApearanceCount(query) < 2) {
                        const includedMaterial = this.materials.find(m => m._id === material._id && m.userQuery === query);
                        includedMaterial.isIncluded = true;
                    }
                });
            });
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
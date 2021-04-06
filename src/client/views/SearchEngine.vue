<template>
    <section class="search-engine">
        <div class="search-engine-container">
            <span class="brim-start" />
            <div class="search-engine-search flex-coloumn">
                <figure class="logo">
                    <img
                        src="@/client/assets/imgs/logo-symbol.png"
                        alt="Logo"
                    />
                    <img
                        src="@/client/assets/imgs/logo-txt.png"
                        alt="Efficasafe"
                    />
                </figure>
                <p class="search-engine-search-msg">
                    <span class="font-medium">6</span>
                    Free searches left
                </p>
                <button class="btn">Register for free trial</button>
                <autocomplete
                    class="search-engine-search-bar"
                    :isOnSearchPage="true"
                    placeholder="+   Search herb / drug"
                    @item-selected="addMaterials"
                />
                <ul class="search-engine-search-materials">
                    <tooltip
                        v-for="(result, idx) in formatedMaterials"
                        :key="idx"
                        left
                    >
                        <template #content>
                            <material-interactions-preview
                                :materials="result.materials"
                                :userQuery="result.txt"
                                :disabled="result.isIncluded"
                                :interactions="getResultInteractions(result.txt)"
                            />
                        </template>
                        <li
                            class="search-engine-search-materials-chip"
                            :class="{ 'disabled': result.isIncluded }" 
                            :style="{ 'background-image': `url('${getResultIcon(result)}')` }"
                        >
                            {{ result.txt }}
                            <button class="remove-btn" @click="removeMaterials(result.txt)">
                                <close-icon :size="16" />
                            </button>
                        </li>
                    </tooltip>
                </ul>
                <div class="search-engine-search-actions">
                    <router-link to="/search">Clear search</router-link> |
                    <tooltip bottom>
                        <template #content>
                            <span class="msg">
                                Subscribed users can save their search results
                            </span>
                        </template>
                        <button :disabled="!loggedInUser">
                            Save search
                        </button>
                    </tooltip>
                </div>
            </div>
            <div class="search-engine-results">
                <header>
                    <div class="flex-space-between">
                        <span class="search-engine-results-amount font-medium">
                            <animated-integer :value="totalInteractionCount" />
                            Interactions
                        </span>
                        <span class="search-engine-results-actions">
                            <button
                                class="print-btn"
                                title="Print"
                            >
                                <printer-icon />
                            </button>
                            <button
                                class="share-btn"
                                title="Share"
                            >
                                <mobile-share-icon v-if="isScreenNarrow" />
                                <share-icon v-else />
                            </button>
                        </span>
                        <button class="mobile-menu-btn">
                            <mobile-menu-icon />
                        </button>
                    </div>
                    <div class="search-engine-results-stats">
                        Based on <animated-integer :value="totalRefsCount" />
                        Clinical Trials, Pre-Clinical Trials and articles >>
                    </div>
                </header>
                <nav></nav>
                <router-view />
            </div>
            <span class="brim-end" />
        </div>
    </section>
</template>

<script>
import { interactionService } from '@/cms/services/interaction.service';
import Autocomplete from '@/client/cmps/shared/Autocomplete';
import Tooltip from '@/client/cmps/common/Tooltip';
import AnimatedInteger from '@/client/cmps/common/AnimatedInteger';
import MaterialInteractionsPreview from '@/client/cmps/search-engine/MaterialInteractionsPreview';

import MobileMenuIcon from '@/client/cmps/common/icons/MobileMenuIcon';
import MobileShareIcon from '@/client/cmps/common/icons/MobileShareIcon';
import CloseIcon from 'vue-material-design-icons/Close';
import PrinterIcon from 'vue-material-design-icons/Printer';
import ShareIcon from 'vue-material-design-icons/Share';

export default {
    recommendationsOrderMap: interactionService.getRecommendationOrderMap(),
    name: 'SearchEngine',
    data() {
        return {
            isLoading: false,
            materials: [],
            interactions: [],
            pageCount: 0,
            total: 0,
            dBankInteractions: [],
            dBankPageCount: 0,
            dBankTotal: 0,
            msg: ''
        }
    },
    watch: {
        '$route.query': {
            handler() {
                const { q } = this.$route.query; 
                if (!q) {
                    this.reset();
                    return;
                }
                if (!Array.isArray(q) && q) {
                    this.$route.query.q = [ q ];
                }
                this.getResults();
            },
            deep: true,
            immediate: true
        }
    },
    computed: {
        formatedInteractions() {
            if ((this.$route.query.q && this.$route.query.q.length) === 1 && this.materials.length > 1) {
                this.setMsg('Compound as a single result isn\'t supported, Please provide more material/s');
                return [];
            }
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
            formatedInteractions = formatedInteractions.reduce((acc, interaction) => {
                const { side1Name, side2Name } = this.getInteractionSidesNames(interaction);
                const userQueries = this.$store.getters.materialNamesMap[side2Name];
                if (!userQueries) return acc;
                userQueries.forEach(userQuery => {
                    const queryApearanceCount = this.$store.getters.queryApearanceCount(userQuery);
                    if (!queryApearanceMap[`${side1Name}-${userQuery}`]) {
                        queryApearanceMap[`${side1Name}-${userQuery}`] = [ interaction ];
                        if (queryApearanceCount <= 1) {
                            if (acc.findIndex(vi => vi._id === interaction._id) === -1) {
                                acc.push(interaction);
                            }
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
        totalRefsCount() {
            const seenRefsMap = {};
            const refsCount = this.interactions.reduce((acc, { _id, refs }) => {
                refs.forEach(ref => {
                    if (!seenRefsMap[_id]) seenRefsMap[_id] = {};

                    if (!seenRefsMap[_id][ref + '']) {
                        acc++;
                        seenRefsMap[_id][ref + ''] = true;
                    }
                });
                return acc;
            }, 0);
            const dBankRefsCount = this.dBankInteractions.reduce((acc, { references }) => {
                acc += Object.values(references).reduce((innerAcc, refsArr) => {
                    innerAcc += refsArr.length;
                    return innerAcc;
                }, 0);
                return acc;
            }, 0);
            const pathwayRefsCount = this.materials.reduce((acc, { _id, pathwayRefs }) => {
                pathwayRefs.forEach(ref => {
                    if (!seenRefsMap[_id]) seenRefsMap[_id] = {};

                    if (!seenRefsMap[_id][ref.link]) {
                        acc++;
                        seenRefsMap[_id][ref.link] = true;
                    }
                });
                return acc;
            }, 0);

            return refsCount + dBankRefsCount + pathwayRefsCount;
        },
        totalInteractionCount() {
            return this.total + this.dBankTotal;
        },
        loggedInUser() {
            return null;
        },
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        }
    },
    methods: {
        async getResults() {
            this.isLoading = true;
            await this.getMaterials();
            await Promise.all([
                this.getInteractions(),
                this.getDBankInteractions()
            ]);
            this.isLoading = false;
        },
        async getInteractions(page = 1) {
            const ids = this.materials.reduce((acc, { _id, labels }) => {
                if (!acc.includes(_id)) acc.push(_id);
                labels.forEach(label => {
                    if (!acc.includes(label._id)) acc.push(label._id);
                });
                return acc;
            }, []);
            const filterBy = {
                isSearchResults: true,
                page: --page,
                id: ids,
                materialCount: this.materials.filter(({ isIncluded }) => !isIncluded).length
            };
            const { interactions, pageCount, total } = await this.$store.dispatch({ type: 'getInteractions', filterBy });
            this.pageCount = pageCount;
            this.total = total;
            this.interactions = interactions;
        },
        async getDBankInteractions(page = 1) {
            const isAllNotDrugs = this.materials.every(material => material.type !== 'drug');
            if (!this.materials.length || isAllNotDrugs) {
                this.dBankInteractions = [];
                this.isLoading = false;
                return;
            }
            const drugBankIds = this.materials.map(mat => mat.drugBankId);
            const drugBankId = (drugBankIds.length === 1) ? drugBankIds[0] : drugBankIds;
            const criteria = { drugBankId, page: --page };
            const { dBankInteractions, pageCount, total } = await this.$store.dispatch({ type: 'getDBankInteractions', criteria });
            this.dBankInteractions = dBankInteractions;
            this.dBankPageCount = pageCount;
            this.dBankTotal = total;
        },
        async getMaterials() {
            if (!this.$route.query.q || !this.$route.query.q.length) {
                this.materials = [];
                this.isLoading = false;
                return;
            }
            const criteria = {
                isSearchResults: true,
                q: this.$route.query.q,
            };
            const materials = (await this.$store.dispatch({ type: 'getMaterials', criteria }));
            this.materials = this.sortMaterials(materials);
            this.$store.commit({ type: 'makeMaterialNamesMap', materials });
            this.checkForIncludedMaterials();
        },
        getResultInteractions() {// userQuery
            ///~~~ yet experimental - it's goes to material interactions tooltip
            //     needs return not empty array if there is more than one material & not included   
            //     than display list of only material related interactions (other side names only) & img     
            // const materialName = this.$store.getters.materialNamesMap[userQuery];
            // console.log(this.formatedInteractions.filter(({name}) => name.includes(materialName) || name.includes(userQuery)));
            return [];
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
            const idx = acc.findIndex(
                vin => (vin.side2Material && vin.side2Material._id === interaction.side2Material._id) &&
                (vin.side1Material._id === interaction.side1Material._id)
            );
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
        checkForIncludedMaterials() {
            const seenMap = {};
            const dups = this.materials.reduce((acc, material) => {
                if (!seenMap[material._id]) seenMap[material._id] = material;
                else {
                    const included = (material.name === material.userQuery) ? seenMap[material._id] : material;
                    acc.push(included);
                }
                return acc;
            }, []);
            dups.forEach(material => {
                const queries = this.$store.getters.materialNamesMap[material.name];
                queries.forEach((query, idx) => {
                    if (this.$store.getters.queryApearanceCount(query) < 2) {
                        const includedMaterial = this.materials.find(m => m._id === material._id && m.userQuery === query);
                        includedMaterial.isIncluded = idx !== 0;
                    }
                });
            });
        },
        addMaterials(query) {
            if (this.$route.query.q) {
                if (!this.isQueryExists(query)) {
                    const queries = [ ...this.$route.query.q, query ];
                    this.$router.replace({ query: { q: queries } });
                }
            } else {
                this.$router.push({ query: { q: [ query ] } });
            }
        },
        removeMaterials(query) {
            const queries = this.$route.query.q.filter(q => q !== query);
            this.$router.replace({ query: { q: queries } });
        },
        sortMaterials(materials) {
            const { q } = this.$route.query;
            return materials.sort((a, b) => q.indexOf(a.userQuery) - q.indexOf(b.userQuery));
        },
        isQueryExists(query) {
            return this.$route.query.q.indexOf(query) !== -1;
        },
        getResultIcon(result) {
            let fileName = '';
            switch (result.materials[0].type) {
                case 'drug':
                    fileName = 'drug';
                    break;
                case 'herb':
                case 'essential oil':
                    fileName = 'herb';
                    break;
                case 'vitamin':
                case 'mineral':
                case 'amino acid':
                case 'nutraceutical':
                    fileName = 'other';
                    break;
                case 'food':
                    fileName = 'food';
                    break;
            }
            const filePath = (result.materials.length === 1) ? `types/${fileName}` : 'info';
            return require(`@/client/assets/icons/${filePath}.svg`);
        },
        setMsg(msg) {
            this.msg = msg;
        },
        reset() {
            this.materials = [];
            this.interactions = [];
            this.dBankInteractions = [];
            this.pageCount = 0;
            this.dBankPageCount = 0;
            this.total = 0;
            this.dBankTotal = 0;
            this.isLoading = false;
        }
    },
    components: {
        Autocomplete,
        Tooltip,
        MaterialInteractionsPreview,
        CloseIcon,
        PrinterIcon,
        ShareIcon,
        MobileMenuIcon,
        MobileShareIcon,
        AnimatedInteger
    }
};
</script>

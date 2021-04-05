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
                <nav>

                </nav>
                <router-view />
            </div>
            <span class="brim-end" />
        </div>
    </section>
</template>

<script>
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
            dBankTotal: 0
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
            const refsCount = this.interactions.reduce((acc, { refsCount }) => {
                acc += refsCount;
                return acc;
            }, 0);
            const dBankRefsCount = this.dBankInteractions.reduce((acc, { references }) => {
                acc += Object.values(references).reduce((innerAcc, refsArr) => {
                    innerAcc += refsArr.length;
                    return innerAcc;
                }, 0);
                return acc;
            }, 0);
            const pathwayRefsCount = this.materials.reduce((acc, { pathwayRefsCount }) => {
                acc += pathwayRefsCount;
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
        reset() {
            this.materials = [];
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

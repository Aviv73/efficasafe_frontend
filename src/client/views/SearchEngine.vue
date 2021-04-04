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
                    <li
                        class="search-engine-search-materials-chip"
                        v-for="(result, idx) in formatedMaterials"
                        :key="idx"
                        :style="{ 'background-image': `url('${getResultIcon(result)}')` }"
                    >
                        {{ result.txt }}
                        <button class="remove-btn" @click="removeMaterials(result.txt)">
                            <close-icon :size="16" />
                        </button>
                    </li>
                </ul>
                <div class="search-engine-search-actions">
                    <router-link to="/search">Clear search</router-link> |
                    <tooltip :offsetY="120">
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
                            350 Interactions
                        </span>
                        <span class="search-engine-results-actions">
                            <button title="Print">
                                <printer-icon />
                            </button>
                            <button title="Share">
                                <share-icon />
                            </button>
                        </span>
                    </div>
                    <div class="search-engine-results-stats">
                        Based on 780 Clinical Trials, 950 Pre-Clinical Trials and 1589 articles >>
                    </div>
                </header>
                <nav>
                    
                </nav>
            </div>
            <span class="brim-end" />
        </div>
    </section>
</template>

<script>
import Autocomplete from '@/client/cmps/shared/Autocomplete';
import Tooltip from '@/client/cmps/common/Tooltip';
import CloseIcon from 'vue-material-design-icons/Close';
import PrinterIcon from 'vue-material-design-icons/Printer';
import ShareIcon from 'vue-material-design-icons/Share';

export default {
    name: 'SearchEngine',
    data() {
        return {
            materials: [],
            isLoading: false
        }
    },
    watch: {
        '$route.query': {
            async handler() {
                const { q } = this.$route.query; 
                if (!q) {
                    this.reset();
                    return;
                }
                if (!Array.isArray(q) && q) {
                    this.$route.query.q = [ q ];
                }
                await this.getMaterials();
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
        loggedInUser() {
            return null;
        }
    },
    methods: {
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
            const materials = (await this.$store.dispatch({ type: 'getMaterials', criteria })).map(
                ({  _id, labels, name, type, drugBankId, userQuery }) => ({  _id, labels, name, type, drugBankId, userQuery })
            );
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
            const filePath = (result.materials.length === 1) ? `types/${result.materials[0].type}` : 'info';
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
        CloseIcon,
        PrinterIcon,
        ShareIcon
    }
};
</script>

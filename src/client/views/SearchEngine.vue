<template>
    <section class="search-engine">
        <div class="search-engine-container side-by-side-container">
            <span class="brim-start" />
            <div class="search-engine-search flex-coloumn">
                <router-link to="/" class="logo">
                    <img
                        src="@/client/assets/imgs/logo-symbol.png"
                        alt="Logo"
                    />
                    <img
                        src="@/client/assets/imgs/logo-txt.png"
                        alt="Efficasafe"
                    />
                </router-link>
                <autocomplete
                    class="search-engine-search-bar v-tour-step-0"
                    :isOnSearchPage="true"
                    :placeholder1="isScreenNarrow ? 'Add another' : '+   Add another'"
                    @item-selected="addMaterials"
                />
                <div class="search-engine-search-actions flex-space-between">
                    <button
                        title="Undo"
                        :disabled="!$route.query.q || !$route.query.q.length"
                        @click="navigateQueries(-1)"
                    >
                        <undo-icon />    
                    </button> |
                    <button
                        title="Redo"
                        :disabled="!undoneQueries.length"
                        @click="navigateQueries(1)"
                    >
                        <redo-icon />
                    </button> |
                    <button
                        :disabled="!$route.query.q || !$route.query.q.length"
                        @click="clearSearch"
                    >
                        Clear search
                    </button> |
                    <tooltip
                        :hidden="!!loggedInUser"
                        bottom
                    >
                        <template #content>
                            <span class="msg">
                                Subscribed users can save their search results
                            </span>
                        </template>
                        <button
                            :disabled="!loggedInUser || (!$route.query.q || !$route.query.q.length)"
                            @click="isSaveSearchModalActive = true"
                        >
                            Save search
                        </button>
                    </tooltip>
                </div>
                <ul
                    class="search-engine-search-materials"
                    :class="{ 'empty': !materials.length }"
                >
                    <tooltip
                        v-for="(result, idx) in formatedMaterials"
                        :key="idx"
                        on="focus"
                        wrap-el="li"
                        closable
                        left
                    >
                        <template #close-icon>
                            <close-icon
                                :size="16"
                                title=""
                            />
                        </template>
                        <template #content>
                            <material-interactions-preview
                                v-if="!isAllUnderStudy(result)"
                                :materials="result.materials"
                                :userQuery="result.txt"
                                :disabled="result.isIncluded"
                                :interactions="getMaterialInteractions(result)"
                                :isOneMaterial="materials.length === 1"
                            />
                            <div v-else class="interactions-preview under-construction">
                                This material is still under construction. The results you may see are only partial.
                                Because you searched this material, it will get higher priority.
                            </div>
                        </template>
                        <li
                            class="search-engine-search-materials-chip clip-txt activator v-tour-step-1"
                            :class="{
                                'disabled': result.isIncluded
                            }" 
                            :style="{ 'background-image': `url('${getResultIcon(result)}')` }"
                        >
                            {{ result.txt }}
                            <span class="search-engine-search-materials-chip-actions">
                                <information-outline-icon
                                    class="info-icon hover-activator"
                                    :class="{ 'under-construction': isOneUnderStudy(result) }"
                                    :size="16"
                                    title=""
                                />
                                <button
                                    class="close-btn"
                                    @click.stop="removeMaterials(result.txt)"
                                    :data-close-btn="true"
                                >
                                    <close-icon :size="16" title="" />
                                </button>
                            </span>
                        </li>
                    </tooltip>
                </ul>
                <div class="search-engine-search-cta">
                    <span class="search-engine-search-msg">
                        <span class="font-medium">6</span>
                        Free searches left
                    </span>
                    <button
                        class="btn"
                        id="searchPageSignup"
                        @click="$emit('signup')"
                    >
                        Register for free trial
                    </button>
                </div>
            </div>
            <div
                class="search-engine-results"
                :style="{ 'max-width': `calc(100vw - ${scrollBarWidth})` }"
            >
                <header class="search-engine-results-header">
                    <div class="flex-space-between">
                        <span class="search-engine-results-amount font-medium">
                            <animated-integer :value="totalInteractionCount" />
                            {{ ($route.name === 'Boosters') ? 'Boosters' : 'Interactions' }}
                        </span>
                        <span class="search-engine-results-actions">
                            <button
                                class="print-btn print-btn-icon"
                                :title="loggedInUser ? 'Print' : 'Subscribed users can print their search results'"
                                :disabled="!loggedInUser"
                                @click="isPrintModalActive = true"
                            >
                                <printer-icon title="" />
                            </button>
                            <button
                                class="share-btn share-btn-icon"
                                :disabled="!loggedInUser"
                                :title="loggedInUser ? 'Share' : 'Subscribed users can share their search results'"
                                @click="isShareModalActive = true"
                            >
                                <mobile-share-icon v-if="isScreenNarrow" title="" />
                                <share-variant-icon v-else title="" />
                            </button>
                        </span>
                        <button class="mobile-menu-btn"></button>
                    </div>
                    <div
                        class="search-engine-results-stats"
                        :class="{ 'u-hide': $route.name === 'Boosters' }"
                    >
                        Based on <animated-integer :value="totalRefsCount" />
                        scientific articles
                    </div>
                </header>
                <nav
                    class="search-engine-nav"
                    v-set-sticky-class-name:[`pinned`]
                >
                    <ul>
                        <li class="search-engine-nav-link">
                            <router-link
                                class="link"
                                :to="{ name: 'Supp2Drug', query: this.$route.query }"
                            >
                                Supplement - Drug
                                <span v-if="total">
                                    {{'\xa0'}}
                                    <span
                                        class="badge"
                                        :style="{ 'background-color': worstSupp2DrugColor }"
                                    >
                                        {{ total }}
                                    </span>
                                </span>
                            </router-link>
                        </li>
                        <li class="search-engine-nav-link">
                            <router-link
                                class="link"
                                :to="{ name: 'Drug2Drug', query: this.$route.query }"
                            >
                                Drug - Drug
                                <span v-if="dBankTotal">
                                    {{'\xa0'}}
                                    <span
                                        class="badge"
                                        :style="{ 'background-color': worstDrug2DrugColor }"
                                    >
                                        {{ dBankTotal }}
                                    </span>
                                </span>
                            </router-link>
                        </li>
                        <li class="search-engine-nav-link">
                            <router-link
                                class="link boosters pb-tour-step-0 v-tour-step-7"
                                :to="{ name: 'Boosters', query: this.$route.query }"
                            >
                                Positive boosters
                                <span v-if="totalPositiveBoosters">
                                    {{'\xa0'}}
                                    <span
                                        class="badge"
                                        :style="{ 'background-color': positivesBadgeColor }"
                                    >
                                        {{ totalPositiveBoosters }}
                                    </span>
                                </span>
                            </router-link>
                        </li>
                        <li class="search-engine-nav-link v-tour-step-6">
                            <router-link
                                class="link"
                                :to="{ name: 'Monitor', query: this.$route.query }"
                            >
                                What to monitor
                            </router-link>
                        </li>
                        <li class="search-engine-nav-link v-tour-step-5">
                            <label class="display-toggle">
                                <input
                                    type="radio"
                                    name="isVertical"
                                    v-model="isViewVertical"
                                    :value="false"
                                    hidden
                                    @input="savePrefs('view', 'horizontal')"
                                />
                                <mobile-menu-icon title="" />
                            </label>
                            <label class="display-toggle">
                                <input
                                    type="radio"
                                    name="isVertical"
                                    v-model="isViewVertical"
                                    :value="true"
                                    hidden
                                    @input="savePrefs('view', 'vertical')"
                                />
                                <mobile-menu-icon title="" />
                            </label>
                        </li>
                    </ul>
                </nav>
                <transition :name="routerTransitionName" mode="out-in">
                    <router-view
                        class="inner-view"
                        :key="$route.name"
                        :listData="routableListData"
                        :isVertical="isViewVertical"
                        :materials="materials"
                        :isLoading="isLoading"
                        :isPBLoading="isPBLoading"
                        @page-changed="handlePaging"
                        @list-sorted="handleSort"
                    />
                </transition>
            </div>
            <span class="brim-end" />
        </div>
        <modal-wrap
            :isActive="isDisclaimerActive"
            persistent
        >
            <disclaimer @approved-use="handleUseApprove" />
        </modal-wrap>
        <modal-wrap
            :isActive="isShareModalActive"
            @close-modal="isShareModalActive = false"
        >
            <share-modal @close-modal="isShareModalActive = false" />
        </modal-wrap>
        <modal-wrap
            :isActive="isPrintModalActive"
            @close-modal="isPrintModalActive = false"
        >
            <print-modal
                :interactions="routableListData.interactions"
                :materials="materials"
                @close-modal="isPrintModalActive = false"
            />
        </modal-wrap>
        <modal-wrap
            :isActive="isSaveSearchModalActive"
            @close-modal="isSaveSearchModalActive = false"
        >
            <save-search-modal
                @close-modal="isSaveSearchModalActive = false"
            />
        </modal-wrap>
        <onboarding-tour />
    </section>
</template>

<script>
import { interactionUIService } from '@/cms/services/interaction-ui.service';
import { storageService } from '@/cms/services/storage.service';
import { eventBus, EV_show_user_msg, EV_search_results_cleared } from '@/cms/services/eventBus.service';
import { logService } from '@/cms/services/log.service';

import Autocomplete from '@/client/cmps/shared/Autocomplete';
import ShareModal from '@/client/cmps/shared/modals/ShareModal';
import PrintModal from '@/client/cmps/shared/modals/PrintModal';
import SaveSearchModal from '@/client/cmps/shared/modals/SaveSearchModal';
import Tooltip from '@/client/cmps/common/Tooltip';
import ModalWrap from '@/client/cmps/common/ModalWrap';
import AnimatedInteger from '@/client/cmps/common/AnimatedInteger';
import MaterialInteractionsPreview from '@/client/cmps/search-engine/MaterialInteractionsPreview';
import Disclaimer from '@/client/cmps/search-engine/Disclaimer';
import OnboardingTour from '@/client/cmps/search-engine/OnboardingTour';

import UndoIcon from '@/client/cmps/common/icons/UndoIcon';
import RedoIcon from '@/client/cmps/common/icons/RedoIcon';
import MobileMenuIcon from '@/client/cmps/common/icons/MobileMenuIcon';
import MobileShareIcon from '@/client/cmps/common/icons/MobileShareIcon';
import CloseIcon from 'vue-material-design-icons/Close';
import PrinterIcon from 'vue-material-design-icons/Printer';
import ShareVariantIcon from 'vue-material-design-icons/ShareVariant';
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline';

export default {
    recommendationsOrderMap: interactionUIService.getRecommendationOrderMap(),
    name: 'SearchEngine',
    data() {
        return {
            isLoading: false,
            isPBLoading: false,
            materials: [],
            interactions: [],
            pageCount: 0,
            total: 0,
            dBankInteractions: [],
            dBankPageCount: 0,
            dBankTotal: 0,
            positiveInteractions: [],
            isViewVertical: storageService.load('view', true) === 'vertical' && (this.$route.name !== 'Boosters' && this.$route.name !== 'Monitor'),
            scrollBarWidth: '0px',
            routerTransitionName: '',
            sortOptions: null,
            boosterSortOptions: null,
            isDisclaimerActive: false,
            isShareModalActive: false,
            isPrintModalActive: false,
            isSaveSearchModalActive: false,
            undoneQueries: []
        }
    },
    watch: {
        '$route.query': {
            async handler(to, from) {
                if (this.$route.name === 'Boosters' && !this.isScreenNarrow && !storageService.load('did-p-boosters-tour')) {
                    this.$nextTick(() => {
                        this.$tours['boosters-tour'].start();
                    });
                }
                const { q } = this.$route.query;
                if (!q || !q.length) {
                    eventBus.$emit(EV_search_results_cleared);
                    this.reset();
                    return;
                }
                if (!Array.isArray(q) && q) {
                    this.$route.query.q = [ q ];
                }
                const isSameSearch = from && from.q && to.q.length === from.q.length && to.q.every((val, idx) => val === from.q[idx]) && from.page === to.page;
                if (!isSameSearch) {
                    await this.getResults();
                }
                if (this.materialsLength >= 2 && !storageService.load('did-onboarding-tour') && !this.isScreenNarrow) {
                    this.$tours['onboarding-tour'].start();
                }
            },
            deep: true,
            immediate: true
        },
        '$route'(to, from) {
            //for paging
            if(from && JSON.stringify(from.query) === JSON.stringify(to.query) && from.name !== to.name && from.query.page !== 1 ){
                this.$router.replace({ query: { q: [...this.$route.query.q], page: 1} }).catch(()=>{});
            }
            const routesOrder = {
                'Supp2Drug': 1,
                'Drug2Drug': 2,
                'Boosters': 3,
                'Monitor': 4
            };
            if (to.name === 'Boosters' || to.name === 'Monitor') {
                this.isViewVertical = false;
            } else {
                this.isViewVertical = storageService.load('view', true) === 'vertical';
            }
            this.routerTransitionName = (routesOrder[to.name] < routesOrder[from.name]) ? 'slide-right' : 'slide-left';
        }
    },
    computed: {
        routableListData() {
            switch (this.$route.name) {
                case 'Supp2Drug':
                    return {
                        interactions: this.formatedInteractions,
                        pageCount: this.pageCount,
                        total: this.total
                    };
                    case 'Drug2Drug':
                    return {
                        interactions: this.dBankInteractions,
                        pageCount: this.dBankPageCount,
                        total: this.dBankTotal
                    };
                    case 'Boosters':
                    return {
                        interactions: this.formatedPositiveInteractions,
                        pageCount: 0,
                        total: 0
                    };
                    case 'Monitor':
                    return {
                        interactions: this.formatedInteractions,
                        pageCount: this.pageCount,
                        total: this.total
                    };
            }
            return []
        },
        formatedPositiveInteractions() {
            this.positiveInteractions.forEach(group => {
                group.recommendation = this.getMoreSeverRecomm(true, ...group.vInteractions.map(i => i.recommendation));
                group.evidenceLevel = this.getMoreSeverEvidenceLevel(...group.vInteractions.map(i => i.evidenceLevel));
                const matchingMaterial = this.materials.find(m => m._id === group.side2Id || m.labels.some(l => l._id === group.side2Id));
                const materialName = matchingMaterial ? matchingMaterial.name : '';
                const materialId = matchingMaterial ? matchingMaterial._id : '';
                const userQuery = this.$store.getters.materialNamesMap[materialName];
                group.name = userQuery ? userQuery[0] : materialName;
                group.mainMaterialId = materialId;
                group.isMaterialGroup = true;
                group.vInteractions.forEach(vInteraction => {
                    if (vInteraction.side2Label) {
                        const { _id, name, type } = this.materials.find(m => m.labels.some(l => l._id === vInteraction.side2Label._id));
                        vInteraction.side2Material = {
                            _id,
                            name,
                            type
                        };
                        vInteraction.side2Label = null;
                    }
                    vInteraction.isVirtual = true;
                    vInteraction.name = `${vInteraction.side1Material.name} & ${vInteraction.side2Material.name}`;
                });
            });
            const map = this.$options.recommendationsOrderMap;
            const formatedPositiveInteractions = this.positiveInteractions.reduce((acc, interaction) => {
                const existing = acc.find(i => i.name === interaction.name && i.mainMaterialId === interaction.mainMaterialId);
                // const existing = acc.find(i => i.name === interaction.name);
                if (!existing) {
                    acc.push(interaction);
                } else {
                    existing.evidenceLevel = this.getMoreSeverEvidenceLevel(existing.evidenceLevel, interaction.evidenceLevel);
                    existing.recommendation = this.getMoreSeverRecomm(true, existing.recommendation, interaction.recommendation);
                    interaction.vInteractions.forEach(vInteraction => {
                        const isIncluded = existing.vInteractions.some(v => v._id === vInteraction._id);
                        if (!isIncluded) {
                            existing.vInteractions.push(vInteraction);
                            existing.total++;
                        }
                    });
                    existing.vInteractions.sort((a, b) => {
                        return (map[b.recommendation] - map[a.recommendation]) * -1 ||
                        (a.evidenceLevel.toLowerCase().localeCompare(b.evidenceLevel.toLowerCase())) ||
                        (a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
                    });
                }
                return acc;
            }, []);
            const nameCountMap = {}
            formatedPositiveInteractions.forEach( group => {
                if(!nameCountMap[group.name]) nameCountMap[group.name] = 0
                nameCountMap[group.name]++    
            })
            Object.keys(nameCountMap).forEach(key => {
                if(nameCountMap[key] > 1){
                    const dups = formatedPositiveInteractions.filter(i => i.name === key)
                    dups.forEach(dup => {
                        const materialName = this.materials.find( m => m._id === dup.mainMaterialId && !m.isIncluded).name
                        dup.name = `${materialName} (${dup.name})`;
                        dup.exactName = `${materialName}`;
                    })
                }
            })
            if (this.boosterSortOptions) {
                const { recommendationsOrderMap: map } = this.$options;
                const { sortBy, isDesc } = this.boosterSortOptions;
                const sortOrder = isDesc ? -1 : 1;
                switch (sortBy) {
                    case 'name':
                        formatedPositiveInteractions.sort((a, b) => (a.name.split(' & ')[0].toLowerCase().localeCompare(b.name.split(' & ')[0].toLowerCase())) * sortOrder);
                    break;
                    case 'recommendation':
                        formatedPositiveInteractions.sort((a, b) => (map[b.recommendation] - map[a.recommendation]) * sortOrder);
                    break;
                    case 'evidenceLevel':
                        formatedPositiveInteractions.sort((a, b) => (a.evidenceLevel - b.evidenceLevel) * sortOrder);
                    break;
                }
            } else {
                formatedPositiveInteractions.sort((a, b) => {
                    return (map[b.recommendation] - map[a.recommendation]) * -1 ||
                    (a.evidenceLevel.toLowerCase().localeCompare(b.evidenceLevel.toLowerCase())) ||
                    (a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
                });
            }
            return formatedPositiveInteractions;
        },
        formatedInteractions() {
            let formatedInteractions = this.interactions.reduce((acc, interaction) => {
                if (this.materialsLength === 1 && this.materials[0]._id === interaction.side1Material._id) acc.push(interaction);
                else if (!interaction.side2Label) {
                    this.insertInteraction(acc, interaction);
                } else {
                    const materials = this.materials.filter(
                        material =>!material.isIncluded && material.labels.findIndex(label => label._id === interaction.side2Label._id) !== -1
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
                            side2DraftName: interaction.side2DraftName,
                            summary: interaction.summary,
                            refs: interaction.refs,
                            monitor: interaction.monitor
                        };
                        this.insertInteraction(acc, vInteraction);
                    });
                }
                return acc;
            }, []);
            const queryApearanceMap = {};
            if (this.materialsLength === 1) return this.sortInteractions(formatedInteractions);
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
                                recommendation: this.getMoreSeverRecomm(false, ...queryApearanceMap[`${side1Name}-${userQuery}`].map(i => i.recommendation), interaction.recommendation),
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
                                    acc[groupIdx].recommendation = this.getMoreSeverRecomm(false, acc[groupIdx].recommendation, interaction.recommendation);
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
            const refsCount = this.interactions.reduce((acc, { side1Material, refs }) => {
                refs.forEach(ref => {
                    if (!seenRefsMap[side1Material._id]) seenRefsMap[side1Material._id] = {};

                    if (!seenRefsMap[side1Material._id][ref + '']) {
                        acc++;
                        seenRefsMap[side1Material._id][ref + ''] = true;
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
            if (!this.total) return dBankRefsCount;
            const pathwayRefsCount = this.materials.reduce((acc, { _id, pathways }) => {
                pathways.forEach(pathway => {
                    if (
                        ((pathway.type === 'enzyme' || pathway.type === 'transporter') &&
                            (!pathway.actions.includes('substrate') && !pathway.actions.includes('binder')))
                            ||
                            (pathway.type === 'carrier' &&
                            (pathway.actions.includes('inducer') || pathway.actions.includes('inhibitor')))
                        ) return;
                    if (!seenRefsMap[_id]) seenRefsMap[_id] = {};
                    pathway.references.forEach(ref => {
                        if (!seenRefsMap[_id][ref + '']) {
                            acc++;
                            seenRefsMap[_id][ref + ''] = true;
                        }
                    });
                });

                return acc;
            }, 0);
            
            
            return refsCount + dBankRefsCount + pathwayRefsCount + this.$store.getters.supplementsRefs.length;
        },
        totalInteractionCount() {
            if (this.$route.name === 'Boosters') {
                return this.formatedPositiveInteractions.reduce((acc, { total }) => {
                    acc += total;
                    return acc;
                }, 0);
            }
            return this.total + this.dBankTotal;
        },
        totalPositiveBoosters() {
            return this.formatedPositiveInteractions.reduce((acc, { total }) => {
                acc += total;
                return acc;
            }, 0);
        },
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        },
        worstSupp2DrugColor() {
            if(!this.interactions.length) return ''
            const worstRecomm = this.getMoreSeverRecomm(false, ...this.interactions.map(i => i.recommendation));
            return interactionUIService.getInteractionColor(worstRecomm);
        },
        worstDrug2DrugColor() {
            if(!this.dBankInteractions.length) return ''
            const worstRecomm = this.getMoreSeverRecomm(false, ...this.dBankInteractions.map(i => i.recommendation));
            return interactionUIService.getInteractionColor(worstRecomm);
        },
        positivesBadgeColor() {
            if(!this.positiveInteractions.length) return ''
            const worstRecomm = this.getMoreSeverRecomm(true, ...this.positiveInteractions.map(i => i.recommendation));
            return interactionUIService.getInteractionColor(worstRecomm);
        },
        materialsLength() {
            return this.materials.filter(({ isIncluded }) => !isIncluded).length;
        }
    },
    methods: {
        handlePaging(page) {
            this.$router.push({ query: { q: [ ...this.$route.query.q ], page } })
        },
        async getResults() {
            this.isLoading = true;
            this.isPBLoading = true;
            await this.getMaterials();
            if (this.$route.query.q && this.$route.query.q.length === 1 && this.materialsLength > 1) {
                eventBus.$emit(EV_show_user_msg, 'Compound as a single result isn\'t supported, Please insert more material/s', 15000);
                this.reset(false);
                this.isLoading = false;
                return;
            }
            if (this.$route.name === 'Boosters') {
                await this.getPositives();
                this.isLoading = false;
                this.isPBLoading = false;
                const prms = [ this.getInteractions(), this.getDBankInteractions() ];
                await Promise.all(prms);
            } else {
                const prms = [ this.getInteractions(), this.getDBankInteractions() ];
                await Promise.all(prms);
                this.isLoading = false;
                await this.getPositives();
                this.isPBLoading = false;
            }
        },
        async getPositives() {
            const ids = this.materials.reduce((acc, { type, _id, labels, isIncluded }) => {
                if (type !== 'drug' || isIncluded) return acc;
                if (!acc.includes(_id)) acc.push(_id);
                labels.forEach(label => {
                    if (!acc.includes(label._id)) acc.push(label._id);
                });
                return acc;
            }, []);
            const filterBy = {
                isSearchResults: true,
                isPositives: true,
                id: ids
            };
            let { interactions, searchState } = await this.$store.dispatch({ type: 'getInteractions', filterBy, cacheKey: `/search/positive-boosters?${this.$route.fullPath.split('?')[1]}` });
            this.positiveInteractions = await this.removeDupNonPositives(interactions);
            this.restoreState('Boosters', searchState);
        },
        async getInteractions() {
            const ids = this.materials.reduce((acc, { _id, labels }) => {
                if (!acc.includes(_id)) acc.push(_id);
                labels.forEach(label => {
                    if (!acc.includes(label._id)) acc.push(label._id);
                });
                return acc;
            }, []);
            let { page } = this.$route.query
            if(!page) page = 1;
            const filterBy = {
                isSearchResults: true,
                page: --page,
                id: ids,
                materialCount: this.materialsLength,
            };
            const { interactions, pageCount, total, searchState } = await this.$store.dispatch({ type: 'getInteractions', filterBy, cacheKey: `/search?${this.$route.fullPath.split('?')[1]}` });
            this.pageCount = pageCount;
            this.interactions = interactions;
            this.total = (this.materialsLength === 1) ? total : interactions.reduce((acc, i) => {
                if (i.side2Material) acc++;
                else {
                    const { _id } = i.side2Label;
                    const materials = this.materials.filter(material => !material.isIncluded && material.labels.some(label => label._id === _id));
                    acc += materials.length;
                }
                return acc;
            }, 0);
            this.restoreState('Supp2Drug', searchState);
        },
        async getDBankInteractions() {
            const isAllSupplements = this.materials.every(material => material.type !== 'drug');
            if (!this.materialsLength || isAllSupplements) {
                this.dBankInteractions = [];
                return;
            }
            let {page} = this.$route.query
            if(!page) page = 1
            const drugBankIds = this.materials.filter(m => !m.isIncluded).map(mat => mat.drugBankId);
            const drugBankId = (drugBankIds.length === 1) ? drugBankIds[0] : drugBankIds;
            const criteria = { drugBankId, page: --page };
            const { dBankInteractions, pageCount, total } = await this.$store.dispatch({ type: 'getDBankInteractions', criteria, cacheKey: `/search/drug2drug?${this.$route.fullPath.split('?')[1]}` });
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
            const materials = await this.$store.dispatch({ type: 'getMaterials', criteria, doCache: true });
            this.materials = this.sortMaterials(materials);
            this.$store.commit({ type: 'makeMaterialNamesMap', materials});
            this.checkForIncludedMaterials();
            this.$store.commit({ type: 'makeMaterialNamesMap', materials: materials.filter(m => !m.isIncluded) });
        },
        async removeDupNonPositives(interactions) {
            const res = [];
            for (let i = 0; i < interactions.length; i++) {
                const group = interactions[i];
                const matchingMaterial = this.materials.find(m => m._id === group.side2Id || m.labels.some(l => l._id === group.side2Id));
                if (!matchingMaterial) continue;
                const side2Ids = [ matchingMaterial._id, ...matchingMaterial.labels.map(l => l._id) ];
                for (let j = 0; j < group.vInteractions.length; j++) {
                    const vInteraction = group.vInteractions[j];
                    const ids = [ vInteraction.side1Material._id, ...side2Ids ];
                    const filterBy = {
                        isSearchResults: true,
                        id: ids,
                        page: 0,
                        limit: Number.MAX_SAFE_INTEGER,
                        materialCount: ids.length + 1,
                        recommendation: 'non-positives'
                    };
                    vInteraction.cacheKey = `/search/positive-boosters/${filterBy.id}`;
                    const { total } = await this.$store.dispatch({ type: 'getInteractions', filterBy, cacheKey: `/search/positive-boosters/${filterBy.id}` });
                    if (!total) {
                        res.push(group);
                    }
                }
            }
            return res;
        },
        restoreState(routeName, state = {}) {
            this.$store.commit({ type: 'setOpenCollapses', openCollapses: state, routeName });
        },
        getMaterialInteractions(result) {
            if (this.materialsLength <= 1 || result.isIncluded) return [];
            const [ materialName ] = this.$store.getters.materialRealName(result.txt);
            const seenIds = {};
            let interactions = this.formatedInteractions.reduce((acc, interaction) => {
                const doTake = !seenIds[interaction._id] && (interaction.name.includes(materialName) || interaction.name.includes(result.txt));
                seenIds[interaction._id] = true;
                if (doTake) {
                    const { _id, name, recommendation, evidenceLevel } = interaction;
                    acc.push({
                        _id,
                        name,
                        recommendation,
                        evidenceLevel
                    });
                }
                return acc;
            }, []);
            const dBankInteractions = this.dBankInteractions.reduce((acc, interaction) => {
                if (interaction.name.includes(materialName)) {
                    const { _id, name, recommendation } = interaction;
                    acc.push({
                        _id,
                        name,
                        recommendation,
                        evidenceLevel: 'A'
                    });
                }
                return acc;
            }, []);
            interactions = interactions.concat(dBankInteractions);
            return this.sortInteractions(interactions);
        },
        handleSort({ sortBy, side, isDesc }) {
            const { recommendationsOrderMap: map } = this.$options;
            const sortOrder = isDesc ? -1 : 1;
            switch (this.$route.name) {
                case 'Drug2Drug': {
                    const sideName = (side === 1) ? 'subject_drug' : 'affected_drug';
                    switch (sortBy) {
                        case 'name':
                            this.dBankInteractions.sort((a, b) => a[sideName].name.toLowerCase().localeCompare(b[sideName].name.toLowerCase()) * sortOrder);
                        break;
                        case 'recommendation':
                            this.dBankInteractions.sort((a, b) => (map[b.recommendation] - map[a.recommendation]) * sortOrder);
                        break;
                        case 'evidenceLevel':
                            this.dBankInteractions.sort((a, b) => (a.evidence_level - b.evidence_level) * sortOrder);
                        break;
                    }
                }
                return;
                case 'Boosters':
                    this.boosterSortOptions = { sortBy, side, isDesc };
                    this.positiveInteractions.splice(0, 0);
                return;
                default:
                    this.sortOptions = { sortBy, side, isDesc };
                    this.interactions.splice(0, 0);
                return;
            }
        },
        sortInteractions(interactions) {
            const { recommendationsOrderMap: map } = this.$options;
            if (this.sortOptions) {
                const { sortBy, side, isDesc } = this.sortOptions;
                const sortOrder = isDesc ? -1 : 1;
                switch (sortBy) {
                    case 'name':
                        return interactions.sort((a, b) => (a.name.split(' & ')[side - 1].toLowerCase().localeCompare(b.name.split(' & ')[side - 1].toLowerCase())) * sortOrder);
                    case 'recommendation':
                        return interactions.sort((a, b) => (map[b.recommendation] - map[a.recommendation]) * sortOrder);
                    case 'evidenceLevel':
                        return interactions.sort((a, b) => (a.evidenceLevel.toLowerCase().localeCompare(b.evidenceLevel.toLowerCase())) * sortOrder);
                }
            }
            return interactions.slice().sort((a, b) => {
                return (map[b.recommendation] - map[a.recommendation]) ||
                (a.evidenceLevel.toLowerCase().localeCompare(b.evidenceLevel.toLowerCase())) ||
                (a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            });
        },
        insertInteraction(acc, interaction) {
            const idx = acc.findIndex(
                vin => (vin.side2Material && vin.side2Material._id === interaction.side2Material._id) &&
                (vin.side1Material._id === interaction.side1Material._id)
            );
            const groupIdx = acc.findIndex(vin => vin._id === `${interaction.side1Material._id}-${interaction.side2Material._id}`);
            // vInteraction & v-group not found
            if (idx === -1 && groupIdx === -1) acc.push(interaction);
            // found 1 v-interaction - make it a group
            else if (idx !== -1 && groupIdx === -1) {
                const vInteractionGroup = {
                    _id: `${interaction.side1Material._id}-${interaction.side2Material._id}`,
                    name: `${interaction.side1Material.name} & ${interaction.side2Material.name}`,
                    recommendation: this.getMoreSeverRecomm(false, acc[idx].recommendation, interaction.recommendation),
                    evidenceLevel: this.getMoreSeverEvidenceLevel(acc[idx].evidenceLevel, interaction.evidenceLevel),
                    vInteractions: (acc[idx]._id === interaction._id) ? [ acc[idx] ] : [
                        acc[idx],
                        interaction
                    ],
                    isCompoundGroup: false
                };
                acc.splice(idx, 1, vInteractionGroup);
            } else {
                // Allready grouped v-interaction found - just add the new one
                if (acc[groupIdx].vInteractions.findIndex(i => i._id === interaction._id) === -1) {
                    acc[groupIdx].vInteractions.push(interaction);
                    acc[groupIdx].recommendation = this.getMoreSeverRecomm(false, acc[groupIdx].recommendation, interaction.recommendation);
                    acc[groupIdx].evidenceLevel = this.getMoreSeverEvidenceLevel(acc[groupIdx].evidenceLevel, interaction.evidenceLevel);
                }
            } 
        },
        navigateQueries(diff) {
            const { q } = this.$route.query;
            if (diff < 0) {
                const lastQ = q[q.length - 1];
                this.$router.push({ query: { q: q.slice(0, -1) } });
                this.undoneQueries.push(lastQ);
            } else {
                const lastQ = this.undoneQueries.pop();
                this.$router.push({ query: { q: [ ...q, lastQ ] } });
            }
        },
        isOneUnderStudy({ materials, isIncluded }) {
            return materials.some(m => m.isUnderStudy) && !isIncluded;
        },
        isAllUnderStudy({ materials, isIncluded }) {
            return materials.every(m => m.isUnderStudy) && !isIncluded;
        },
        getMoreSeverRecomm(isDesc, ...recommendations) {
            const { recommendationsOrderMap } = this.$options;
            recommendations.sort((a, b) => {
                return (recommendationsOrderMap[a] > recommendationsOrderMap[b]) ? -1 : (recommendationsOrderMap[a] < recommendationsOrderMap[b]) ? 1 : 0;
            });
            return isDesc ? recommendations[recommendations.length - 1] : recommendations[0];
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
                const materialDups = this.materials.filter(m => m._id === material._id);
                for (let i = queries.length - 1; i >= 0; i--) {
                    const query = queries[i];
                    if (this.$store.getters.queryApearanceCount(query) < 2) {
                        const includedMaterial = this.materials.find(m => m._id === material._id && m.userQuery === query);
                        includedMaterial.isIncluded = true;
                    }
                }
                const isAllIncluded = materialDups.every(m => m.isIncluded);
                if (isAllIncluded) {
                    materialDups[0].isIncluded = false;
                }
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
            this.undoneQueries.push(query);
            this.$router.replace({ query: { q: queries } });
        },
        sortMaterials(materials) {
            const { q } = this.$route.query;
            return materials.sort((a, b) => q.indexOf(a.userQuery) - q.indexOf(b.userQuery));
        },
        isQueryExists(query) {
            return this.$route.query.q.indexOf(query) !== -1;
        },
        clearSearch() {
            this.$router.push({ name: this.$route.name });
            this.undoneQueries = [];
            eventBus.$emit(EV_search_results_cleared);
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
            if (result.materials.length > 1) {
                const isDrugCompound = result.materials.some(({ type }) => type === 'drug');
                fileName = (isDrugCompound) ? 'drug' : 'other';
            }
            return require(`@/client/assets/icons/types/${fileName}.svg`);
        },
        setScrollBarWidth() {
            this.scrollBarWidth = (window.innerWidth - document.body.clientWidth) + 'px';
        },
        handleUseApprove() {
            storageService.store('approved-use', true);
            if (this.loggedInUser) {
                this.$store.commit({ type: 'setUseApproval' });
                this.$store.dispatch({
                    type: 'updateUser',
                    user: { ...this.$store.getters.loggedInUser }
                });
                logService.add({action: 'Approved use'})
            }
            this.isDisclaimerActive = false;
        },
        showDisclaimer() {
            const didApproved = storageService.load('approved-use');
            const approvedUse = this.$store.getters.loggedInUser ? this.$store.getters.loggedInUser.approvedUse : false;
            if (approvedUse || didApproved) return;
            this.isDisclaimerActive = true;
        },
        savePrefs(key, val) {
            storageService.store(key, val, true);
        },
        reset(resetMaterials = true) {
            if (resetMaterials) {
                this.materials = [];
            }
            this.interactions = [];
            this.dBankInteractions = [];
            this.positiveInteractions = [];
            this.pageCount = 0;
            this.dBankPageCount = 0;
            this.total = 0;
            this.dBankTotal = 0;
            this.sortOptions = null;
            this.isLoading = false;
            this.$store.commit({ type: 'resetSupplementsRefs' });
        }
    },
    mounted() {
        this.setScrollBarWidth();
        this.showDisclaimer();
    },
    components: {
        Autocomplete,
        Tooltip,
        MaterialInteractionsPreview,
        CloseIcon,
        PrinterIcon,
        ShareVariantIcon,
        MobileMenuIcon,
        MobileShareIcon,
        AnimatedInteger,
        InformationOutlineIcon,
        ModalWrap,
        Disclaimer,
        ShareModal,
        PrintModal,
        UndoIcon,
        RedoIcon,
        OnboardingTour,
        SaveSearchModal
    }
};
</script>
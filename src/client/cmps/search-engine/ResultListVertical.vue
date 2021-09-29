<template>
    <section class="vertical-list">
        <div v-if="lists">
                <header class="vertical-list-header">
                <div class="flex-center">
                    <interaction-icon
                        class="interaction-icon"
                        :color="getInteractionColor('avoid coadministration')"
                    />
                    Avoid
                    <span
                        class="count"
                        v-if="lists.reds.total"
                    >
                        ({{ lists.reds.total }})
                    </span>
                </div>
                <div class="flex-center">
                    <interaction-icon
                        class="interaction-icon"
                        :color="getInteractionColor('caution should be taken')"
                    />
                    Require caution
                    <span
                        class="count"
                        v-if="lists.yellows.total"
                    >
                        ({{ lists.yellows.total }})
                    </span>
                </div>
                <div class="flex-center">
                    <interaction-icon
                        class="interaction-icon"
                        :color="getInteractionColor('coadministration is possible')"
                    />
                    Synergistic
                    <span
                        class="count"
                        v-if="lists.greens.total"
                    >
                        ({{ lists.greens.total }})
                    </span>
                </div>
            </header>
            <main
                class="vertical-list-lists"
            >
                <ul>
                    <li
                        class="vertical-list-lists-row"
                        :class="{ 'longest': isLongestList(lists.reds) }"
                        v-for="interaction in lists.reds[interactions]"
                        :key="interaction._id"
                    >   
                    <tooltip
                        v-if="interaction.isLead"
                        bottom
                        stand-alone
                        :offsetY="16"
                        :offsetX="2"
                    >
                        <template #content>
                            <p class="vertical-list-lists-row-notf-msg">
                                There are multiple interactions for these materials but they are visible only in the default view
                            </p>
                        </template>
                        <span
                            class="vertical-list-lists-row-notf"
                        >
                            <bell-ring-icon :size="18" title="" />
                        </span>
                    </tooltip>
                        <component
                            :is="getPreviewWrapEl(interaction)"
                            :to="getInteractionLink(interaction)"
                        >
                            <interaction-capsules
                                :title="interaction.recommendation"
                                :name="getInteractionName(interaction)"
                                :color="getInteractionColor('avoid coadministration')"
                                :vInteractionCount="0"
                                :showDraftName="false"
                                localize
                                dense
                            />
                        </component>
                    </li>
                </ul>
                <ul>
                    <li
                        v-for="interaction in lists.yellows[interactions]"
                        :key="interaction._id"
                        class="vertical-list-lists-row"
                        :class="{
                            'longest': isLongestList(lists.yellows)
                        }"
                    >
                        <tooltip
                            v-if="interaction.isLead"
                            bottom
                            stand-alone
                            :offsetY="16"
                            :offsetX="2"
                        >
                            <template #content>
                                <p class="vertical-list-lists-row-notf-msg">
                                    There are multiple interactions for these materials but they are visible only in the default view
                                </p>
                            </template>
                            <span
                                v-if="interaction.isLead"
                                class="vertical-list-lists-row-notf"
                            >
                                <bell-ring-icon :size="18" title="" />
                            </span>
                        </tooltip>
                        <component
                            :is="getPreviewWrapEl(interaction)"
                            :to="getInteractionLink(interaction)"
                        >
                            <interaction-capsules
                                :title="interaction.recommendation"
                                :name="getInteractionName(interaction)"
                                :color="getInteractionColor('caution should be taken')"
                                :vInteractionCount="0"
                                :showDraftName="false"
                                localize
                                dense
                            />
                        </component>
                    </li>
                </ul>
                <ul>
                    <li
                        class="vertical-list-lists-row"
                        :class="{ 'longest': isLongestList(lists.greens) }"
                        v-for="interaction in lists.greens[interactions]"
                        :key="interaction._id"
                    >
                        <tooltip
                            v-if="interaction.isLead"
                            bottom
                            stand-alone
                            :offsetY="16"
                            :offsetX="2"
                        >
                            <template #content>
                                <p class="vertical-list-lists-row-notf-msg">
                                    There are multiple interactions for these materials but they are visible only in the default view
                                </p>
                            </template>
                            <span
                                v-if="interaction.isLead"
                                class="vertical-list-lists-row-notf"
                            >
                                <bell-ring-icon :size="18" title="" />
                            </span>
                        </tooltip>
                        <component
                            :is="getPreviewWrapEl(interaction)"
                            :to="getInteractionLink(interaction)"
                        >
                            <interaction-capsules
                                :title="interaction.recommendation"
                                :name="getInteractionName(interaction)"
                                :color="getInteractionColor('coadministration is possible')"
                                :vInteractionCount="0"
                                :showDraftName="false"
                                localize
                                dense
                            />
                        </component>
                    </li>
                </ul>
            </main>
            <list-pagination
                class="list-pagination flex-center"
                v-model.number="page"
                v-if="maxPageCount > 1"
                :pageCount="maxPageCount"
                :disabled="isLoading"
            >
                <template #first-btn>
                <page-first-icon
                    :size="18"
                    title="First page"
                />
                </template>
                <template #last-btn>
                    <page-last-icon
                        :size="18"
                        title="Last page"
                    />
                </template>
            </list-pagination>
        </div>
        <div v-else-if="$route.name === 'Boosters' || $route.name === 'Monitor'">
            <p class="vertical-list-msg">
                {{ $route.name === 'Boosters' ? 'Positive boosters are' : 'Monitor is' }} only available in default view.
            </p>
        </div>
    </section>
</template>

<script>
import { eventBus, EV_search_results_cleared } from '@/cms/services/eventBus.service';
import { interactionUIService } from '@/cms/services/interaction-ui.service';

import ListPagination from '@/client/cmps/common/ListPagination';
import Tooltip from '@/client/cmps/common/Tooltip';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';

import BellRingIcon from 'vue-material-design-icons/BellRing';
import InteractionIcon from '@/client/cmps/common/icons/InteractionIcon';
import PageFirstIcon from 'vue-material-design-icons/PageFirst';
import PageLastIcon from 'vue-material-design-icons/PageLast';

export default {
    props: {
        materials: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            lists: null,
            isLoading: false,
            maxTotal: 0,
            maxPageCount: 0,
            page: 1
        }
    },
    watch: {
        page: {
            handler() {
                this.getResults();
            },
            immediate: true
        }
    },
    computed: {
        interactions() {
            return (this.$route.name === 'Drug2Drug') ? 'dBankInteractions' : 'interactions';
        },
        materialsLength(){
            return this.materials.filter(m => !m.isIncluded).length
        }
    },
    methods: {
        async getInteractions(filterBy) {
            this.isLoading = true;
            const lists = await this.$store.dispatch({ type: 'getInteractions', filterBy });
            this.lists = (this.materialsLength > 1) ? this.removeDupVinteractions(lists) : lists;
            const maxTotal = Math.max(lists.reds.total, lists.yellows.total, lists.greens.total);
            const maxPageCount = Math.max(lists.reds.pageCount, lists.yellows.pageCount, lists.greens.pageCount);
            this.maxTotal = maxTotal;
            this.maxPageCount = maxPageCount;
            this.isLoading = false;
        },
        async getDBankInteractions(criteria) {
            this.isLoading = true;
            const lists = await this.$store.dispatch({ type: 'getDBankInteractions', criteria });
            this.lists = lists;
            const maxTotal = Math.max(lists.reds.total, lists.yellows.total, lists.greens.total);
            const maxPageCount = Math.max(lists.reds.pageCount, lists.yellows.pageCount, lists.greens.pageCount);
            this.maxTotal = maxTotal;
            this.maxPageCount = maxPageCount;
            this.isLoading = false;
        },
        getResults() {
            switch (this.$route.name) {
                case 'Drug2Drug': {
                    const drugBankIds = this.materials.filter(m => !m.isIncluded).map(mat => mat.drugBankId);
                    const drugBankId = (drugBankIds.length === 1) ? drugBankIds[0] : drugBankIds;
                    const criteria = { drugBankId, page: this.page - 1, isMultiList: true };
                    this.getDBankInteractions(criteria);
                }
                break;
                case 'Monitor':
                case 'Boosters':  break;
                default: {
                    const ids = this.materials.reduce((acc, { _id, labels }) => {
                        if (!acc.includes(_id)) acc.push(_id);
                        labels.forEach(label => {
                            if (!acc.includes(label._id)) acc.push(label._id);
                        });
                        return acc;
                    }, []);
                    const filterBy = {
                        isSearchResults: true,
                        page: this.page - 1,
                        id: ids,
                        materialCount: this.materials.filter(({ isIncluded }) => !isIncluded).length,
                        isMultiList: true
                    };
                    this.getInteractions(filterBy);
                }
                break;
            }
        },
        removeDupVinteractions(lists) {
            const seenVinteractionsMap = {};
            Object.values(lists).forEach(list => {
                list.interactions.forEach(interaction => {
                    const side1Queries = this.$store.getters.materialNamesMap[interaction.side1Material.name];
                    const side1Name = side1Queries ? side1Queries[0] : interaction.side1Material.name;
                    if (interaction.side2Material) {
                        const userQuery = this.$store.getters.materialNamesMap[interaction.side2Material.name];
                        const interactionName = `${side1Name} & ${userQuery ? userQuery[0] : interaction.side2Material.name}`;
                        
                        if (!seenVinteractionsMap[interactionName]) seenVinteractionsMap[interactionName] = [ interaction ];
                        else seenVinteractionsMap[interactionName].push(interaction);
                    } else {
                        const matchingMaterial = this.materials.find(m => m.labels.some(l => l._id === interaction.side2Label._id));
                        const userQueries = this.$store.getters.materialNamesMap[matchingMaterial.name];
                        const side2Name = userQueries ? userQueries[0] : matchingMaterial.name;
                        const interactionName = `${side1Name} & ${side2Name}`;
                        
                        if (!seenVinteractionsMap[interactionName]) seenVinteractionsMap[interactionName] = [ interaction ];
                        else seenVinteractionsMap[interactionName].push(interaction);
                    }
                });
            });
            Object.values(seenVinteractionsMap).forEach(interactions => {
                if (interactions.length <= 1) return;
                const leadInteraction = this.getMoreSeverInteraction(interactions);
                leadInteraction.isLead = true;
                interactions = interactions.filter(i => i._id !== leadInteraction._id);
                interactions.forEach(({ _id }) => {
                    Object.values(lists).forEach(list => {
                        list.interactions = list.interactions.filter(i => i._id !== _id);
                        list.total = list.interactions.length;
                    });
                });
            });
            return lists;
        },
        getMoreSeverInteraction(interactions) {
            const map = interactionUIService.getRecommendationOrderMap();
            interactions.slice().sort((a, b) => {
                return (map[a.recommendation.toLowerCase()] > map[b.recommendation.toLowerCase()]) ? -1 : (map[a.recommendation.toLowerCase()] < map[b.recommendation.toLowerCase()]) ? 1 : 0;
            });
            return interactions[0];
        },
        getPreviewWrapEl({ side2Material, side2Label }) {
            if (this.$route.name === 'Drug2Drug') return 'router-link';
            if (this.materialsLength <= 1) {
                if (!side2Material) return 'span';
                return 'router-link';
            } else {
                if (side2Material) return 'router-link';
                const materials = this.getVirtualSide2(side2Label._id);
                if (materials.length === 1) return 'router-link';
                return 'span'; 
            }
        },
        getInteractionLink({ _id, side2Material, side2Label }) {
            if (this.$route.name === 'Drug2Drug') return `/interaction/drug2drug/${_id}`;
            if (side2Material) return `/interaction/${_id}`;
            const materials = this.getVirtualSide2(side2Label._id);
            if (materials.length === 1) return `/interaction/${_id}/${materials[0]._id}`;
            return '';
        },
        getInteractionName(interaction) {
            if (interaction.name) return interaction.name;
            if (interaction.side2Material) return `${interaction.side1Material.name} & ${interaction.side2Material.name}`;
            if (interaction.side2Label) {
                if (this.materialsLength <= 1) return `${interaction.side2Label.name}`;
                const materials = this.getVirtualSide2(interaction.side2Label._id);
                
                if (materials.length === 1) return `${interaction.side1Material.name} & ${materials[0].name}`;
                const side2Names = materials.map(material => material.name);
                return `${interaction.side1Material.name} & ${side2Names[0]}`;
            }
        },
        isLongestList({ total }) {
            const totals = Object.values(this.lists).map(list => list.total);
            const max = Math.max(...totals);
            return total === max;
        },
        getVirtualSide2(labelId) {
            return this.materials.filter(material => material.labels.some(label => label._id === labelId));
        },
        getInteractionColor(recommendation) {
            return interactionUIService.getInteractionColor(recommendation);
        },
        reset() {
            this.lists = null;
            this.isLoading = false;
            this.maxTotal = 0;
            this.maxPageCount = 0;
            this.page = 1;
        }
    },
    created() {
        eventBus.$on(EV_search_results_cleared, this.reset);
    },
    beforeDestroy() {
        eventBus.$off(EV_search_results_cleared, this.reset);
    },
    components: {
        InteractionIcon,
        InteractionCapsules,
        ListPagination,
        PageFirstIcon,
        PageLastIcon,
        BellRingIcon,
        Tooltip
    }
}
</script>
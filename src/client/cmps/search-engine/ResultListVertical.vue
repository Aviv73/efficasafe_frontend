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
                    <component
                        :is="getPreviewWrapEl(interaction)"
                        :to="getInteractionLink(interaction)"
                    >
                        <interaction-capsules
                            :title="interaction.evidenceLevel || interaction.evidence_level"
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
                        class="vertical-list-lists-row"
                        :class="{ 'longest': isLongestList(lists.yellows) }"
                        v-for="interaction in lists.yellows[interactions]"
                        :key="interaction._id"
                    >
                        <component
                            :is="getPreviewWrapEl(interaction)"
                            :to="getInteractionLink(interaction)"
                        >
                            <interaction-capsules
                                :title="interaction.evidenceLevel || interaction.evidence_level"
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
                    <component
                        :is="getPreviewWrapEl(interaction)"
                        :to="getInteractionLink(interaction)"
                    >
                        <interaction-capsules
                            :title="interaction.evidenceLevel || interaction.evidence_level"
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
    </section>
</template>

<script>
import { interactionService } from '@/cms/services/interaction.service';

import ListPagination from '@/client/cmps/common/ListPagination';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';

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
        }
    },
    methods: {
        async getInteractions(filterBy) {
            this.isLoading = true;
            const lists = await this.$store.dispatch({ type: 'getInteractions', filterBy });
            this.lists = lists;
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
                    const drugBankIds = this.materials.map(mat => mat.drugBankId);
                    const drugBankId = (drugBankIds.length === 1) ? drugBankIds[0] : drugBankIds;
                    const criteria = { drugBankId, page: this.page - 1, isMultiList: true };
                    this.getDBankInteractions(criteria);
                }
                break;
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
        getPreviewWrapEl({ side2Material, side2Label }) {
            if (this.$route.name === 'Drug2Drug') return 'router-link';
            if (this.materials.length <= 1) {
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
                if (this.materials.length <= 1) return `${interaction.side2Label.name}`;
                const materials = this.getVirtualSide2(interaction.side2Label._id);
                
                if (materials.length === 1) return `${interaction.side1Material.name} & ${materials[0].name}`;
                const side2Names = materials.map(material => material.name);
                return `${interaction.side1Material.name} & ${side2Names.join(', ')}`;
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
            return interactionService.getInteractionColor(recommendation);
        }
    },
    components: {
        InteractionIcon,
        InteractionCapsules,
        ListPagination,
        PageFirstIcon,
        PageLastIcon
    }
}
</script>
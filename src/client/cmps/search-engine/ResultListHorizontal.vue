<template>
    <section class="horizontal-list">
        <header class="horizontal-list-header">
            <span class="horizontal-list-header-item">
                <button
                    class="flex-align-center"
                    title="Sort A-Z / Z-A"
                    @click="emitSort(2)"
                >
                    <sort-vertical-icon class="sort-icon" :size="12" />
                    <span>{{ side1Name }} vs {{ side2Name }}</span>
                </button>
                <button
                    @click="changeSortBySide"
                >
                    <swap-horizontal-icon :size="18" fillColor="#329D9C" />
                </button>
            </span>
            <span class="horizontal-list-header-item">
                <button
                    class="flex-align-center"
                    title="Sort by recommendation"
                    @click="emitSort(0)"
                >
                    <sort-vertical-icon class="sort-icon" :size="12" />
                    <span>Recommendation</span>
                </button>
            </span>
            <span class="horizontal-list-header-item">
                <button
                    class="flex-align-center"
                    title="Sort by level of evidence"
                    @click="emitSort(1)"
                >
                    <sort-vertical-icon class="sort-icon" :size="12" />
                    <span>Level of Evidence</span>
                </button>
                <tooltip on="hover" right right-bottom>
                    <template #content>
                        <div class="tooltip-content">
                            <ol v-if="$route.name === 'Drug2Drug'">
                                <li>
                                    information formally provided in official prescribing information
                                </li>
                                <li>
                                    based on scientific and clinical knowledge referenced from a variety of evidence sources
                                </li>
                            </ol>
                            <ul v-else>
                                <li>A - multi clinical or meta analysis</li>
                                <li>B - 1 clinical or cohort + pre-clinical</li>
                                <li>C - 1 clinical or cohort</li>
                                <li>D - case report</li>
                                <li>E - multi pre-clinical</li>
                                <li>F - 1 pre-clinical</li>
                            </ul>
                        </div>
                    </template>
                    <information-outline-icon
                        class="tooltip-trigger"
                        :size="12"
                    />
                </tooltip>
            </span>
        </header>
        <ul class="horizontal-list-list">
            <li
                class="horizontal-list-list-item"
                v-for="(interaction, idx) in interactions"
                :key="idx"
            >
                <interaction-preview
                    :interaction="interaction"
                    :materials="materials"
                    link
                />
            </li>
        </ul>
    </section>
</template>

<script>
import InteractionPreview from '@/client/cmps/search-engine/InteractionPreview';
import Tooltip from '@/client/cmps/common/Tooltip';

import SortVerticalIcon from '@/client/cmps/common/icons/SortVerticalIcon';
import SwapHorizontalIcon from 'vue-material-design-icons/SwapHorizontal';
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline';

export default {
    props: {
        interactions: {
            type: Array,
            default: () => []
        },
        pageCount: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        },
        materials: {
            type: Array,
            default: () => []
        }
    },
    data() {
      return {
        sortBySide: 1
      }
    },
    computed: {
        side1Name() {
            return (this.sortBySide === 1) ? 'Supplement' : 'Drug';
        },
        side2Name() {
            return (this.sortBySide === 1) ? 'Drug' : 'Supplement';
        }
    },
    methods: {
        emitSort(sortDepth) {
            this.$emit('list-sorted', { depth: sortDepth, side: this.sortBySide});
        },
        getInteractionKey(interaction) {
            return (interaction.side2Material) ? `${interaction._id}-${interaction.side2Material._id}` : interaction._id;
        },
        changeSortBySide() {
          if (this.sortBySide === 1) this.sortBySide = 2;
          else this.sortBySide = 1;
        }
    },
    components: {
        InteractionPreview,
        SortVerticalIcon,
        SwapHorizontalIcon,
        InformationOutlineIcon,
        Tooltip
    }
};
</script>
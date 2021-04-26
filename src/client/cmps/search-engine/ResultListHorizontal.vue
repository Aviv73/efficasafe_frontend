<template>
    <section class="horizontal-list">
        <header class="horizontal-list-header">
            <span class="horizontal-list-header-item">
                <button>
                    <sort-vertical-icon :size="12" />
                </button>
                <span>{{ sortBySide }} vs {{ side2Name }}</span>
                <button @click="changeSortBySide">
                    <swap-horizontal-icon :size="18" fillColor="#329D9C" />
                </button>
            </span>
            <span class="horizontal-list-header-item">
                <button>
                    <sort-vertical-icon :size="12" />
                </button>
                <span>Recommendation</span>
            </span>
            <span class="horizontal-list-header-item">
                <button>
                    <sort-vertical-icon :size="12" />
                </button>
                <span>Level of Evidence</span>
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
        sortBySide: 'Supplement'
      }
    },
    computed: {
      side2Name() {
        return (this.sortBySide === 'Supplement') ? 'Drug' : 'Supplement';
      }
    },
    methods: {
        getInteractionKey(interaction) {
            return (interaction.side2Material) ? `${interaction._id}-${interaction.side2Material._id}` : interaction._id;
        },
        changeSortBySide() {
          if (this.sortBySide === 'Supplement') this.sortBySide = 'Drug';
          else this.sortBySide = 'Supplement';
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
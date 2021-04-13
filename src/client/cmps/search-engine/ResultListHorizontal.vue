<template>
    <section class="horizontal-list">
        <header class="horizontal-list-header">
            <span class="horizontal-list-header-item">
                <button>
                    <pan-vertical-icon :size="12" />
                </button>
                <span>{{ sortBySide }} vs {{ side2Name }}</span>
                <button @click="changeSortBySide">
                    <swap-horizontal-icon :size="18" />
                </button>
            </span>
            <span class="horizontal-list-header-item">
                <button>
                    <pan-vertical-icon :size="12" />
                </button>
                <span>Recommendation</span>
            </span>
            <span class="horizontal-list-header-item">
                <button>
                    <pan-vertical-icon :size="12" />
                </button>
                <span>Level of Evidence</span>
            </span>
        </header>
        <ul class="horizontal-list-list">
            <li
                class="horizontal-list-list-item"
                v-for="interaction in interactions"
                :key="getInteractionKey(interaction)"
            >
                <interaction-preview :interaction="interaction" />
            </li>
        </ul>
    </section>
</template>

<script>
import InteractionPreview from '@/client/cmps/search-engine/InteractionPreview';

import PanVerticalIcon from 'vue-material-design-icons/PanVertical';
import SwapHorizontalIcon from 'vue-material-design-icons/SwapHorizontal';

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
        PanVerticalIcon,
        SwapHorizontalIcon
    }
};
</script>
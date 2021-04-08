<template>
  <section class="interaction-list">
      <header class="interaction-list-header">
          <span>
              <button>
                <pan-vertical-icon :size="12" />
              </button>
              Supplement vs Drug
              <button>
                <swap-horizontal-icon :size="18" />
              </button>
            </span>
          <span>
              <button>
                <pan-vertical-icon :size="12" />
              </button>
              Recommendation
            </span>
          <span>
              <button>
                <pan-vertical-icon :size="12" />
              </button>
              Level of Evidence
            </span>
      </header>
      <ul class="interaction-list-list">
          <li class="interaction-list-item"
            v-for="interaction in listData.interactions"
            :key="getInteractionKey(interaction)"
          >
            {{ interaction.name }}
          </li>
      </ul>
  </section>
</template>

<script>
import PanVerticalIcon from 'vue-material-design-icons/PanVertical';
import SwapHorizontalIcon from 'vue-material-design-icons/SwapHorizontal';

export default {
    props: {
        listData: {
            type: Object,
            required: true
        }
    },
    methods: {
        getInteractionKey(interaction) {
            return (interaction.side2Material) ? `${interaction._id}-${interaction.side2Material._id}` : interaction._id;
        }
    },
    components: {
        PanVerticalIcon,
        SwapHorizontalIcon
    }
}
</script>
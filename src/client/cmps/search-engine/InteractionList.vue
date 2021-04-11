<template>
  <section class="interaction-list">
      <header class="interaction-list-header">
          <span class="interaction-list-header-item"> 
              <button>
                <pan-vertical-icon :size="12" />
              </button>
              <span>Supplement vs Drug</span>
              <button>
                <swap-horizontal-icon :size="18" />
              </button>
            </span>
          <span class="interaction-list-header-item"> 
              <button>
                <pan-vertical-icon :size="12" />
              </button>
              <span>Recommendation</span>
            </span>
          <span class="interaction-list-header-item"> 
              <button>
                <pan-vertical-icon :size="12" />
              </button>
              <span>Level of Evidence</span>
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
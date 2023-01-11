<template>
  <section v-if="warnings && warnings.length" class="warnings-container" :class="{ down: isDb }">
    <span class="alerts-title">Alerts</span>
    <div v-for="(warning, idx) in warnings" :key="idx" class="warning">
      <template v-if="!isScreenNarrow">
        <tooltip on="hover" bottom style="border-radius: 18px">
          <template #content>
            <div class="tooltip-content">
              {{ warning.text }}
            </div>
          </template>
          <h2>{{ warning.title }}</h2>
        </tooltip>
      </template>
      <template v-else>
        {{ warning.text }}
      </template>
    </div>
  </section>
</template>

<script>
import { interactionUIService } from '@/cms/services/interaction-ui.service'

import Tooltip from '@/client/cmps/common/Tooltip'

export default {
  props: {
    side1Material: {
      type: Object
    },
    side2Material: {
      type: Object
    },
    isDb: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      warnings: []
    }
  },
  computed: {
    isScreenNarrow() {
      return this.$store.getters.isScreenNarrow
    }
  },
  created() {
    this.warnings = interactionUIService.createWarnings(this.side1Material, this.side2Material)
  },
  components: {
    Tooltip
  }
}
</script>

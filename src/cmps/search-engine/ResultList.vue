<template>
  <section class="results-list">
    <v-chip-group column v-if="!isLoading">
      <v-chip
        class="mb-4"
        v-for="interaction in interactions"
        :key="interaction._id"
        outlined
        :color="getInteractionColor(interaction)"
      >
        <router-link :to="`/interaction/${interaction._id}`" class="results-list-link">
          {{ getInteractionName(interaction) }}
        </router-link>
      </v-chip>
    </v-chip-group>
    <loader v-else />
  </section>
</template>

<script>
import loader from '@/cmps/general/LoadingCmp';

export default {
  props: {
    interactions: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    getInteractionName(interaction) {
      if (interaction.side2Material) {
        return `${interaction.side1Material.name} & ${interaction.side2Material.name}`
      }
      return interaction.side2Label.name;
    },
    getInteractionColor({ recommendation }) {
      switch (recommendation.toLowerCase()) {
        case 'avoid coadministration':
        case 'coadministration is not advised':
          return 'error';
        case 'caution should be taken':
        case 'coadministration is not contraindicated but caution should be taken':
        case 'coadministration is possible but caution should be taken':
          return 'warning'
        case 'coadministration is not contraindicated':
        case 'coadministration is possible':
        case 'coadministration is advised':
          return 'success';
        default:
          return 'primary';
      }
    }
  },
  components: {
    loader
  }
}
</script>
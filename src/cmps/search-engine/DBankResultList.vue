<template>
  <section class="d-bank-result-list">
    <v-chip-group column v-if="!isLoading">
      <v-chip
        class="mb-4"
        v-for="(interaction, idx) in dBankInteractions"
        :key="idx"
        outlined
        :color="getInteractionColor(interaction)"
      >
      {{ `${interaction.subject_drug.name} & ${interaction.affected_drug.name}` }}
      </v-chip>
    </v-chip-group>
    <loader v-else />
  </section>
</template>

<script>
import loader from '@/cmps/general/LoadingCmp';

export default {
  props: {
    dBankInteractions: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      required: true
    }
  },
  methods: {
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
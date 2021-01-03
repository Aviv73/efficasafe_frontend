<template>
  <section class="d-bank-result-list">
    <v-chip-group column v-if="!isLoading">
      <v-chip
        class="mb-4"
        v-for="(interaction, idx) in dBankInteractions"
        :key="idx"
        outlined
        v-recommendation-color:[interaction.recommendation]
      >
        <router-link 
          class="results-list-link"
          :to="`/d-bank-interaction/${interaction._id}`"
        >
          {{ `${interaction.subject_drug.name} & ${interaction.affected_drug.name}` }}
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
    dBankInteractions: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      required: true
    }
  },
  components: {
    loader
  }
}
</script>
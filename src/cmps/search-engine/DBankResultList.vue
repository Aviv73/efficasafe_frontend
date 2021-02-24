<template>
  <section class="d-bank-result-list">
    <v-chip-group column v-if="!isLoading">
      <v-chip
        class="mb-4"
        v-for="(interaction, idx) in dBankInteractions"
        :key="idx"
        outlined
        v-recommendation-color:[interaction.recommendation]
        v-material-query-name
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
    <p 
      class="text-center"
      v-if="!isLoading && !dBankInteractions.length && materialCount"
    >
      No results :(
    </p>
    <v-footer 
      v-if="materialCount && dBankPageCount > 1 && dBankInteractions.length"
      class="results-list-footer"
      tile 
    >
      <v-pagination 
        v-model="page"
        :length="dBankPageCount"
        :total-visible="10"
        light
        circle
        :disabled="isLoading"
      />
    </v-footer>
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
    },
    materialCount: {
      type: Number,
      required: true
    },
    dBankPageCount: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      page: 1
    }
  },
  watch: {
    page(val) {
      if (this.materialCount) {
        this.$emit('d-bank-page-changed', val);
      }
    },
    materialCount() {
      this.page = 1;
    }
  },
  components: {
    loader
  }
}
</script>
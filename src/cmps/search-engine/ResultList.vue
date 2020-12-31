<template>
  <section class="results-list">
    <v-chip-group column v-if="!isLoading">
      <span
        v-for="interaction in interactions"
        :key="interaction._id"
      >
        <v-chip
          class="mb-4"
          v-if="!interaction.side2Label"
          outlined
          v-recommendation-color:[interaction.recommendation]
        >
          <router-link 
            class="results-list-link"
            :to="(interaction.isVirual) ? `/interaction/${interaction._id}/${interaction.side2Material._id}` : `/interaction/${interaction._id}`" 
          >
            {{ getInteractionName(interaction) }}
          </router-link>
        </v-chip>
        <v-expansion-panels v-else flat class="results-list-expand-panel">
          <v-expansion-panel class="results-list-expand-panel-panel">
            <v-expansion-panel-header 
              class="results-list-expand-panel-panel-header pa-0"
              disable-icon-rotate
              hide-actions
            >
              <v-chip
                class="results-list-expand-panel-panel-chip mb-4"
                outlined
                v-recommendation-color:[interaction.recommendation]
              >
                {{ getInteractionName(interaction) }}
                <v-icon small class="ml-2">mdi-family-tree</v-icon>
              </v-chip>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <result-expand-preview :interaction="interaction" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </span>
    </v-chip-group>
    <loader v-else />
  </section>
</template>

<script>
import resultExpandPreview from '@/cmps/search-engine/ResultExpandPreview';
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
    }
  },
  components: {
    resultExpandPreview,
    loader
  }
}
</script>
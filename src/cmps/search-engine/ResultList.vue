<template>
  <section class="results-list">
    <v-chip-group column v-if="!isLoading">
      <span
        v-for="interaction in interactions"
        :key="getInteractionKey(interaction)"
      >
        <v-chip
          class="mb-4"
          v-if="!interaction.side2Label"
          outlined
          v-recommendation-color:[interaction.recommendation]
        >
          <router-link 
            class="results-list-link"
            :to="(interaction.isVirtual) ? `/interaction/${interaction._id}/${interaction.side2Material._id}` : `/interaction/${interaction._id}`" 
          >
            {{ getInteractionName(interaction) | material-name }}
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
                {{ getInteractionName(interaction) | material-name }}
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
    <p 
      class="text-center"
      v-if="!isLoading && !interactions.length && materialCount"
    >
      No results :(
    </p>
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
    },
    materialCount: {
      type: Number,
      required: true
    }
  },
  methods: {
    getInteractionName(interaction) {
      const side1Id = interaction.side1Material._id;
      const side2Id = (interaction.side2Material) ? interaction.side2Material._id : '';
      let name = (interaction.side2Material) ? `${interaction.side1Material.name} & ${interaction.side2Material.name}` : interaction.side2Label.name;
      const vInteractionsCount = this.interactions.filter(int => (int.side2Material && int.side2Material._id === side2Id) && int.side1Material._id === side1Id).length;
      
      if (interaction.isVirtual && vInteractionsCount > 1) {
        name += ` (${interaction.side2DraftName})`;
      }

      return name;
    },
    getInteractionKey(interaction) {
      return (interaction.side2Material) ? `${interaction._id}-${interaction.side2Material._id}` : interaction._id;
    }
  },
  components: {
    resultExpandPreview,
    loader
  }
}
</script>
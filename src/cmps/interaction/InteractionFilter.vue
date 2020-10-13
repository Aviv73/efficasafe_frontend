<template>
  <section class="material-filter">
    <div class="filter-input">
      <interaction-autocomplete
        :items="interactions"
        @emitAutocomplete="updateFilter"
        searchName="interaction"
      />
    </div>
    <div class="filter-type">
      <v-select
        :items="interaction.type"
        label="Interaction type"
        @change="emitFilter"
        v-model="filterBy.type"
      ></v-select>
    </div>

    <div class="filter-status">
      <v-select
        :items="interaction.isActive"
        label="Interaction Status"
        @change="emitFilter"
        v-model="filterBy.isActive"
      ></v-select>
    </div>
  </section>
</template>

<script>
import interactionAutocomplete from "@/cmps/interaction/InteractionAutocomplete";

export default {
  name: "interactionFilter",
  props: {
    interactions: Array,
  },
  data() {
    return {
      filterBy: {
        q: [],
        type: "all",
        isActive: "all",
      },
      interaction: {
        type: [
          {
            text: "All",
            value: "all",
          },
          {
            text: "Material - Material",
            value: "direct",
          },
          {
            text: "Material - Label",
            value: "indirect",
          },
        ],
        isActive: [
          {
            text: "All",
            value: "all",
          },
          {
            text: "Active",
            value: "true",
          },
          {
            text: "Inactive",
            value: "false",
          },
        ],
      },
    };
  },
  methods: {
    emitFilter() {
      this.$emit("emit-filter", JSON.parse(JSON.stringify(this.filterBy)));
    },
    updateFilter(interaction) {
      if (interaction && interaction.text) {
        this.filterBy.q = JSON.parse(JSON.stringify(interaction.text));
      } else {
        this.filterBy.q = "";
      }
      this.emitFilter();
    },
  },
  components: {
    interactionAutocomplete,
  },
};
</script>
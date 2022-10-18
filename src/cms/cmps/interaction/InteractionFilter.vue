<template>
  <section class="material-filter">
    <div class="filter-input">
      <interaction-autocomplete
        @emitAutocomplete="updateFilter"
      />
    </div>

    <div class="">
      <v-text-field
        type="text"
        label="Search with free text"
        placeholder="Search with free text"
        v-model="filterBy.q"
        @change="emitFilter"
        clearable
      />
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
import interactionAutocomplete from '@/cms/cmps/interaction/InteractionAutocomplete';

export default {
  name: 'interactionFilter',
  data() {
    return {
      filterBy: {
        q: '',
        isActive: '',
      },
      interaction: {
        isActive: [
          {
            text: 'All',
            value: '',
          },
          {
            text: 'Active',
            value: true,
          },
          {
            text: 'Inactive',
            value: false,
          },
        ],
      },
    };
  },
  methods: {
    emitFilter() {
      this.$emit('emit-filter', JSON.parse(JSON.stringify(this.filterBy)));
    },
    updateFilter(interaction) {
      if (interaction && interaction.text) {
        this.filterBy.q = JSON.parse(JSON.stringify(interaction.text));
      } else {
        this.filterBy.q = '';
      }
      this.emitFilter();
    },
  },
  components: {
    interactionAutocomplete,
  },
};
</script>
<template>
  <section class="material-filter">
    <div class="filter-input">
      <async-autocomplete 
        @emitAutocomplete="updateFilter"
      />
    </div>
    <div class="filter-type">
      <v-select
        id="mat-filter-type"
        :items="material.type"
        label="Material type"
        @change="emitFilter"
        v-model="filterBy.type"
      ></v-select>
    </div>
  </section>
</template>

<script>
import asyncAutocomplete from '@/cmps/AsyncAutocomplete';

export default {
  name: 'materialFilter',
  props: {
    materials: Array,
  },
  data() {
    return {
      filterBy: {
        q: '',
        type: 'all',
      },
      material: {
        type: [
          {
            text: 'All',
            value: 'all',
          },
          {
            text: 'Drug',
            value: 'drug',
          },
          {
            text: 'Herb',
            value: 'herb',
          },
        ],
      },
    };
  },
  methods: {
    emitFilter() {
      this.$emit('emit-filter', JSON.parse(JSON.stringify(this.filterBy)));
    },
    updateFilter(material) {
      if (material && material.text) {
        this.filterBy.q = material.text;
      } else {
        this.filterBy.q = '';
      }
      this.emitFilter();
    },
  },
  components: {
    asyncAutocomplete
  },
};
</script>
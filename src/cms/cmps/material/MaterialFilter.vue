<template>
  <section class="material-filter">
    <div class="filter-input">
      <autocomplete 
        @emitAutocomplete="updateFilter"
        allow-term-search
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
import autocomplete from '@/cms/cmps/Autocomplete';

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
          {
            text: 'Vitamin',
            value: 'vitamin'
          },
          {
            text: 'Amino acid',
            value: 'amino acid'
          },
          {
            text: 'Mineral',
            value: 'mineral'
          },
          {
            text: 'Nutraceutical',
            value: 'nutraceutical'
          },
          {
            text: 'Essential oil',
            value: 'essential oil'
          },
          {
            text: 'Food',
            value: 'food'
          }
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
    autocomplete
  },
};
</script>
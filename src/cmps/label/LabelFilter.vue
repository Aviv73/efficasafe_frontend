<template>
  <section class="label-filter">
    <div class="filter-input">
      <autocomplete
        :items="labels"
        @emitAutocomplete="updateFilter"
        searchName="Search label"
      />
    </div>
  </section>
</template>

<script>
import autocomplete from '@/cmps/Autocomplete';

export default {
  name: 'labelFilter',
  props: {
    labels: Array,
  },
  data() {
    return {
      filterBy: {
        q: ''
      }
    };
  },
  methods: {
    updateFilter(label) {
      if (label) {
        this.filterBy.q = label.name;
      } else {
        this.filterBy.q = '';
      }
      this.$emit('emit-filter', JSON.parse(JSON.stringify(this.filterBy)));
    },
  },
  components: {
    autocomplete,
  },
};
</script>
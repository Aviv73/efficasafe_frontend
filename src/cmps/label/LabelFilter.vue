<template>
  <section class="label-filter">
    <div class="filter-input">
      <autocomplete
        :items="labels"
        @emitAutocomplete="updateFilter"
        searchName="Search label"
      />
    </div>
      <v-select
        :items="isSuperOpts"
        class="label-filter-select"
        label="Label type"
        v-model="filterBy.isSuper"
        @change="emitFilterBy"
      ></v-select>
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
        q: '',
        isSuper: ''
      },
      isSuperOpts: [
        {
          text: 'All',
          value: ''
        },
        {
          text: 'Super',
          value: true
        },
        {
          text: 'Regular',
          value: false
        }
      ]
    };
  },
  methods: {
    updateFilter(label) {
      if (label) {
        this.filterBy.q = label.name;
      } else {
        this.filterBy.q = '';
      }
      this.emitFilterBy();
    },
    emitFilterBy() {
      this.$emit('emit-filter', JSON.parse(JSON.stringify(this.filterBy)));
    }
  },
  components: {
    autocomplete,
  },
};
</script>
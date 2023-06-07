<template>
  <form @submit.prevent="emitFilter" class="item-filter flex align-center space-between">
    <FormInput placeholder="search" v-model="filterBy.filter.search"/>
    <!-- <button @click="emitFilter">{{$t('filter')}}</button> -->
    <v-btn @click="emitFilter">Search</v-btn>
  </form>
</template>

<script>
import FormInput from './FormInput.vue';
export default {
  name: 'ItemFilter',
  props: {
    initFilter: {
      type: Object,
      required: true
    }
  },
  methods: {
    emitFilter() {
      this.$emit('filtered', this.filterBy);
    }
  },
  data() {
    return {
      filterBy: null
    }
  },
  created() {
    this.filterBy = JSON.parse(JSON.stringify(this.initFilter));
  },
  components: { FormInput }
}
</script>
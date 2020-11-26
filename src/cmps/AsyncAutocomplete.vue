<template>
  <section class="autocomplete">
    <v-autocomplete
      v-model="select"
      :items="results"
      :search-input.sync="search"
      :loading="isLoading"
      @change="emitAutocomplete"
      :label="placeholder"
      :disabled="isDisabled"
      clearable
      cache-items
      flat
      return-object
    />
  </section>
</template>

<script>
export default {
  name: 'AsyncAutocomplete',
  props: {
    placeholder: {
      type: String,
      default: 'Search Material'
    },
    isDisabled: {
      type: Boolean,
      defualt: false
    }
  },
  data() {
    return {
      search: null,
      items: [],
      select: null,
      isLoading: false,
    };
  },
  watch: {
    search(val) {
      if (val && val !== this.select) this.getResults(val);
    },
  },
  computed: {
    materials() {
      return this.$store.getters.materials;
    },
    results() {
      if (!this.items) return [];
      return this.items.map((item) => {
        const result = {
          _id: item._id,
          text: item.name,
        };
        if (item.type) result.type = item.type;
        if (item.src) result.src = item.src;
        return result;
      });
    },
  },
  methods: {
    async getResults(q) {
      this.isLoading = true;
      const criteria = { q };
      const materials = await this.$store.dispatch({
        type: 'loadAutoCompleteResults',
        criteria,
      });
      this.items = materials;
      this.isLoading = false;
    },
    emitAutocomplete() {
      this.select = this.select || null;
      this.$emit('emitAutocomplete', JSON.parse(JSON.stringify(this.select)));
    },
  },
  async created() {
    if (this.materials) this.items = this.materials;
    else this.items = await this.getResults(this.search);
  },
};
</script>
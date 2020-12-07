<template>
  <section class="autocomplete">
    <v-autocomplete
      :items="results"
      label="Search interaction"
      v-model="autocompleteResult"
      :search-input.sync="search"
      :loading="isLoading"
      @change="emitAutocomplete"
      clearable
      return-object
    />
  </section>
</template>

<script>
export default {
  name: "InteractionAutocomplete",
  data() {
    return {
      items: [],
      search: null,
      autocompleteResult: null,
      isLoading: false
    };
  },
  watch: {
    search(val) {
      if (val && val !== this.select) this.getResults(val);
    }
  },
  computed: {
    results() {
      if (!this.items) return [];
      return this.items.reduce((acc, item) => {
        if (acc.findIndex(currItem => currItem._id === item.side1Material._id) === -1) {
          acc.push({
              _id: item.side1Material._id,
              text: item.side1Material.name,
          });
        }
        if (item.side2Material) {
          acc.push({
            _id: item.side2Material._id,
            text: item.side2Material.name,
          });
        } else if (item.side2Label) {
          acc.push({
            _id: item.side2Label._id,
            text: item.side2Label.name,
          });
        }
        return acc;
      }, []);
    },
  },
  methods: {
    async getResults(q) {
      this.isLoading = true;
      const filterBy = { q: q || '', limit: 0, page: 0 };
      const interactions = await this.$store.dispatch({ type: 'getInteractions', filterBy });
      this.items = interactions;
      this.isLoading = false;
    },
    emitAutocomplete() {
      if (this.autocompleteResult) {
        this.$emit(
          "emitAutocomplete",
          JSON.parse(JSON.stringify(this.autocompleteResult))
        );
      } else {
        this.$emit("emitAutocomplete", null);
      }
    },
  },
  created() {
    this.getResults(this.search);
  }
};
</script>
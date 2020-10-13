<template>
  <section class="autocomplete">
    <v-autocomplete
      :items="initialItems"
      :label="searchNameStr"
      v-model="autocompleteResult"
      @change="emitAutocomplete"
      clearable
      return-object
    />
  </section>
</template>

<script>
export default {
  name: "InteractionAutocomplete",
  props: {
    items: Array,
    searchName: String,
  },
  data() {
    return {
      initialItems: [],
      autocompleteResult: null,
    };
  },
  computed: {
    searchNameStr() {
      return `Search ${this.searchName}`;
    },
    itemNames() {
      return this.items.reduce((acc, item) => {
        if (item.side1MaterialId) {
          acc.push({
            _id: item.side1MaterialId._id,
            text: item.side1MaterialId.name,
          });
        } else {
          acc.push({
            _id: item.side1LabelId._id,
            text: item.side1LabelId.name,
          });
        }

        if (item.side2MaterialId) {
          acc.push({
            _id: item.side2MaterialId._id,
            text: item.side2MaterialId.name,
          });
        } else {
          acc.push({
            _id: item.side2LabelId._id,
            text: item.side2LabelId.name,
          });
        }
        return acc;
      }, []);
    },
  },
  methods: {
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
    this.initialItems = JSON.parse(JSON.stringify(this.itemNames));
  },
};
</script>
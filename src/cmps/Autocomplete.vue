<template>
  <section class="autocomplete" v-if="initialItems !== null">
    <v-autocomplete
      :items="initialItems"
      :label="searchNameStr"
      :search-input.sync="search"
      v-model="autocompleteResult"
      @change="emitAutocomplete"
      clearable
      return-object
    />
  </section>
</template>

<script>
export default {
  name: "Autocomplete",
  props: {
    items: Array,
    searchName: String,
  },
  data() {
    return {
      search: "",
      initialItems: null,
      autocompleteResult: null,
    };
  },
  computed: {
    searchNameStr() {
      return `${this.searchName}`;
    },
    itemNames() {
      return this.items.map((item) => {
        var newItem = {
          _id: item._id,
          text: item.name,
        };
        if (item.type) newItem.type = item.type;
        if (item.src) newItem.src = item.src;
        return newItem;
      });
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
<template>
  <section class="autocomplete" v-if="initialItems !== null">
    <v-autocomplete
      :items="initialItems"
      :label="searchNameStr"
      :search-input.sync="search"
      v-model="autocompleteResult"
      @change="emitAutocomplete"
      cache-items
      clearable
      :flat="isFlat"
      :solo-inverted="isSoloInverted"
      :dark="isDark"
      return-object
    />
  </section>
</template>

<script>
export default {
  name: 'Autocomplete',
  props: {
    items: Array,
    searchName: String,
    isSoloInverted: {
      type: Boolean,
      default: false
    },
    isFlat: {
      type: Boolean,
      default: false
    },
    isDark: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      search: '',
      initialItems: null,
      autocompleteResult: null,
    };
  },
  computed: {
    searchNameStr() {
      return this.searchName;
    },
    itemNames() {
      return this.items.map((item) => {
        const newItem = {
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
      let result = null;
      if (this.autocompleteResult) {
        result = {
          name: this.autocompleteResult.text,
          _id: this.autocompleteResult._id,
        };
      }

      this.$emit('emitAutocomplete', result);
    },
  },
  created() {
    this.initialItems = this.itemNames;
  },
};
</script>
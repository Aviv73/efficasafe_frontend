<template>
  <section class="tree-container">
    <v-sheet class="pa-4 primary lighten-2">
      <v-text-field
        @input="handleSearch"
        label="Search Label.."
        append-icon="mdi-magnify"
        dark
        flat
        solo-inverted
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      ></v-text-field>
    </v-sheet>
    <v-card-text>
      <tree-view 
        v-if="items"
        :items="items"
        :search="search"
        :depth="0"
        @selection-changed="saveSelection($event)"
        ></tree-view>
      <loading-cmp v-else />
    </v-card-text>
    <v-divider></v-divider>
  </section>
</template>

<script>
import treeView from '@/cmps/general/TreeView';
import loadingCmp from '@/cmps/general/LoadingCmp';

export default {
  data() {
    return {
      search: '',
      selection: [],
    };
  },
  watch: {
    selection() {
      this.$emit(
        'branches-selected',
        JSON.parse(JSON.stringify(this.selection))
      );
    },
  },
  computed: {
    items() {
      return [];
    }
  },
  methods: {
    saveSelection(selection) {
      this.selection = selection;
    }
  },
  components: {
    loadingCmp,
    treeView
  },
};
</script>

<style>
</style>
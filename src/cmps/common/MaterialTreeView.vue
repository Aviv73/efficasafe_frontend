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
        clear-icon="mdi-close-circle-outline"
      ></v-text-field>
    </v-sheet>
    <v-card-text>
      <tree-view 
        v-if="filteredAtcLabels"
        :items="filteredAtcLabels"
        :search="search"
        :depth="0"
        @selection-changed="saveSelection($event)"
        :finalSelection="selection"
        :primaryMaterialIds="primaryMaterialIds"
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
  props: {
    selection: {
      type: Array,
      required: true
    },
    primaryMaterialIds: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      search: '',
      atcSelection: [],
    };
  },
  watch: {
    atcSelection() {
      this.$emit(
        'branches-selected',
        JSON.parse(JSON.stringify(this.atcSelection))
      );
    },
  },
  computed: {
    atcLabels() {
      return this.$store.getters.atcLabels;
    },
    filteredAtcLabels() {
      if (!this.atcLabels) return null;
      const getNodes = (result, object) => {
        if (object.name.toLowerCase().includes(this.search.toLowerCase())) {
          result.push(object);
          return result;
        }
        if (object.children) {
          const nodes = object.children.reduce(getNodes, []);
          if (nodes.length) result.push({ ...object, children: nodes });
        }
        return result;
      };
      return this.atcLabels.reduce(getNodes, []);
    }
  },
  methods: {
    saveSelection(selection) {
      this.atcSelection = selection;
    },
    handleSearch(val) {
      let timerId;
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        this.search = val;
      }, 500);
    }
  },
  mounted() {
    if (!this.atcLabels) {
      this.$store.dispatch({ type: 'loadAtcLabels' });
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
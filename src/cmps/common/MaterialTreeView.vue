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
        v-if="atcLabels"
        :items="atcLabels"
        :search="search"
        :depth="0"
        @selection-changed="saveSelection($event)"
        :finalSelection="selection"
        :primaryMaterialIds="primaryMaterialIds"
      />
      <loading-cmp v-else class="tree-container-loader" />
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
      atcSelection: []
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
    }
  },
  methods: {
    async saveSelection(selection) {
      const materialIds = selection.reduce((acc, node) => {
        if (node.materialIds && node.materialIds.length) {
          node.materialIds.forEach(_id => {
            if (!acc.includes(_id)) acc.push( _id);
          });
        }
        return acc;
      }, []);
      const criteria = { materialId: materialIds };
      const materials = await this.$store.dispatch({ type: 'getMaterials', criteria });
      this.atcSelection = materials;
    },
    handleSearch(val) {
      let timerId;
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        this.search = val;
      }, 500);
    },
    loadTreeLabels() {
      this.$store.dispatch({ type: 'loadAtcLabels' });
    }
  },
  mounted() {
    if (!this.atcLabels) {
      this.loadTreeLabels();
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
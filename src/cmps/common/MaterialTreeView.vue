<template>
  <section class="tree-container">
    <v-sheet class="pa-4 primary lighten-2">
      <v-text-field
        v-model="search"
        label="Search label.."
        @input="handleTreeSearch"
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
      <v-treeview
        v-if="filteredAtcLabels"
        :items="filteredAtcLabels"
        ref="treeView"
        selectable
        selected-color="primary"
        selection-type="leaf"
        item-key="_id"
        dense
        hoverable
        v-model="selection"
        open-on-click
        return-object
        transition
      ></v-treeview>
      <loading-cmp v-else />
    </v-card-text>
    <v-divider></v-divider>
  </section>
</template>

<script>
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
        if (object.children.length) {
          const nodes = object.children.reduce(getNodes, []);
          if (nodes.length) result.push({ ...object, children: nodes });
        }
        return result;
      };
      var filteredLabels = this.atcLabels.reduce(getNodes, []);
      console.log('Open Labels:', filteredLabels);
      return filteredLabels;
    },
  },
  methods: {
    handleTreeSearch(val) {
      if (val.length > 2) this.$refs.treeView.updateAll(true);
      else if (!val.length) this.$refs.treeView.updateAll(false);
    },
  },
  created() {
    this.$store.dispatch({ type: 'loadAtcLabels' });
  },
  components: {
    loadingCmp,
  },
};
</script>

<style>
</style>
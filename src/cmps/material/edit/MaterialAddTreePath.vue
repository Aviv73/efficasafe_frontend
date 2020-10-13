<template>
  <v-card>
    <v-card-title class="primary headline" style="color:white; font-weight:bold;">
      <v-icon dark left>mdi-file-tree</v-icon>Add ATC label
      <v-spacer></v-spacer>
      <v-icon dark right @click="closeDialog">mdi-window-close</v-icon>
    </v-card-title>
    <v-sheet class="pa-4 primary lighten-2">
      <v-text-field
        v-model="search"
        label="Search label.."
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
        v-if="atcLabels"
        :items="atcLabels"
        :search="search"
        selectable
        selected-color="primary"
        selection-type="independent"
        item-key="_id"
        dense
        hoverable
        v-model="selection"
        return-object
        transition
      ></v-treeview>
      <loading-cmp v-else />
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="normal" @click="closeDialog">Cancel</v-btn>
      <v-btn color="primary" @click="addLabelPaths" :disabled="!selection.length">Add to material</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import loadingCmp from "@/cmps/general/LoadingCmp";

export default {
  data() {
    return {
      search: "",
      selection: [],
    };
  },
  computed: {
    atcLabels() {
      return this.$store.getters.atcLabels;
    },
    labels() {
      return this.$store.getters.labels;
    },
  },
  methods: {
    async addLabelPaths() {
      const selectedPaths = JSON.parse(JSON.stringify(this.selection));
      try {
        const labelPaths = await this.$store.dispatch({
          type: "getLabelPaths",
          selectedPaths,
        });
        this.$emit("add-label-paths", labelPaths);
      } catch (err) {
        console.log("ERROR", err);
      }
      this.closeDialog();
    },
    closeDialog() {
      this.$emit("close-dialog");
      this.selection = [];
    },
  },
  created() {
    this.$store.dispatch({ type: "loadAtcLabels" });
  },
  components: {
    loadingCmp,
  },
};
</script>
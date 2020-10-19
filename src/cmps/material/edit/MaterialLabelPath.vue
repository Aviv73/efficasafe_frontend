<template>
  <section class="material-label-path" v-if="labelPaths">
    <div class="material-label-row">
      <autocomplete
        v-if="labels !== null"
        :items="labels"
        @emitAutocomplete="addLabel"
        searchName="labels"
      />
      <v-btn small class="label-add-btn" color="info" @click="$emit('add-custom-label')">
        <v-icon dark left>mdi-label-outline</v-icon>new label
      </v-btn>
      <v-btn small class="label-add-btn" color="info" @click="$emit('open-dialog')">
        <v-icon dark left>mdi-file-tree</v-icon>ATC tree
      </v-btn>
    </div>
    <label-path-list :labelPaths="labelPaths" :isEdit="true" @remove-path="removeLabelPath" />
  </section>
</template>

<script>
import autocomplete from "@/cmps/Autocomplete";
import labelPathList from "@/cmps/material/details/LabelPathList";

export default {
  name: "MaterialLabelPath",
  props: {
    labelPaths: Array,
  },
  computed: {
    labels() {
      return this.$store.getters.labels;
    },
  },
  methods: {
    loadLabels() {
      const filterBy = { src: "atc" };
      this.$store.dispatch({ type: "loadLabels", filterBy });
    },
    addLabel(label) {
      if (label) {
        const path = [
          [
            {
              _id: label._id,
              name: label.text,
            },
          ],
        ];
        this.$emit("add-label", path);
      }
    },
    removeLabelPath(idx) {
      this.$emit("remove-path", 'labelPaths', idx);
    },
  },
  created() {
    this.loadLabels();
  },
  components: {
    autocomplete,
    labelPathList,
  },
};
</script>

<style>
</style>
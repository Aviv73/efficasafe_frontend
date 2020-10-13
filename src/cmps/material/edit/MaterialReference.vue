<template>
  <section class="material-references">
    <div class="references-action">
      <v-file-input max-width="40"
        id="csv-file"
        @change="parseReferenceFile"
        accept=".csv"
        label="Import references"
        ref="fileInput"
      />
      <!-- <v-btn color="primary" @click="onPickFile">
        <v-icon left>mdi-paperclip</v-icon>Import references
      </v-btn> -->
      <v-btn small class="upload-csv-btn" color="primary" @click="$emit('save-data')" :disabled="!isNew && !references.length">
        <v-icon left>mdi-cloud-upload</v-icon>upload
      </v-btn>
    </div>

    <reference-table :references="references" v-if="references.length" />
  </section>
</template>

<script>
import papa from "papaparse";
import referenceTable from "../../common/ReferenceTable";

export default {
  props: {
    references: Array,
  },
  data() {
    return {
      isNew: false,
    };
  },
  methods: {
    async parseReferenceFile() {
      const file = document.getElementById("csv-file").files[0];
      if (file) {
        papa.parse(file, {
          header: true,
          complete: (results) => {
            const data = results.data;

            this.isNew = true;
            this.$emit("data-ready", data);
          },
        });
      }
    },
    saveReferences() {
      this.$emit("save-references");
    },
  },
  components: {
    referenceTable,
  },
};
</script>
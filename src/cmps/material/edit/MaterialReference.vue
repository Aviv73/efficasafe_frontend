<template>
  <section class="material-references">
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
  components: {
    referenceTable,
  },
};
</script>
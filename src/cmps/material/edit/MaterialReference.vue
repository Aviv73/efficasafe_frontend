<template>
  <section class="material-references">
    <reference-table :references="references" v-if="references.length" />
  </section>
</template>

<script>
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
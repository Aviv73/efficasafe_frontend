<template>
  <section class="atc-page" v-if="atcLabels !== null">
    <v-treeview
      :items="atcLabels"
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
    <!-- <v-btn @click="printSelection">PRINT</v-btn> -->
  </section>
</template>

<script>
export default {
  data() {
    return {
      selection: [],
    };
  },
  computed: {
    atcLabels() {
      return this.$store.getters.atcLabels;
    },
  },
  methods: {
    // printSelection() {
    //   console.log("Selection:", this.selection);
    // },
  },
  created() {
    this.$store.dispatch({ type: "loadAtcLabels" });
  },
};
</script>
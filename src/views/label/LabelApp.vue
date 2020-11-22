<template>
  <section class="label-page">
    <div class="container">
      <v-card v-if="labels" class="mb-10">
        <v-card-title>
          Labels collection
          <v-spacer></v-spacer>
          <v-btn color="primary" to="/label/edit/">new label</v-btn>
        </v-card-title>
        <label-filter :labels="labels" @emit-filter="setFilter" />
        <label-list :labels="labels" />
      </v-card>
      <icons-map />
    </div>
  </section>
</template>

<script>
import labelFilter from "@/cmps/label/LabelFilter";
import labelList from "@/cmps/label/LabelList";
import iconsMap from "@/cmps/general/IconsMap";

export default {
  watch: {
    "$route.query": function () {
      this.loadLabels();
    },
  },
  computed: {
    labels() {
      return this.$store.getters.labels;
    },
  },
  methods: {
    setFilter(filterBy) {
      if (!filterBy.src || filterBy.src === "all") {
        delete filterBy.src;
      }
      if (filterBy.isSuper === '') {
        delete filterBy.isSuper;
      }
      if (!filterBy.q) {
        delete filterBy.q;
      }
      const queryStr = "?" + new URLSearchParams(filterBy).toString();
      this.$router.push(queryStr);
    },
    loadLabels() {
      const filterBy = this.$route.query;
      this.$store.dispatch({ type: "loadLabels", filterBy });
    },
    removeLabel(labelId) {
      this.$store.dispatch({ type: "removeLabel", labelId });
    },
  },
  created() {
    this.loadLabels();
  },
  components: {
    labelFilter,
    labelList,
    iconsMap,
  },
};
</script>
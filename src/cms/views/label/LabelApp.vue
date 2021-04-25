<template>
  <section class="label-page">
    <div class="container">
      <v-card v-if="labels" class="mb-10">
        <v-card-title>
          Labels collection
          <v-spacer></v-spacer>
          <v-btn color="primary" to="/label/edit/">new label</v-btn>
        </v-card-title>
        <label-filter @emit-filter="setFilter" />
        <label-list
          :labels="labels"
          :totalItems="totalItems"
          :loading="isLoading"
          @options-updated="setFilter"
          @header-clicked="setFilter"
          @delete-many-labels="removeMany"
        />
      </v-card>
      <icons-map />
    </div>
  </section>
</template>

<script>
import labelFilter from "@/cms/cmps/label/LabelFilter";
import labelList from "@/cms/cmps/label/LabelList";
import iconsMap from "@/cms/cmps/general/IconsMap";

export default {
  data() {
    return {
      isLoading: false,
    };
  },
  watch: {
    "$route.query": {
      handler() {
        this.loadLabels();
      },
      immediate: true,
    },
  },
  computed: {
    labels() {
      return this.$store.getters.labels;
    },
    totalItems() {
      return this.$store.getters.labelsCount;
    },
  },
  methods: {
    setFilter(filterBy) {
      const criteria = {
        ...this.$route.query,
        ...filterBy,
      };
      const queryStr = "?" + new URLSearchParams(criteria).toString();
      this.$router.push(queryStr);
    },
    async loadLabels() {
      this.isLoading = true;
      const filterBy = this.$route.query;

      filterBy.sortBy = filterBy.sortBy || ["isSuper", "name"];
      filterBy.isDesc = filterBy.isDesc || [true, false];
      filterBy.limit = filterBy.limit || 15;
      if (filterBy.q) filterBy.page = 0;

      await this.$store.dispatch({ type: "loadLabels", filterBy });
      this.isLoading = false;
    },
    async removeMany(ids) {
      await this.$store.dispatch({ type: "removeLabels", ids });
    },
  },
  components: {
    labelFilter,
    labelList,
    iconsMap,
  },
};
</script>
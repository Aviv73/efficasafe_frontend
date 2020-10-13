<template>
  <section class="material-app">
    <v-card class="mb-10" v-if="materials">
      <v-card-title>
        Materials collection
        <v-spacer></v-spacer>
        <v-btn color="primary" to="/material/edit/">new material</v-btn>
      </v-card-title>

      <material-filter :materials="materials" @emit-filter="setFilter" />
      <material-list :materials="materials" :loading="loading" @options-updated="setSort" />
    </v-card>

    <icons-map />
  </section>
</template>

<script>
import materialFilter from "@/cmps/material/MaterialFilter";
import materialList from "@/cmps/material/MaterialList";
import iconsMap from "@/cmps/general/IconsMap";

export default {
  data() {
    return {
      loading: false,
      sortBy: null,
    };
  },
  watch: {
    "$route.query": function () {
      this.loadMaterials();
    },
  },
  computed: {
    materials() {
      return this.$store.getters.materials;
    },
  },
  methods: {
    setSort(sortBy) {
      this.sortBy = sortBy;
      this.loadMaterials()
    },
    setFilter(filterBy) {
      // If autocomplete cmp clears search, it emits filterBy.q = ""
      if (!filterBy.type || filterBy.type === "all") {
        delete filterBy.type;
      }

      if (!filterBy.q) {
        // To clear the browser navigation from q= at the end
        delete filterBy.q;
      }

      const queryStr = "?" + new URLSearchParams(filterBy).toString();

      this.$router.push(queryStr);
    },
    async loadMaterials() {
      this.loading = true;
      const criteria = {
        filterBy: this.$route.query,
        sortBy: this.sortBy
      }
      // const filterBy = this.$route.query;
      // console.log("MAT APP FILTER By from query", filterBy);
      await this.$store.dispatch({ type: "loadMaterials", criteria });
      this.loading = false;
    },
  },
  created() {
    this.loadMaterials();
  },
  components: {
    materialFilter,
    materialList,
    iconsMap,
  },
};
</script>
<template>
  <section class="material-app">
    <div class="container">
      <v-card class="mb-10" v-if="materials">
        <v-card-title>
          Materials collection
          <v-spacer></v-spacer>
          <v-btn color="primary" to="/material/edit/">new material</v-btn>
        </v-card-title>

        <material-filter
          :materials="materials"
          @emit-filter="setFilter"
        />
        <material-list
          :materials="materials"
          :loading="loading"
          :totalItems="totalItems"
          @options-updated="paginate"
          @header-clicked="setSort"
        />
      </v-card>

      <icons-map />
    </div>
  </section>
</template>

<script>
import materialFilter from '@/cmps/material/MaterialFilter';
import materialList from '@/cmps/material/MaterialList';
import iconsMap from '@/cmps/general/IconsMap';

export default {
  data() {
    return {
      loading: false,
      tableData: null
    };
  },
  watch: {
    '$route.query': function () {
      this.loadMaterials();
    },
  },
  computed: {
    materials() {
      return this.$store.getters.materials;
    },
    totalItems() {
      return this.$store.getters.total;
    },
  },
  methods: {
    setSort(propName, isDesc) {
      const criteria = {
        ...this.$route.query,
        sortBy: propName,
        isDesc
      }
      const queryStr = '?' + new URLSearchParams(criteria).toString();
      this.$router.push(queryStr);
    },
    paginate(tableData) {
      this.tableData = tableData;
      this.loadMaterials();
    },
    setFilter(filterBy) {
      const { q, type } = filterBy;
      const criteria = {
        ...this.$route.query,
        q,
        type
      }
      const queryStr = '?' + new URLSearchParams(criteria).toString();
      if (filterBy.type !== this.$route.query.type && this.tableData) {
        this.tableData.page = 1;
      }
      this.$router.push(queryStr);
    },
    async loadMaterials() {
      const criteria = this.$route.query;
      this.loading = true;
      if (this.tableData) {
        let { page, itemsPerPage } = this.tableData;
        criteria.limit = itemsPerPage;
        criteria.page = --page;
      } else criteria.limit = 10;
      if (criteria.q) criteria.page = 0;

      await this.$store.dispatch({ type: 'loadMaterials', criteria });
      this.loading = false;
    }
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
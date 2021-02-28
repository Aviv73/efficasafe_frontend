<template>
  <section class="material-app">
    <div class="container">
      <v-card class="mb-10" v-if="materials">
        <v-card-title>
          Materials collection
          <v-spacer></v-spacer>
          <v-btn color="primary" to="/cms/material/edit/">new material</v-btn>
        </v-card-title>

        <material-filter
          :materials="materials"
          @emit-filter="setFilter"
        />
        <material-list
          :materials="materials"
          :loading="loading"
          :totalItems="totalItems"
          @options-updated="setFilter"
          @header-clicked="setFilter"
        />
      </v-card>

      <icons-map />
    </div>
  </section>
</template>

<script>
import materialFilter from '@/cms/cmps/material/MaterialFilter';
import materialList from '@/cms/cmps/material/MaterialList';
import iconsMap from '@/cms/cmps/general/IconsMap';

export default {
  data() {
    return {
      loading: false
    };
  },
  watch: {
    '$route.query': {
      handler() {
        this.loadMaterials();
      },
      immediate: true
    },
  },
  computed: {
    materials() {
      return this.$store.getters.materials;
    },
    totalItems() {
      return this.$store.getters.materialCount;
    },
    routeQuery() {
      return '?' + new URLSearchParams(this.$route.query).toString();
    }
  },
  methods: {
    setFilter(filterBy) {
      const criteria = {
        ...this.$route.query,
        ...filterBy
      }
      const queryStr = '?' + new URLSearchParams(criteria).toString();
     
      this.$router.push(queryStr);
    },
    async loadMaterials() {
      const criteria = this.$route.query;
      this.loading = true;

      criteria.sortBy = criteria.sortBy || [ 'type', 'name' ];
      criteria.isDesc = criteria.isDesc || [ true, false ];
      criteria.limit = criteria.limit || 15;

      if (criteria.q) criteria.page = 0;

      await this.$store.dispatch({ type: 'loadMaterials', criteria });
      this.loading = false;
    }
  },
  components: {
    materialFilter,
    materialList,
    iconsMap
  },
};
</script>
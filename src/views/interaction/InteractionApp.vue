<template>
  <section class="interaction-page">
    <div class="container">
      <v-card v-if="interactions" class="mb-10">
        <v-card-title>
          Interactions collection
          <v-spacer></v-spacer>
          <v-btn color="primary" to="/interaction/edit/">new interaction</v-btn>
        </v-card-title>
        <interaction-filter
          @emit-filter="setFilter"
        />
        <interaction-list
          :interactions="interactions"
          :totalItems="totalItems"
          :loading="loading"
          @options-updated="paginate"
          @header-clicked="setSort"
          @toggle-is-active="toggleIsActive"
        />
      </v-card>
      <icons-map />
    </div>
  </section>
</template>

<script>
import { eventBus, EV_edit_interaction_failed } from '@/services/eventBus.service';
import interactionFilter from '@/cmps/interaction/InteractionFilter';
import interactionList from '@/cmps/interaction/InteractionList';
import iconsMap from '@/cmps/general/IconsMap';

export default {
  data() {
    return {
      loading: false,
      tableData: null
    }
  },
  watch: {
    '$route.query': function () {
      this.loadInteractions();
    },
  },
  computed: {
    interactions() {
      return this.$store.getters.interactions;
    },
    totalItems() {
      return this.$store.getters.interactionCount;
    },
  },
  methods: {
    paginate(tableData) {
      this.tableData = tableData;
      this.loadInteractions();
    },
    setSort(propName, isDesc) {
      const criteria = {
        ...this.$route.query,
        sortBy: propName,
        isDesc
      }
      const queryStr = '?' + new URLSearchParams(criteria).toString();
      this.$router.push(queryStr);
    },
    setFilter(filterBy) {
      const { q, isActive } = filterBy;
      const criteria = {
        ...this.$route.query,
        q,
        isActive
      }
      const queryStr = '?' + new URLSearchParams(criteria).toString();
      if ((filterBy.isActive !== this.$route.query.isActive && this.tableData)
      || (filterBy.q !== this.$route.query.q && this.tableData)) {
        this.tableData.page = 1;
      }
      this.$router.push(queryStr);
    },
    async loadInteractions() {
      this.loading = true;
      const filterBy = this.$route.query;

      if (this.tableData) {
        let { page, itemsPerPage } = this.tableData;
        filterBy.limit = (itemsPerPage < 0) ? 0 : itemsPerPage;
        filterBy.page = --page;
      } else filterBy.limit = 30;
      
      await this.$store.dispatch({ type: 'loadInteractions', filterBy });
      this.loading = false;
    },
    async toggleIsActive(intId) {
      try {
        var interaction = await this.loadInteraction(intId);
        if (!interaction.side1Material || (!interaction.side2Material && !interaction.side2Label)) {
          eventBus.$emit(EV_edit_interaction_failed, { type: 'interaction', isError: true });
          return;
        }
        interaction.isActive = !interaction.isActive;
        await this.saveInteraction(interaction);
      } catch (err) {
        console.log('ERROR', err);
      }
    },
    async loadInteraction(intId) {
      const editedInteraction = await this.$store.dispatch({
        type: 'loadInteraction',
        intId
      });
      return JSON.parse(JSON.stringify(editedInteraction));
    },
    async saveInteraction(editedInteraction) {
      try {
        const interaction = JSON.parse(JSON.stringify(editedInteraction));
        await this.$store.dispatch({
          type: 'saveInteraction',
          interaction,
        });
      } catch (err) {
        console.log('Error:', err);
      }
    },
  },
  created() {
    const { sortBy, isDesc } = this.$route.query;
    if ((sortBy !== '_id' && isDesc !== 'true') && (sortBy !== 'isActive,_id' && isDesc !== 'true,true')) {
      this.setSort([ 'isActive', '_id' ], [ true, true ]);
    }
    this.loadInteractions();
  },
  components: {
    interactionFilter,
    interactionList,
    iconsMap
  },
};
</script>
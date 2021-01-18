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
          @options-updated="setFilter"
          @header-clicked="setFilter"
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
      loading: false
    }
  },
  watch: {
    '$route.query': {
      handler() {
        this.loadInteractions();
      },
      immediate: true
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
    setFilter(filterBy) {
      const criteria = {
        ...this.$route.query,
        ...filterBy
      }
      if ((filterBy.isActive !== this.$route.query.isActive && (+this.$route.query !== 0))
      || (filterBy.q !== this.$route.query.q && (+this.$route.query !== 0))) {
        criteria.page = 0;
      }
      const queryStr = '?' + new URLSearchParams(criteria).toString();
      this.$router.push(queryStr);
    },
    async loadInteractions() {
      this.loading = true;
      const filterBy = this.$route.query;
      filterBy.sortBy = filterBy.sortBy || [ 'side1Material.name', 'isActive' ];
      filterBy.isDesc = filterBy.isDesc || [ false, true ];
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
  components: {
    interactionFilter,
    interactionList,
    iconsMap
  },
};
</script>
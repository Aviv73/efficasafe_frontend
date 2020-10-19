<template>
  <section class="interaction-page">
    <v-card v-if="interactions" class="mb-10">
      <v-card-title>
        Interactions collection
        <v-spacer></v-spacer>
        <!-- <v-btn color="primary" to="/interaction/edit-group/">group interaction</v-btn> -->
        <v-btn color="primary" to="/interaction/edit/">new interaction</v-btn>
      </v-card-title>
      <interaction-filter :interactions="interactions" @emit-filter="setFilter" />
      <interaction-list :interactions="interactions" @toggle-is-active="toggleIsActive" />
    </v-card>
    <icons-map />
  </section>
</template>

<script>
import interactionFilter from "@/cmps/interaction/InteractionFilter";
import interactionList from "@/cmps/interaction/InteractionList";
import iconsMap from "@/cmps/general/IconsMap";

export default {
  watch: {
    "$route.query": function () {
      this.loadInteractions();
    },
  },
  computed: {
    interactions() {
      return this.$store.getters.interactions;
    },
  },
  methods: {
    setFilter(filterBy) {
      if (!filterBy.type || filterBy.type === "all") {
        delete filterBy.type;
      }
      if (!filterBy.isActive || filterBy.isActive === "all") {
        delete filterBy.isActive;
      }
      if (!filterBy.q) {
        delete filterBy.q;
      }
      const queryStr = "?" + new URLSearchParams(filterBy).toString();
      this.$router.push(queryStr);
    },
    loadInteractions() {
      const filterBy = this.$route.query;
      this.$store.dispatch({ type: "loadInteractions", filterBy });
    },
    async toggleIsActive(intId) {
      try {
        var interaction = await this.loadInteraction(intId);
        interaction.isActive = !interaction.isActive;
        await this.saveInteraction(interaction);
      } catch (err) {
        console.log("ERROR", err);
      }
    },
    async loadInteraction(intId) {
      const editedInteraction = await this.$store.dispatch({
        type: "loadInteraction",
        intId,
      });
      return JSON.parse(JSON.stringify(editedInteraction));
    },
    async saveInteraction(editedInteraction) {
      try {
        const interaction = JSON.parse(JSON.stringify(editedInteraction));
        await this.$store.dispatch({
          type: "saveInteraction",
          interaction,
        });
        // eventBus.$emit(EV_addInteraction, {
        //   name: "",
        //   type: "interaction",
        //   _id: interaction._id,
        // });
      } catch (err) {
        console.log("Error:", err);
      }
    },
  },
  created() {
    this.loadInteractions();
  },
  components: {
    interactionFilter,
    interactionList,
    iconsMap,
  },
};
</script>
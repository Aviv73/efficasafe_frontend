<template>
  <section class="archive-app">
    <confirm-delete
      v-model="dialog"
      :type="deleteType"
      :dialog="dialog"
      @delete-confirm="restoreItem"
      @delete-cancel="clearConfirmDelete"
    />
    <v-card v-if="materials" class="mb-10">
      <v-card-title>Materials Archive</v-card-title>
      <material-filter :materials="materials" @emit-filter="setMaterialFilter" />
      <material-archive-list :materials="materials" @restore-material="setConfirmDelete" />
    </v-card>

    <v-card v-if="labels" class="mb-10">
      <v-card-title>Labels Archive</v-card-title>
      <label-filter :labels="labels" @emit-filter="setLabelFilter" />
      <label-archive-list :labels="labels" @restore-label="setConfirmDelete" />
    </v-card>

    <v-card v-if="interactions" class="mb-10">
      <v-card-title>Interactions collection</v-card-title>
      <interaction-filter :interactions="interactions" @emit-filter="setInteractionFilter" />
      <interaction-archive-list
        :interactions="interactions"
        @restore-interaction="setConfirmDelete"
      />
    </v-card>

    <icons-map />
  </section>
</template>

<script>
import materialFilter from "@/cmps/material/MaterialFilter";
import labelFilter from "@/cmps/label/LabelFilter";
import interactionFilter from "@/cmps/interaction/InteractionFilter";
import materialArchiveList from "@/cmps/archive/material/MaterialArchiveList";
import labelArchiveList from "@/cmps/archive/label/LabelArchiveList";
import interactionArchiveList from "@/cmps/archive/interaction/InteractionArchiveList";
import confirmDelete from "@/cmps/general/ConfirmDelete";
import iconsMap from "@/cmps/general/IconsMap";

export default {
  data() {
    return {
      dialog: false,
      selectedItem: null,
      deleteType: "",
    };
  },
  watch: {
    "$route.query": function () {
      this.loadLabels();
      this.loadMaterials();
      this.loadInteractions();
    },
  },
  computed: {
    materials() {
      return this.$store.getters.archiveMaterials;
    },
    labels() {
      return this.$store.getters.archiveLabels;
    },
    interactions() {
      return this.$store.getters.archiveInteractions;
    },
  },
  methods: {
    setMaterialFilter(filterBy) {
      if (!filterBy.type || filterBy.type === "all") {
        delete filterBy.type;
      }
      if (!filterBy.q) {
        delete filterBy.q;
      }
      const queryStr = "?" + new URLSearchParams(filterBy).toString();
      this.$router.push(queryStr);
    },
    setLabelFilter(filterBy) {
      if (!filterBy.q) {
        delete filterBy.q;
      }
      const queryStr = "?" + new URLSearchParams(filterBy).toString();
      this.$router.push(queryStr);
    },
    setInteractionFilter(filterBy) {
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
    setConfirmDelete(payload) {
      this.selectedItem = payload;
      this.deleteType = payload.type;
      this.dialog = true;
    },
    clearConfirmDelete() {
      this.selectedItem = null;
      this.dialog = false;
      this.deleteType = "";
    },
    restoreItem() {
      const item = this.selectedItem;
      if (!item) {
        this.clearConfirmDelete();
        return;
      }

      if (item.type === "material") {
        this.restoreMaterial(item.id);
      } else if (item.type === "label") {
        this.restoreLabel(item.id);
      } else {
        this.restoreInteraction(item.id);
      }
      this.clearConfirmDelete();
    },

    async restoreMaterial(matId) {
      const material = await this.$store.dispatch({
        type: "loadArchiveMaterial",
        matId,
      });
      try {
        const restoredMaterial = this.$store.dispatch({
          type: "restoreMaterial",
          material,
        });

        const removedMaterial = this.$store.dispatch({
          type: "removeMaterialFromArchive",
          matId: material._id,
        });

        Promise.all([restoredMaterial, removedMaterial]);
      } catch (err) {
        console.log("ERROR", err);
      }
    },

    async restoreLabel(labelId) {
      const label = await this.$store.dispatch({
        type: "loadArchiveLabel",
        labelId,
      });
      try {
        const restoredLabel = this.$store.dispatch({
          type: "restoreLabel",
          label,
        });

        const removedLabel = this.$store.dispatch({
          type: "removeLabelFromArchive",
          labelId: label._id,
        });

        Promise.all([restoredLabel, removedLabel]);
      } catch (err) {
        console.log("ERROR", err);
      }
    },
    async restoreInteraction(intId) {
      const interaction = await this.$store.dispatch({
        type: "loadArchiveInteraction",
        intId,
      });
      try {
        const restoredInteraction = this.$store.dispatch({
          type: "restoreInteraction",
          interaction,
        });

        const removedInteraction = this.$store.dispatch({
          type: "removeInteractionFromArchive",
          intId: interaction._id,
        });

        Promise.all([restoredInteraction, removedInteraction]);
      } catch (err) {
        console.log("ERROR", err);
      }
    },
    loadMaterials() {
      const filterBy = this.$route.query;
      this.$store.dispatch({ type: "loadArchiveMaterials", filterBy });
    },
    loadLabels() {
      const filterBy = this.$route.query;
      this.$store.dispatch({ type: "loadArchiveLabels", filterBy });
    },
    loadInteractions() {
      const filterBy = this.$route.query;
      this.$store.dispatch({ type: "loadArchiveInteractions", filterBy });
    },
  },
  created() {
    this.loadLabels();
    this.loadMaterials();
    this.loadInteractions();
  },
  components: {
    materialFilter,
    labelFilter,
    interactionFilter,
    materialArchiveList,
    labelArchiveList,
    interactionArchiveList,
    confirmDelete,
    iconsMap,
  },
};
</script>
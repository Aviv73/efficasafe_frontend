<template>
  <section class="archive-app">
    <div class="container">
      <confirm-delete
        v-model="dialog"
        :type="deleteType"
        :dialog="dialog"
        :isRestore="isRestoring"
        @delete-confirm="restoreItem"
        @delete-cancel="clearConfirmDelete"
      />
      <v-card v-if="materials" class="mb-10">
        <v-card-title>Materials Archive</v-card-title>
        <material-filter
          :materials="materials"
          @emit-filter="setMaterialFilter"
        />
        <material-archive-list
          :materials="materials"
          @restore-material="setConfirmDelete"
        />
      </v-card>

      <v-card v-if="labels" class="mb-10">
        <v-card-title>Labels Archive</v-card-title>
        <label-filter :labels="labels" @emit-filter="setLabelFilter" />
        <label-archive-list
          :labels="labels"
          @restore-label="setConfirmDelete"
        />
      </v-card>

      <v-card v-if="interactions" class="mb-10">
        <v-card-title>Interactions collection</v-card-title>
        <interaction-filter
          :interactions="interactions"
          @emit-filter="setInteractionFilter"
        />
        <interaction-archive-list
          :interactions="interactions"
          @restore-interaction="setConfirmDelete"
        />
      </v-card>

      <icons-map />
    </div>
  </section>
</template>

<script>
import materialFilter from '@/cms/cmps/material/MaterialFilter';
import labelFilter from '@/cms/cmps/label/LabelFilter';
import interactionFilter from '@/cms/cmps/interaction/InteractionFilter';
import materialArchiveList from '@/cms/cmps/archive/material/MaterialArchiveList';
import labelArchiveList from '@/cms/cmps/archive/label/LabelArchiveList';
import interactionArchiveList from '@/cms/cmps/archive/interaction/InteractionArchiveList';
import confirmDelete from '@/cms/cmps/general/ConfirmDelete';
import iconsMap from '@/cms/cmps/general/IconsMap';

export default {
  data() {
    return {
      dialog: false,
      selectedItem: null,
      deleteType: '',
    };
  },
  watch: {
    '$route.query': function () {
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
    isRestoring() {
      if (!this.selectedItem) return false;
      return this.selectedItem.doRestore;
    }
  },
  methods: {
    setMaterialFilter(filterBy) {
      if (!filterBy.type || filterBy.type === 'all') {
        delete filterBy.type;
      }
      if (!filterBy.q) {
        delete filterBy.q;
      }
      const queryStr = '?' + new URLSearchParams(filterBy).toString();
      this.$router.push(queryStr);
    },
    setLabelFilter(filterBy) {
      if (!filterBy.q) {
        delete filterBy.q;
      }
      const queryStr = '?' + new URLSearchParams(filterBy).toString();
      this.$router.push(queryStr);
    },
    setInteractionFilter(filterBy) {
      if (!filterBy.type || filterBy.type === 'all') {
        delete filterBy.type;
      }
      if (!filterBy.isActive || filterBy.isActive === 'all') {
        delete filterBy.isActive;
      }
      if (!filterBy.q) {
        delete filterBy.q;
      }
      const queryStr = '?' + new URLSearchParams(filterBy).toString();
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
      this.deleteType = '';
    },
    restoreItem() {
      const item = this.selectedItem;
      if (!item) {
        this.clearConfirmDelete();
        return;
      }

      if (item.type === 'material') {
        this.restoreMaterial(item.id, item.doRestore);
      } else if (item.type === 'label') {
        this.restoreLabel(item.id, item.doRestore);
      } else {
        this.restoreInteraction(item.id, item.doRestore);
      }
      this.clearConfirmDelete();
    },

    async restoreMaterial(matId, doRestore) {
      const material = await this.$store.dispatch({
        type: 'loadArchiveMaterial',
        matId,
      });
      try {
        if (doRestore) {
          this.$store.dispatch({
            type: 'restoreMaterial',
            material,
          });
        }
        this.$store.dispatch({
          type: 'removeMaterialFromArchive',
          matId: material._id,
        });
      } catch (err) {
        console.log('ERROR', err);
      }
    },

    async restoreLabel(labelId, doRestore) {
      const label = await this.$store.dispatch({
        type: 'loadArchiveLabel',
        labelId,
      });
      try {
        if (doRestore) {
          this.$store.dispatch({
            type: 'restoreLabel',
            label,
          });
        }
        this.$store.dispatch({
          type: 'removeLabelFromArchive',
          labelId: label._id,
        });
      } catch (err) {
        console.log('ERROR', err);
      }
    },
    async restoreInteraction(intId, doRestore) {
      const interaction = await this.$store.dispatch({
        type: 'loadArchiveInteraction',
        intId,
      });
      try {
        if (doRestore) {
          this.$store.dispatch({
            type: 'restoreInteraction',
            interaction,
          });
        }
        this.$store.dispatch({
          type: 'removeInteractionFromArchive',
          intId: interaction._id,
        });
      } catch (err) {
        console.log('ERROR', err);
      }
    },
    loadMaterials() {
      const filterBy = this.$route.query;
      this.$store.dispatch({ type: 'loadArchiveMaterials', filterBy });
    },
    loadLabels() {
      const filterBy = this.$route.query;
      this.$store.dispatch({ type: 'loadArchiveLabels', filterBy });
    },
    loadInteractions() {
      const filterBy = this.$route.query;
      this.$store.dispatch({ type: 'loadArchiveInteractions', filterBy });
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
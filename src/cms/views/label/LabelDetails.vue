<template>
  <div>
    <section class="label-details container" v-if="label">
      <confirm-delete
        v-model="dialog"
        type="Label"
        :dialog="dialog"
        @delete-confirm="removeLabel"
        @delete-cancel="dialog = false"
      />
      <div class="action-container">
        <v-btn color="primary" @click="$router.go(-1)">
          <v-icon small left>mdi-arrow-left</v-icon>Back
        </v-btn>
        <v-btn
          color="primary"
          :to="{ path: '/cms/interaction', query: { id: `${label._id}` } }"
        >
          <v-icon small left>mdi-view-list</v-icon>Interactions
        </v-btn>
        <v-btn
          color="primary"
          :to="{ path: '/cms/material', query: { labelId: `${label._id}` } }"
          v-if="!isArchive"
        >
          <v-icon small left>mdi-view-list</v-icon>Related Materials
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" :to="`/cms/label/edit/${label._id}`" v-if="!isArchive">
          <v-icon small left>mdi-pencil</v-icon>Edit
        </v-btn>
        <v-btn color="error" @click="displayDialog" v-if="!isArchive">
          <v-icon small left>mdi-delete</v-icon>Delete
        </v-btn>
      </div>
      <v-card class="info-container">
        <v-card-title class="label-details-title">
          {{ label.name }}
          <span class="color-circle v-chip" :style="{ backgroundColor: label.color }"></span>
        </v-card-title>

        <v-spacer v-if="label.isSuper"></v-spacer>
        <div class="info-title is-super" v-if="label.isSuper">
          <v-icon color="red">mdi-pill</v-icon>
          This is a 'super' drug group
        </div>

        <div class="info-title" v-if="relatedMaterials">Related Materials:</div>
        <v-expansion-panels v-if="relatedMaterials">
          <v-expansion-panel>
            <v-expansion-panel-header>
              There are {{ relatedMaterials.length }} materials related to this label,
              with {{ label.primaryMaterialIds.length }} primary material/s.
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-chip-group column>
                <v-chip 
                  v-for="material in relatedMaterials" 
                  :key="material._id" 
                  :class="{ warning: isPrimaryMaterial(material._id) }"
                >
                  <v-avatar left size="16">
                    <img :src="require(`@/cms/assets/icons/${material.type}.svg`)" :alt="material.type" />
                  </v-avatar>
                  <router-link :to="`/cms/material/${material._id}`">
                    {{ material.name }}
                  </router-link>
                </v-chip>
              </v-chip-group>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
      <icons-map />
    </section>
    <entity-not-found v-if="isNotFound" entity="label" />
  </div>
</template>

<script>
import confirmDelete from '@/cms/cmps/general/ConfirmDelete';
import iconsMap from '@/cms/cmps/general/IconsMap';
import entityNotFound from '@/cms/cmps/general/EntityNotFound';

export default {
  data() {
    return {
      label: null,
      dialog: false,
      relatedMaterials: null,
      isNotFound: false,
      isArchive: false
    };
  },
  watch: {
    '$route.params.id': function () {
      this.loadLabel();
    },
  },
  computed: {
    labels() {
      return this.$store.getters.labels;
    },
  },
  methods: {
    isPrimaryMaterial(matId) {
      return this.label.primaryMaterialIds.includes(matId);
    },
    async loadLabel() {
      const labelId = this.$route.params.id;
      if (labelId) {
        const criteria = { labelId, limit: 0 };
        const [label, materials] = await Promise.all([
          this.$store.dispatch({ type: (this.isArchive) ? 'loadArchiveLabel' : 'loadLabel', labelId }),
          this.$store.dispatch({ type: 'getMaterials', criteria }),
        ]);
        if (label) {
          this.label = label;
          this.relatedMaterials = materials;
        } else {
          this.isNotFound = true;
        }
      }
    },
    async removeLabel() {
      const label = JSON.parse(JSON.stringify(this.label));
      const labelId = label._id;
      const saveToArchive = this.$store.dispatch({
        type: 'saveLabelToArchive',
        label,
      });
      const removeLabel = this.$store.dispatch({
        type: 'removeLabel',
        labelId,
      });
      Promise.all([saveToArchive, removeLabel]).then(() => {
        this.$router.push('/cms/label');
      });
    },
    displayDialog() {
      this.dialog = true;
    },
  },
  created() {
    if (this.$route.name === 'ArchiveLabelDetails') {
      this.isArchive = true; 
    }
    this.loadLabel();
  },
  components: {
    confirmDelete,
    iconsMap,
    entityNotFound
  }
};
</script>
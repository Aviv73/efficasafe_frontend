<template>
  <section class="label-details container" v-if="label">
    <confirm-delete
      v-model="dialog"
      type="Label"
      :dialog="dialog"
      @delete-confirm="removeLabel"
      @delete-cancel="dialog = false"
    />
    <div class="action-container">
      <v-btn color="primary" to="/label">
        <v-icon small left>mdi-arrow-left</v-icon>Back to Labels
      </v-btn>
      <v-btn
        color="primary"
        :to="{ path: '/interaction', query: { id: `${label._id}` } }"
      >
        <v-icon small left>mdi-view-list</v-icon>Interactions
      </v-btn>
      <v-btn
        color="primary"
        :to="{ path: '/material', query: { labelId: `${label._id}` } }"
      >
        <v-icon small left>mdi-view-list</v-icon>Related Materials
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" :to="`/label/edit/${label._id}`">
        <v-icon small left>mdi-pencil</v-icon>Edit
      </v-btn>
      <v-btn color="error" v-if="label.src !== 'atc'" @click="displayDialog">
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

      <div class="info-title">Related Materials:</div>
      <v-chip-group column v-if="relatedMaterials">
        <v-chip 
          v-for="material in relatedMaterials" 
          :key="material._id" 
          :class="{ warning: isPrimaryMaterial(material._id) }"
        >
          <v-avatar left size="16">
            <img :src="require(`@/assets/icons/${material.type}.svg`)" :alt="material.type" />
          </v-avatar>
          <router-link :to="`/material/${material._id}`">
            {{ material.name }}
          </router-link>
        </v-chip>
      </v-chip-group>
    </v-card>
    <icons-map />
  </section>
</template>

<script>
import confirmDelete from '@/cmps/general/ConfirmDelete';
import iconsMap from '@/cmps/general/IconsMap';

export default {
  data() {
    return {
      label: null,
      dialog: false,
      relatedMaterials: null,
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
      return this.label.primaryMaterialId === matId;
    },
    async loadLabel() {
      const labelId = this.$route.params.id;
      if (labelId) {
        const criteria = { labelId, limit: 0 };
        const [label, materials] = await Promise.all([
          this.$store.dispatch({ type: 'loadLabel', labelId }),
          this.$store.dispatch({ type: 'loadAutoCompleteResults', criteria }),
        ]);
        this.label = label;
        this.relatedMaterials = materials;
      }
    },
    async removeLabel() {
      if (this.label.src === 'atc') return;

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
        this.$router.push('/label');
      });
    },
    displayDialog() {
      this.dialog = true;
    },
  },
  created() {
    this.loadLabel();
  },
  components: {
    confirmDelete,
    iconsMap,
  },
};
</script>
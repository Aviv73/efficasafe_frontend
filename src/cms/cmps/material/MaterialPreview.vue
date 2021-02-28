<template>
  <v-card class="material-preview">
    <div class="mat-details-container">
      <router-link class="mat-go-link" :to="`/cms/material/${material._id}`">
        <img class="mat-type" :src="materialType" :alt="material.type" />
        <span class="mat-name">{{material.name}}</span>
      </router-link>
      <v-btn small color="primary" :to="`/cms/material/edit/${material._id}`">
        <v-icon small left>mdi-pencil</v-icon>Edit
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "materialPreview",
  props: {
    material: Object,
  },
  computed: {
    materialType() {
      return require(`@/cms/assets/icons/${this.material.type}.svg`);
    },
  },
};
</script>
<template>
  <v-card class="label-preview">
    <div class="label-details-container">
      <router-link class="label-go-link" :to="`/label/${label._id}`">
        <img class="label-src" :src="labelSrc" :atl="label.src" />
        <div class="label-color" v-if="label.color" :style="{ backgroundColor: label.color}"></div>
        <div class="label-color" v-else :style="{ backgroundColor: '#FFFFFF00'}"></div>
        <span class="label-name">{{label.name}}</span>
      </router-link>
      <v-btn small color="primary" :to="`/label/edit/${label._id}`">
        <v-icon small left>mdi-pencil</v-icon>Edit
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "labelPreview",
  props: {
    label: Object,
  },
  computed: {
    labelSrc() {
      return require(`@/cms/assets/icons/custom.svg`);
    }
  }
};
</script>
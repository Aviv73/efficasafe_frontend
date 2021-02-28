<template>
  <v-card class="interaction-preview">
    <div class="int-details-container">
      <router-link class="int-edit" :to="`/interaction/${interaction._id}`">
        <div class="int-side" v-if="interaction.side1Material">
          <img
            class="mat-type"
            :src="materialSide1Type"
            :atl="interaction.side1Material.type"
          />
          <span class="int-mat">{{ interaction.side1Material.name }}</span>
        </div>

        <div class="int-side" v-if="interaction.side2Material">
          <img
            class="mat-type"
            :src="materialSide2Type"
            :alt="interaction.side2Material.type"
          />
          <span class="int-mat">{{ interaction.side2Material.name }}</span>
        </div>

        <div class="int-side" v-if="interaction.side2Label">
          <img class="label-src" :src="labelSide" atl="label" />
          <span class="int-label">{{ interaction.side2Label.name }}</span>
        </div>
      </router-link>
      <v-btn small color="primary" :to="`/interaction/edit/${interaction._id}`">
        <v-icon small left>mdi-pencil</v-icon>Edit
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'interactionPreview',
  props: {
    interaction: Object,
  },
  computed: {
    materialSide1Type() {
      return require(`@/cms/assets/icons/${this.interaction.side1Material.type}.svg`);
    },
    materialSide2Type() {
      return require(`@/cms/assets/icons/${this.interaction.side2Material.type}.svg`);
    },
    labelSide() {
      return require(`@/cms/assets/icons/custom.svg`);
    },
  },
};
</script>
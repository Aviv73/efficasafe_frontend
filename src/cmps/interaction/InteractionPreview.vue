<template>
  <v-card class="interaction-preview">
      <div class="int-details-container">
        <router-link class="int-edit" :to="`/interaction/${interaction._id}`">
          <div class="int-side" v-if="interaction.side1MaterialId">
            <img class="mat-type" :src="materialSide1Type" :atl="interaction.side1MaterialId.type" />
            <span class="int-mat">{{interaction.side1MaterialId.name}}</span>
          </div>

          <div class="int-side" v-if="interaction.side1LabelId">
            <img class="label-src" :src="labelSide1Src" :atl="interaction.side1LabelId.src" />
            <span
              class="int-label"
              v-if="interaction.side1LabelId"
            >{{interaction.side1LabelId.name}}</span>
          </div>

          <div class="int-side" v-if="interaction.side2MaterialId">
            <img class="mat-type" :src="materialSide2Type" :atl="interaction.side2MaterialId.type" />
            <span class="int-mat">{{interaction.side2MaterialId.name}}</span>
          </div>

          <div class="int-side" v-if="interaction.side2LabelId">
            <img class="label-src" :src="labelSide2Src" :atl="interaction.side2LabelId.src" />
            <span class="int-label">{{interaction.side2LabelId.name}}</span>
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
  name: "interactionPreview",
  props: {
    interaction: Object,
  },
  computed: {
    materialSide1Type() {
      return require(`@/assets/icons/${this.interaction.side1MaterialId.type}.svg`);
    },
    materialSide2Type() {
      return require(`@/assets/icons/${this.interaction.side2MaterialId.type}.svg`);
    },
    labelSide1Src() {
      return require(`@/assets/icons/${this.interaction.side1LabelId.src}.svg`);
    },
    labelSide2Src() {
      return require(`@/assets/icons/${this.interaction.side2LabelId.src}.svg`);
    },
  },
};
</script>
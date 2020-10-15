<template>
  <section class="interaction-details" v-if="interaction">
    <confirm-delete
      v-model="dialog"
      type="interaction"
      :dialog="dialog"
      @delete-confirm="removeInteraction"
      @delete-cancel="dialog = false"
    />
    <div class="action-container">
      <v-btn color="primary" to="/interaction">
        <v-icon small left>mdi-arrow-left</v-icon>Back to Interactions
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" :to="`/interaction/edit/${interaction._id}`">
        <v-icon small left>mdi-pencil</v-icon>Edit
      </v-btn>
      <v-btn color="error" @click="displayDialog">
        <v-icon small left>mdi-delete</v-icon>Delete
      </v-btn>
    </div>

    <v-card class="info-container">
      <v-card-title class="interaction-details-title">
        <span v-if="interaction.side1Material">{{interaction.side1Material.name}}</span>
        <span class="spacing">&</span>
        <span v-if="interaction.side2Material">{{interaction.side2Material.name}}</span>
        <span v-if="interaction.side2Label">{{interaction.side2Label.name}}</span>
      </v-card-title>

      <span class="info-title" v-if="interaction.side1Material">Side 1 Material:</span>
      <router-link
        class="info-value"
        v-if="interaction.side1Material"
        :to="`/material/${interaction.side1Material._id}`"
      >{{interaction.side1Material.name}}</router-link>

      <span class="info-title" v-if="interaction.side1Label">Side 1 Label:</span>
      <router-link
        class="info-value"
        v-if="interaction.side1Label"
        :to="`/label/${interaction.side1Label._id}`"
      >{{interaction.side1Label.name}}</router-link>

      <span class="info-title" v-if="interaction.side2Material">Side 2 Material:</span>
      <router-link
        class="info-value"
        v-if="interaction.side2Material"
        :to="`/material/${interaction.side2Material._id}`"
      >{{interaction.side2Material.name}}</router-link>

      <span class="info-title" v-if="interaction.side2Label">Side 2 Label:</span>
      <router-link
        class="info-value"
        v-if="interaction.side2Label"
        :to="`/label/${interaction.side2Label._id}`"
      >{{interaction.side2Label.name}}</router-link>

      <span class="info-title">Summary:</span>
      <p class="info-value">{{interaction.summary}}</p>

      <span class="info-title">Recommendation:</span>
      <p class="info-value">{{interaction.recommendation}}</p>

      <span class="info-title">Level of evidence:</span>
      <span class="info-value">{{interaction.evidenceLevel}}</span>

      <span class="info-title">Review of studies:</span>
      <div>
        <p class="info-value">{{interaction.reviewOfStudies}}</p>
      </div>

      <span class="info-title" v-if="interaction.refs.length">References:</span>
      <reference-table :references="interaction.refs" v-if="interaction.refs.length" />

      <!-- ------------------ MISSING: Monitor (labTests, otherTests, symptoms) ------------------ -->

      <span class="info-title">Indications:</span>
      <v-chip-group column active-class="primary--text">
        <v-chip
          v-for="indication in interaction.indications"
          :key="indication.id"
        >{{ indication.name }}</v-chip>
      </v-chip-group>
    </v-card>

    <icons-map />
  </section>
</template>

<script>
import confirmDelete from "@/cmps/general/ConfirmDelete";
import referenceTable from "@/cmps/common/ReferenceTable";
import iconsMap from "@/cmps/general/IconsMap";

export default {
  data() {
    return {
      interaction: null,
      dialog: false,
      sides: {
        side1Material: null,
        side1Label: null,
        side2Material: null,
        side2Label: null,
      },
    };
  },
  watch: {
    "$route.params.id": function () {
      this.loadInteraction();
    },
  },
  methods: {
    async loadInteraction() {
      const intId = this.$route.params.id;
      if (intId) {
        const interaction = await this.$store.dispatch({
          type: "loadInteraction",
          intId,
        });
        this.interaction = interaction;
      }
    },
    async loadInteractionSides() {
      if (this.interaction.side1Material) {
        const matId = this.interaction.side1Material._id;
        this.sides.side1Material = await this.$store.dispatch({
          type: "loadMat",
          matId,
        });
      } else {
        const label = this.interaction.side1Label._id;
        this.sides.side1Label = await this.$store.dispatch({
          type: "loadLabel",
          label,
        });
      }

      if (this.interaction.side2Material) {
        const matId = this.interaction.side2Material._id;
        this.sides.side2Material = await this.$store.dispatch({
          type: "loadMat",
          matId,
        });
      } else {
        const label = this.interaction.side2Label._id;
        this.sides.side2Label = await this.$store.dispatch({
          type: "loadLabel",
          label,
        });
      }
    },
    async removeInteraction() {
      const interaction = JSON.parse(JSON.stringify(this.interaction));
      const intId = interaction._id;
      const saveToArchive = this.$store.dispatch({
        type: "saveInteractionToArchive",
        interaction,
      });
      const removeInteraction = this.$store.dispatch({
        type: "removeInteraction",
        intId,
      });
      Promise.all([saveToArchive, removeInteraction]).then(() => {
        this.$router.push("/interaction");
      });
    },
    displayDialog() {
      this.dialog = true;
    },
  },
  created() {
    this.loadInteraction();
  },
  components: {
    confirmDelete,
    referenceTable,
    iconsMap,
  },
};
</script>
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
        <span v-if="interaction.side1MaterialId">{{interaction.side1MaterialId.name}}</span>
        <span v-if="interaction.side1LabelId">{{interaction.side1LabelId.name}}</span>
        <span class="spacing">&</span>
        <span v-if="interaction.side2MaterialId">{{interaction.side2MaterialId.name}}</span>
        <span v-if="interaction.side2LabelId">{{interaction.side2LabelId.name}}</span>
      </v-card-title>

      <span class="info-title" v-if="interaction.side1MaterialId">Side 1 Material:</span>
      <router-link
        class="info-value"
        v-if="interaction.side1MaterialId"
        :to="`/material/${interaction.side1MaterialId._id}`"
      >{{interaction.side1MaterialId.name}}</router-link>

      <span class="info-title" v-if="interaction.side1LabelId">Side 1 Label:</span>
      <router-link
        class="info-value"
        v-if="interaction.side1LabelId"
        :to="`/label/${interaction.side1LabelId._id}`"
      >{{interaction.side1LabelId.name}}</router-link>

      <span class="info-title" v-if="interaction.side2MaterialId">Side 2 Material:</span>
      <router-link
        class="info-value"
        v-if="interaction.side2MaterialId"
        :to="`/material/${interaction.side2MaterialId._id}`"
      >{{interaction.side2MaterialId.name}}</router-link>

      <span class="info-title" v-if="interaction.side2LabelId">Side 2 Label:</span>
      <router-link
        class="info-value"
        v-if="interaction.side2LabelId"
        :to="`/label/${interaction.side2LabelId._id}`"
      >{{interaction.side2LabelId.name}}</router-link>

      <span class="info-title">Summary:</span>
      <p class="info-value">{{interaction.summary}}</p>

      <span class="info-title">Recommendation:</span>
      <p class="info-value">{{interaction.recommendation}}</p>

      <span class="info-title">Level of evidence:</span>
      <span class="info-value">{{interaction.evidenceLevel}}</span>

      <span class="info-title">Review of studies:</span>
      <div>
        <p class="info-value">{{interaction.reviewOfStudies.main}}</p>
        <p class="info-value">{{interaction.reviewOfStudies.details}}</p>
      </div>

      <span class="info-title" v-if="interaction.references.length">References:</span>
      <reference-table :references="interaction.references" v-if="interaction.references.length" />

      <!-- ------------------ MISSING: Monitor (labTests, otherTests, symptoms) ------------------ -->

      <span class="info-title">Draft:</span>
      <p class="info-value">{{interaction.draft}}</p>

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
        side1MaterialId: null,
        side1LabelId: null,
        side2MaterialId: null,
        side2LabelId: null,
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
      if (this.interaction.side1MaterialId) {
        const matId = this.interaction.side1MaterialId._id;
        this.sides.side1MaterialId = await this.$store.dispatch({
          type: "loadMat",
          matId,
        });
      } else {
        const labelId = this.interaction.side1LabelId._id;
        this.sides.side1LabelId = await this.$store.dispatch({
          type: "loadLabel",
          labelId,
        });
      }

      if (this.interaction.side2MaterialId) {
        const matId = this.interaction.side2MaterialId._id;
        this.sides.side2MaterialId = await this.$store.dispatch({
          type: "loadMat",
          matId,
        });
      } else {
        const labelId = this.interaction.side2LabelId._id;
        this.sides.side2LabelId = await this.$store.dispatch({
          type: "loadLabel",
          labelId,
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
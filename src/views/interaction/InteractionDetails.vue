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
        <h2 v-if="interaction.side1Material">
          {{ interaction.side1Material.name }}
        </h2>
        <span class="spacing">&</span>
        <h2 v-if="interaction.side2Material">
          {{ interaction.side2Material.name }}
        </h2>
        <h2 v-if="interaction.side2Label">{{ interaction.side2Label.name }}</h2>
      </v-card-title>

      <span class="info-title">Is Active:</span>
      <span>{{ interaction.isActive ? 'Active' : 'Not Active' }}</span>

      <span class="info-title" v-if="interaction.side1Material"
        >Side 1 Material:</span
      >
      <router-link
        class="info-value"
        v-if="interaction.side1Material"
        :to="`/material/${interaction.side1Material._id}`"
        >{{ interaction.side1Material.name }}</router-link
      >

      <span class="info-title" v-if="interaction.side2Material"
        >Side 2 Material:</span
      >
      <router-link
        class="info-value"
        v-if="interaction.side2Material"
        :to="`/material/${interaction.side2Material._id}`"
        >{{ interaction.side2Material.name }}</router-link
      >

      <span class="info-title" v-if="interaction.side2Label"
        >Side 2 Label:</span
      >
      <router-link
        class="info-value"
        v-if="interaction.side2Label"
        :to="`/label/${interaction.side2Label._id}`"
        >{{ interaction.side2Label.name }}</router-link
      >

      <span class="info-title">Summary:</span>
      <p class="info-value" v-html="interaction.summary"></p>

      <span class="info-title">Recommendation:</span>
      <p class="info-value" v-html="interaction.recommendation"></p>

      <span class="info-title">Note:</span>
      <p class="info-value">{{ interaction.note }}</p>

      <span class="info-title">Level of evidence:</span>
      <span class="info-value">{{ interaction.evidenceLevel }}</span>

      <span class="info-title">Review of studies:</span>
      <div>
        <p class="info-value" v-html="interaction.reviewOfStudies"></p>
      </div>

      <span class="info-title" v-if="interaction.refs.length">References:</span>
      <reference-table
        :references="interaction.refs"
        v-if="interaction.refs.length"
      />

      <span class="info-title">Indications:</span>
      <v-chip-group column>
        <v-chip
          v-for="indication in interaction.indications"
          :key="indication.id"
          >{{ indication.txt }}</v-chip>
      </v-chip-group>

      <span class="info-title">Lab Tests:</span>
      <v-chip-group column>
        <v-chip
          v-for="labTest in interaction.monitor.labTests"
          :key="labTest.id"
          >{{ labTest.txt }}</v-chip>
      </v-chip-group>

      <span class="info-title">Other Tests:</span>
      <v-chip-group column>
        <v-chip
          v-for="otherTest in interaction.monitor.otherTests"
          :key="otherTest.id"
          >{{ otherTest.txt }}</v-chip>
      </v-chip-group>

      <span class="info-title">Symptoms:</span>
      <v-chip-group column>
        <v-chip
          v-for="symptom in interaction.monitor.symptoms"
          :key="symptom.id"
          >{{ symptom.txt }}</v-chip>
      </v-chip-group>
    </v-card>

    <icons-map />
  </section>
</template>

<script>
import confirmDelete from '@/cmps/general/ConfirmDelete';
import referenceTable from '@/cmps/common/ReferenceTable';
import iconsMap from '@/cmps/general/IconsMap';

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
    '$route.params.id': function () {
      this.loadInteraction();
    },
  },
  methods: {
    async loadInteraction() {
      const intId = this.$route.params.id;
      if (intId) {
        const interaction = await this.$store.dispatch({
          type: 'loadInteraction',
          intId,
        });
        this.interaction = interaction;
      }
    },
    async removeInteraction() {
      const interaction = JSON.parse(JSON.stringify(this.interaction));
      const intId = interaction._id;
      const saveToArchive = this.$store.dispatch({
        type: 'saveInteractionToArchive',
        interaction,
      });
      const removeInteraction = this.$store.dispatch({
        type: 'removeInteraction',
        intId,
      });
      Promise.all([saveToArchive, removeInteraction]).then(() => {
        this.$router.push('/interaction');
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
<template>
  <v-card>
    <v-form v-model="valid" @submit.prevent="saveInteraction">
      <v-card-title class="interaction-edit-title">New Interaction</v-card-title>

      <div v-if="!isMaterialSide2">
        <v-radio-group v-model="isMaterial" :mandatory="true">
          <v-radio label="Material" :value="true"></v-radio>
          <v-radio label="Label" :value="false"></v-radio>
        </v-radio-group>
        <div v-show="isMaterial">
          <autocomplete
            v-if="materials"
            :items="materials"
            @emitAutocomplete="emitSelect"
            searchName="material"
          />
        </div>
        <div v-show="!isMaterial">
          <autocomplete
            v-if="labels"
            :items="labels"
            @emitAutocomplete="emitSelect"
            searchName="label"
          />
        </div>
      </div>

      <div v-if="interactionType === 'material'">
        <v-chip class="ma-2 side-container" color="primary" label text-color="white">
          <v-avatar left>
            <v-img
              class="side-type-img"
              :src="materialType"
              :alt="editedInteraction.side2MaterialId.type"
            />
          </v-avatar>
          {{editedInteraction.side2MaterialId.name}}
        </v-chip>
      </div>

      <div v-if="interactionType === 'label'">
        <v-chip class="ma-2 side-container" color="primary" label text-color="white">
          <v-avatar left>
            <v-img
              class="side-type-img"
              :src="labelSrc"
              :alt="editedInteraction.side2LabelId.type"
            />
          </v-avatar>
          {{editedInteraction.side2LabelId.name}}
        </v-chip>
      </div>

      <pre v-if="editedInteraction">{{editedInteraction}}</pre>

      <!-- <div>
      <label for="int-active">Active:</label>
      <v-switch
        id="int-active"
        v-model="editedInteraction.isActive"
        :label="`Active: ${editedInteraction.isActive.toString()}`"
      />
    </div>

    <label for="int-sides">Sides:</label>
    <interaction-sides
      id="int-sides"
      :sides="sides"
      @updateSide1="updateSide1"
      @updateSide2="updateSide2"
      @removeSide1="removeSide1"
      @removeSide2="removeSide2"
    />

    <v-select
      :items="interaction.type"
      label="Interaction type*"
      v-model="editedInteraction.type"
      :rules="[v => !!v || 'Material Name is required']"
      required
    ></v-select>

    <v-select
      :items="interaction.evidenceLevel"
      label="Level of Evidence"
      v-model="editedInteraction.evidenceLevel"
    ></v-select>

    <v-textarea v-model="editedInteraction.desc" label="Description"></v-textarea>
    <v-textarea v-model="editedInteraction.summary" label="Summary"></v-textarea>
    <v-textarea v-model="editedInteraction.recommendation" label="Recommendation"></v-textarea>
    <v-textarea v-model="editedInteraction.reviewOfStudies.main" label="Review of studies main"></v-textarea>
    <v-textarea
      v-model="editedInteraction.reviewOfStudies.details"
      label="Review of studies details"
    ></v-textarea>

    <div class="list-chips">
      <label for="mat-regions">indication:</label>
      <v-text-field
        v-model="model.indication"
        label="Add new indications"
        @keypress.enter.prevent="addIndication"
      />
      <v-chip-group column active-class="primary--text">
        <v-chip
          v-for="indication in editedInteraction.indications"
          :key="indication.id"
          close
          @click:close="removeItem('indication', indication.id)"
        >{{ indication.name }}</v-chip>
      </v-chip-group>
    </div>

    <v-textarea v-model="editedInteraction.draft" label="Draft"></v-textarea>
    <v-textarea v-model="editedInteraction.editorDraft.infoSide1" label="Side 1 info"></v-textarea>
    <v-textarea v-model="editedInteraction.editorDraft.infoSide2" label="Side 2 info"></v-textarea>
    <v-textarea v-model="editedInteraction.editorDraft.general" label="General"></v-textarea>
      <v-textarea v-model="editedInteraction.editorDraft.gates" label="Gates"></v-textarea>-->

      <!-- ------------------ MISSING CRUD ARRAYS: Monitor (labTests, otherTests, symptoms) ------------------ -->
      <!-- ------------------ MISSING: references ------------------ -->
    </v-form>
  </v-card>
</template>

<script>
import autocomplete from "@/cmps/Autocomplete";

export default {
  props: {
    materialSide1: Object,
    frame: Object,
    materials: Array,
    labels: Array,
  },
  data() {
    return {
      editedInteraction: null,
      isMaterial: true,
      isMaterialSide2: false,
      valid: true,
      interactionType: "",
    };
  },
  computed: {
    materialType() {
      return require(`@/assets/icons/${this.editedInteraction.side2MaterialId.type}.svg`);
    },
    labelSrc() {
      return require(`@/assets/icons/${this.editedInteraction.side2LabelId.src}.svg`);
    },
  },
  methods: {
    saveInteraction() {
      console.log("SAVE ME!");
    },
    emitSelect(value) {
      if (!value) return;
      console.log('value', value)
      const side2 = {
        _id: value._id,
        name: value.text,
      };
      if (value.type) {
        console.log(value.type);
        side2.type = value.type;
        this.editedInteraction.side2MaterialId = side2;
        this.interactionType = "material";
        console.log("SIDE 2 SELECTED.. DRUG");
      } else if (value.src) {
        side2.src = value.src;
        this.editedInteraction.side2LabelId = side2;
        this.interactionType = "label";
        console.log("SIDE 2 SELECTED.. DRUG");
      } else {
        console.log("SIDE2 PROBLEM");
        return;
      }
      console.log('side2', side2)
      this.isMaterialSide2 = true;
    },
  },
  created() {
    if (this.frame) {
      this.editedInteraction = JSON.parse(JSON.stringify(this.frame));
      console.log("frame:", this.editedInteraction);
      this.editedInteraction.side1MaterialId = {
        _id: this.materialSide1._id,
        name: this.materialSide1.name,
        type: this.materialSide1.type,
      };
    }
  },
  components: {
    autocomplete,
  },
};
</script>

<style>
</style>
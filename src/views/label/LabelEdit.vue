<template>
  <v-card class="label-edit" v-if="editedLabel">
    <!-- <v-card-title class="label-edit-title">{{editedLabel._id? "Edit Label" : "New Label"}}</v-card-title> -->
    <v-form v-model="valid" @submit.prevent="saveLabel">
      <v-text-field
        id="label-name"
        type="text"
        v-model="editedLabel.name"
        label="Name*"
        required
        :rules="[v => !!v || 'Label Name is required']"
      />
      <label for="label-name">Label Color:</label>
      <v-color-picker v-model="editedLabel.color" hide-inputs mode="hexa" value="string" />
    </v-form>
    <div class="form-actions">
      <v-btn class="cancel-btn" to="/label/" color="normal">cancel</v-btn>
      <v-btn class="submit-btn" @click="saveLabel" color="success" :disabled="!valid">Save Label</v-btn>
    </div>
  </v-card>
</template>

<script>
import { labelService } from "@/services/label.service";
import { eventBus, EV_addLabel } from "@/services/eventBus.service";

export default {
  name: "label-edit",
  data() {
    return {
      editedLabel: null,
      valid: true,
    };
  },
  methods: {
    async loadLabel() {
      const labelId = this.$route.params.id;
      var label = null;
      if (labelId) {
        label = await this.$store.dispatch({
          type: "loadLabel",
          labelId,
        });
      } else {
        label = labelService.getEmptyLabel();
      }
      this.editedLabel = JSON.parse(JSON.stringify(label));
      const color = this.editedLabel.color;
      if (typeof color !== "string") {
        this.editedLabel.color = "#FFFFFF00";
      }
    },
    async saveLabel() {
      if (!this.editedLabel.name) return;
      try {
        await this.$store.dispatch({
          type: "saveLabel",
          label: this.editedLabel,
        });
        eventBus.$emit(EV_addLabel, {
          name: this.editedLabel.name,
          type: "label",
          _id: this.editedLabel._id,
        });
        this.$router.push("/label");
      } catch (err) {
        console.log("Error:", err);
      }
    },
  },
  created() {
    this.loadLabel();
  },
};
</script>
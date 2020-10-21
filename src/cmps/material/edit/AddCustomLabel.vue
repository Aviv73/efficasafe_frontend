<template>
  <v-card>
    <v-card-title
      class="primary headline"
      style="color: white; font-weight: bold"
    >
      <v-icon dark left>mdi-label-outline</v-icon>Add Custom label
      <v-spacer></v-spacer>
      <v-icon dark right @click="closeDialog">mdi-window-close</v-icon>
    </v-card-title>
    <v-form v-model="valid" @submit.prevent="saveLabel">
      <v-text-field
        id="label-name"
        type="text"
        v-model="editedLabel.name"
        label="Name*"
        required
        :rules="[(v) => !!v || 'Label Name is required']"
      />
      <label for="label-name">Label Color:</label>
      <v-color-picker
        v-model="editedLabel.color"
        hide-inputs
        mode="hexa"
        value="string"
      />
    </v-form>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="normal" @click="closeDialog">Cancel</v-btn>
      <v-btn
        color="primary"
        @click="saveLabel"
        :disabled="!this.editedLabel || !this.editedLabel.name"
        >Add to material</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
// import labelEdit from '@/views/label/LabelEdit';
import { labelService } from '@/services/label.service';
import { eventBus, EV_addLabel } from '@/services/eventBus.service';

export default {
  data() {
    return {
      valid: true,
      editedLabel: null,
    };
  },
  methods: {
    async saveLabel() {
      if (!this.editedLabel.name) return;
      try {
        const newLabel = await this.$store.dispatch({
          type: 'saveLabel',
          label: this.editedLabel,
        });
        eventBus.$emit(EV_addLabel, {
          name: this.editedLabel.name,
          type: 'label',
          _id: this.editedLabel._id,
        });
        this.emitLabelPath(newLabel);
      } catch (err) {
        console.log('Error:', err);
      }
    },
    async emitLabelPath(label) {
      const labelPath = [
        [
          {
            _id: label._id,
            name: label.name,
          },
        ],
      ];
      this.$emit('add-custom-label', labelPath);
      this.closeDialog();
    },
    async getEmptyLabel() {
      this.editedLabel = JSON.parse(
        JSON.stringify(labelService.getEmptyLabel())
      );
    },
    closeDialog() {
      this.$emit('close-dialog');
    },
  },
  created() {
    this.getEmptyLabel();
  },
};
</script>
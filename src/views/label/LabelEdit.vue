<template>
  <div class="container">
    <v-card class="label-edit" v-if="editedLabel">
      <v-form v-model="valid" @submit.prevent="saveLabel">
        <v-text-field
          type="text"
          v-model="editedLabel.name"
          label="Name*"
          required
          :rules="[(v) => !!v || 'Label Name is required']"
        />
        <h3>Label Color:</h3>
        <v-color-picker
          v-model="editedLabel.color"
          hide-inputs
          mode="hexa"
          value="string"
        />
        <div>
          <h3>Is 'Super'?</h3>
          <v-switch
            v-model="editedLabel.isSuper"
            inset
            :label="`${editedLabel.isSuper}`"
          ></v-switch>
        </div>
        <div>
          <v-btn 
            color="primary"
            class="label-edit-btn"
            @click="isDialogActive = true"
          >Pick Materials</v-btn>
          <span class="text--secondary">
            {{ relatedMaterials.length }} Materials are picked.
            {{ editedLabel.primaryMaterialIds.length ? 'Has primary material/s.' : '' }}
          </span>
        </div>
      </v-form>
      <div class="form-actions">
        <v-btn class="cancel-btn" to="/label/" color="normal">cancel</v-btn>
        <v-btn
          class="submit-btn"
          @click="saveLabel"
          color="success"
          :disabled="!valid || !relatedMaterials.length"
          >Save Label</v-btn
        >
      </div>
    </v-card>
    <v-dialog v-model="isDialogActive" persistent max-width="1400">
      <side-picker
        @close-dialog="isDialogActive = false"
        @side2-picked="setLabelMaterials"
        :labelPrimaryMaterialIds="primaryMaterialIds"
        :relatedMaterials="relatedMaterials"
      />
    </v-dialog>
  </div>
</template>

<script>
import { labelService } from '@/services/label.service';
import { eventBus, EV_addLabel } from '@/services/eventBus.service';
import sidePicker from '@/cmps/interaction/edit/SidePicker';

export default {
  name: 'label-edit',
  data() {
    return {
      editedLabel: null,
      valid: true,
      isDialogActive: false,
      relatedMaterials: []
    };
  },
  computed: {
    primaryMaterialIds() {
      if (!this.editedLabel) return [];
      return this.editedLabel.primaryMaterialIds;
    }
  },
  methods: {
    setLabelMaterials(sidesData) {
      this.editedLabel.primaryMaterialIds = [ ...sidesData.primaryMaterialIds ];
      this.relatedMaterials = [ ...sidesData.materials ];
    },
    async loadLabel() {
      const labelId = this.$route.params.id;
      var label = null;
      if (labelId) {
        label = await this.$store.dispatch({
          type: 'loadLabel',
          labelId,
        });
        const criteria = { labelId, limit: 0 };
        const materials = await this.$store.dispatch({ type: 'getMaterials', criteria });
        this.relatedMaterials = materials;
        console.log('Inload:', this.relatedMaterials);
      } else {
        label = labelService.getEmptyLabel();
      }
      this.editedLabel = JSON.parse(JSON.stringify(label));
      const color = this.editedLabel.color;
      if (typeof color !== 'string') {
        this.editedLabel.color = '#FFFFFF00';
      }
    },
    async saveLabel() {
      if (!this.editedLabel.name) return;
      try {
        const savedLabel = await this.$store.dispatch({
          type: 'saveLabel',
          label: this.editedLabel,
        });
        const relatedMaterialIds = this.relatedMaterials.map(mat => mat._id);
        const data = {
          ids: relatedMaterialIds,
          label: savedLabel
        }
        await this.$store.dispatch({ type: 'updateMaterials', data });
        
        eventBus.$emit(EV_addLabel, {
          name: this.editedLabel.name,
          type: 'label',
          _id: this.editedLabel._id,
        });
      } catch (err) {
        console.log('Error:', err);
      }
    },
    async addMaterials(DBKIds) {
      const materials = await Promise.all(DBKIds.map(drugBankId => {
          return this.$store.dispatch({
              type: 'getMaterials',
              criteria: { drugBankId, page: 0, limit: 0 }
          });
      }));
      this.relatedMaterials = materials.flat(1);
    }
  },
  async created() {
    const { materials } = this.$route.query;
    if (materials) await this.addMaterials(materials.split(','));
    this.loadLabel();
  },
  components: {
    sidePicker
  }
};
</script>
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
        <h3 class="mt-4">Label Color:</h3>
        <v-color-picker
          v-model="editedLabel.color"
          hide-inputs
          class="mx-auto"
          mode="hexa"
          value="string"
        />
        <div class="d-flex align-center justify-center mt-4">
          <h3 class="mr-6">Is 'Super'?</h3>
          <v-switch
            v-model="editedLabel.isSuper"
            inset
            :label="`${editedLabel.isSuper}`"
          ></v-switch>
        </div>
        <h3 class="mt-4">Pick Materials:</h3>
        <div class="label-edit-material-picker">
          <v-btn 
            color="primary"
            @click="isDialogActive = true"
            outlined
            rounded
          >
            Material picker
          </v-btn>
          <v-btn
            color="primary"
            outlined
            rounded
            @click="isCategoriesDialogActive = true"
          >
            Browse categories
          </v-btn>
        </div>
        <span class="text--secondary">
          {{ relatedMaterials.length }} Materials are picked.
          {{ editedLabel.primaryMaterialIds.length ? 'Has primary material/s.' : '' }}
        </span>
        <v-divider class="mt-4" />
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
      </v-form>
    </v-card>
    <v-dialog v-model="isDialogActive" persistent max-width="1400">
      <side-picker
        @close-dialog="isDialogActive = false"
        @side2-picked="setLabelMaterials"
        :labelPrimaryMaterialIds="primaryMaterialIds"
        :relatedMaterials="relatedMaterials"
      />
    </v-dialog>
    <v-dialog v-model="isCategoriesDialogActive" max-width="1200">
      <label-search
        @close-search-dialog="isCategoriesDialogActive = false"
        @import-materials="addMaterials"
      />
    </v-dialog>
  </div>
</template>

<script>
import { labelService } from '@/cms/services/label.service';
import { eventBus, EV_addLabel } from '@/cms/services/eventBus.service';
import sidePicker from '@/cms/cmps/interaction/edit/SidePicker';
import labelSearch from '@/cms/cmps/label/LabelSearch';

export default {
  name: 'label-edit',
  data() {
    return {
      editedLabel: null,
      valid: true,
      isDialogActive: false,
      isCategoriesDialogActive: false,
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
    async getMaterials(DBKIds) {
      const materials = await Promise.all(DBKIds.map(drugBankId => {
          return this.$store.dispatch({
              type: 'getMaterials',
              criteria: { drugBankId, page: 0, limit: 0 }
          });
      }));
      this.relatedMaterials = materials.flat(1);
    },
    addMaterials(materials) {
      materials.forEach(material => {
        if (this.relatedMaterials.findIndex(currMaterial => currMaterial._id === material._id) === -1) {
          this.relatedMaterials.push(material);
        }
      });
    }
  },
  async created() {
    const { materials } = this.$route.query;
    if (materials) await this.getMaterials(materials.split(','));
    this.loadLabel();
  },
  components: {
    sidePicker,
    labelSearch
  }
};
</script>
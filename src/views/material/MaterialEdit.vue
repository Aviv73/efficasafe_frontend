<template>
  <section>
    <v-row justify="center">
      <confirm-delete-item
        :dialog="dialog"
        @remove-item-canceled="removeItemCanceled"
        @remove-item-confirmed="removeItemConfirmed"
      />
      <v-dialog v-model="labelDialog" persistent scrollable max-width="1000">
        <material-add-tree-path
          @close-dialog="labelDialog = false"
          @add-label-paths="addLabelPaths"
        />
      </v-dialog>
    </v-row>
    <v-card class="material-edit" v-if="editedMaterial">
      <v-form v-model="valid" @submit.prevent="saveMaterial">
        <v-text-field
          id="mat-name"
          type="text"
          v-model="editedMaterial.name"
          label="Material name*"
          required
          :rules="[(v) => !!v || 'Material Name is required']"
        />

        <div class="material-id-row">
          <v-select
            class="mat-type"
            v-model="editedMaterial.type"
            :items="materialType"
            :rules="[(v) => !!v || 'Material type is required']"
            label="Type*"
            required
          ></v-select>
          <v-text-field
            id="mat-atc"
            type="text"
            v-model="editedMaterial.atcId"
            label="ATC Code"
          />
          <v-text-field
            id="mat-dbid"
            type="text"
            v-model="editedMaterial.drugBankId"
            label="DrugBank ID"
          />
        </div>

        <h3>Description:</h3>
        <ckeditor 
          v-model="editedMaterial.desc" 
          :config="CKEditorConfig"
          ></ckeditor>

        <div class="list-chips">
          <v-text-field
            v-model="model.aliases"
            label="Aliases"
            :disabled="editedMaterial.type !== 'herb'"
            @keypress.enter.prevent="addItemToArray('aliases')"
          />
          <v-chip-group column active-class="primary--text">
            <v-chip
              v-for="alias in editedMaterial.aliases"
              :key="alias.id"
              close
              @click:close="removeItem('aliases', alias.id)"
              >{{ alias.txt }}</v-chip
            >
          </v-chip-group>
        </div>

        <div class="list-chips">
          <v-text-field
            type="text"
            v-model="model.qualities"
            label="Qualities"
            @keypress.enter.prevent="addItemToArray('qualities')"
          />
          <v-chip-group column active-class="primary--text">
            <v-chip
              v-for="quality in editedMaterial.qualities"
              :key="quality.id"
              close
              @click:close="removeItem('qualities', quality.id)"
              >{{ quality.txt }}</v-chip>
          </v-chip-group>
        </div>

        <search-sub-material
          id="mat-sub-materials"
          :subMaterials="editedMaterial.subMaterials"
          :materials="materials"
          placeholder="Sub Materials"
          @addSubMaterial="addSubMaterial"
          @removeSubMaterial="removeItem"
        />

        <div class="list-chips">
          <v-text-field
            v-model="model.medicinalActivity"
            label="Medicinal Activity"
            @keypress.enter.prevent="addItemToArray('medicinalActivity')"
          />
          <v-chip-group column active-class="primary--text">
            <v-chip
              v-for="activity in editedMaterial.medicinalActivity"
              :key="activity.id"
              close
              @click:close="removeItem('medicinalActivity', activity.id)"
              >{{ activity.txt }}</v-chip
            >
          </v-chip-group>
        </div>

        <div class="list-chips">
          <v-text-field
            v-model="model.indications"
            label="Indications"
            @keypress.enter.prevent="addItemToArray('indications')"
          />
          <v-chip-group column active-class="primary--text">
            <v-chip
              v-for="indication in editedMaterial.indications"
              :key="indication.id"
              close
              @click:close="removeItem('indications', indication.id)"
              >{{ indication.txt }}</v-chip
            >
          </v-chip-group>
        </div>

        <v-text-field
          type="text"
          v-model="editedMaterial.dosage"
          label="Dosage"
        />

        <v-text-field
          type="text"
          v-model="editedMaterial.sensitivities"
          label="Sensitivities"
        />

        <h3>Adverse Reactions:</h3>
        <ckeditor 
          v-model="editedMaterial.adverseReactions" 
          :config="CKEditorConfig"
        ></ckeditor>

        <h3>Overdose:</h3>
        <ckeditor 
          v-model="editedMaterial.overdose" 
          :config="CKEditorConfig"
        ></ckeditor>

        <h3>Precautions:</h3>
        <ckeditor 
          v-model="editedMaterial.precautions" 
          :config="CKEditorConfig"
        ></ckeditor>

        <h3>Contraindications:</h3>
        <ckeditor 
          v-model="editedMaterial.contraindications" 
          :config="CKEditorConfig"
        ></ckeditor>

        <h3>Toxicity:</h3>
        <ckeditor 
          v-model="editedMaterial.toxicity" 
          :config="CKEditorConfig"
        ></ckeditor>

        <h3>Pregnancy:</h3>
        <ckeditor 
          v-model="editedMaterial.pregnancy" 
          :config="CKEditorConfig"
        ></ckeditor>
     
        <h3>Lactation:</h3>
        <ckeditor 
          v-model="editedMaterial.lactation" 
          :config="CKEditorConfig"
        ></ckeditor>

        <h3>Effect on drug metabolism:</h3>
        <ckeditor 
          v-model="editedMaterial.effectOnDrugMetabolism" 
          :config="CKEditorConfig"
        ></ckeditor>

        <material-reference
          v-if="materialReferences"
          :references="materialReferences"
        />

        <h3>Draft:</h3>
        <ckeditor 
          v-model="editedMaterial.draft" 
          :config="CKEditorConfig"
        ></ckeditor>

        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedMaterial.editorDraft"
          label="Editor Draft"
        />

        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedMaterial.drugBankInfo.desc"
          label="Description"
        />
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedMaterial.drugBankInfo.clinicalDesc"
          label="Clinical description"
        />
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedMaterial.drugBankInfo.pharmacology"
          label="Pharmacology"
        />

        <div class="list-chips">
          <v-text-field
            v-model="model.brands"
            label="Brands"
            :disabled="editedMaterial.type !== 'drug'"
            @keypress.enter.prevent="addItemToArray('brands')"
          />
          <v-chip-group column active-class="primary--text">
            <v-chip
              v-for="brand in editedMaterial.brands"
              :key="brand.id"
              close
              @click:close="removeItem('brands', brand.id)"
              >{{ brand.txt }}</v-chip
            >
          </v-chip-group>
        </div>
        <material-label-path
          :labelPaths="editedMaterial.labelPaths"
          @add-label="addLabelPaths"
          @add-custom-label="addCustomLabel"
          @remove-path="removeItem"
          @open-dialog="labelDialog = true"
        />
        <div>
          <label for="mat-regions">Regions:</label>
          <regions-selector
            :regions="editedMaterial.regions"
            @updateRegions="updateRegions"
          />
        </div>
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedMaterial.drugBankInfo.boxedWarnings"
          label="Boxed warnings"
        />
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedMaterial.drugBankInfo.foodInteractions"
          label="Food interactions"
        />
      </v-form>
      <div class="form-actions">
        <v-btn class="cancel-btn" to="/material/" color="normal">cancel</v-btn>
        <v-btn
          class="submit-btn"
          @click="saveMaterial"
          color="success"
          :disabled="!valid || isNewReferenceList"
          >Save Material</v-btn
        >
      </div>
    </v-card>
  </section>
</template>

<script>
import { materialService } from "@/services/material.service";
import { utilService } from "@/services/util.service";
import { eventBus, EV_addMaterial } from "@/services/eventBus.service";
import confirmDeleteItem from "../../cmps/common/ConfirmDeleteItem";
import searchSubMaterial from "../../cmps/material/edit/SearchSubMaterial";
import materialLabelPath from "../../cmps/material/edit/MaterialLabelPath";
import materialAddTreePath from "../../cmps/material/edit/MaterialAddTreePath";
import materialReference from "../../cmps/material/edit/MaterialReference";
import regionsSelector from "../../cmps/material/edit/RegionsSelector";
import CKEditor from 'ckeditor4-vue';

export default {
  data() {
    return {
      editedMaterial: null,
      isNewReferenceList: false,
      valid: true,
      dialog: false,
      labelDialog: false,
      itemToRemove: null,
      materialReferences: null,
      CKEditorConfig: {
        extraPlugins: 'autogrow',
        autoGrow_minHeight: 50
      },
      alerts: {
        success: false,
      },
      model: {
        aliases: '',
        brands: '',
        medicinalActivity: '',
        indications: '',
        activeConstituents: '',
        qualities: ''
      },
      subMaterialName: '',
      materialType: [
        {
          text: "Drug",
          value: "drug",
        },
        {
          text: "Herb",
          value: "herb",
        },
      ],
    };
  },
  computed: {
    materials() {
      return this.$store.getters.materials;
    },
  },
  methods: {
    removeLabelPath(idx) {
      this.editedMaterial.labelPaths.splice(idx, 1);
    },
    addLabelPaths(labelPaths) {
      const old = JSON.parse(JSON.stringify(this.editedMaterial.labelPaths));
      this.editedMaterial.labelPaths = [...old, ...labelPaths];
    },
    addCustomLabel() {
      console.log('Adding New Custom label!');
      //// seperate the form from labelEdit and make it reusable
      //// use this CMP here inside modal
    },
    async loadMaterial() {
      const matId = this.$route.params.id;
      var material = null;
      if (matId) {
        material = await this.$store.dispatch({
          type: "loadMaterial",
          matId,
        });
      } else {
        material = materialService.getEmptyMaterial();
      }
      this.editedMaterial = JSON.parse(JSON.stringify(material));
      this.getMaterialReferences();
    },
    async getMaterialReferences() {
      const refIds = [...this.editedMaterial.refIds];
      if (refIds.length) {
        const materialReferences = await this.$store.dispatch({
          type: "loadReferences",
          refIds,
        });
        this.materialReferences = materialReferences;
      }
    },
    loadMaterials() {
      const criteria = { type: "drug" };
      this.$store.dispatch({ type: "loadMaterials", criteria });
    },
    async saveMaterial() {
      if (!this.editedMaterial.name || !this.editedMaterial.type) return;
      try {
        await this.$store.dispatch({
          type: "saveMaterial",
          material: this.editedMaterial,
        });
        eventBus.$emit(EV_addMaterial, {
          name: this.editedMaterial.name,
          type: "material",
          _id: this.editedMaterial._id,
        });
        this.$router.push("/material");
      } catch (err) {
        console.log("Error:", err);
      }
    },
    removeItem(type, id) {
      this.itemToRemove = {
        type,
        id,
      };
      this.dialog = true;
    },
    removeItemCanceled() {
      this.dialog = false;
      this.itemToRemove = null;
    },
    removeItemConfirmed() {
      if (this.itemToRemove.type === 'labelPaths') this.removeLabelPath(this.itemToRemove.id);
      else this.removeItemFromArray(this.itemToRemove.id, this.itemToRemove.type);
      
      this.dialog = false;
      this.itemToRemove = null;
    },
    updateRegions(regions) {
      this.editedMaterial.regions = regions;
    },
    removeItemFromArray(itemId, arrName) {
      var id = (arrName === 'subMaterials') ? '_id': 'id';
      const idx = this.editedMaterial[arrName].findIndex(currItem => currItem[id] === itemId);
      if (idx !== -1) this.editedMaterial[arrName].splice(idx, 1);
    },
    addItemToArray(arrName) {
      if (!this.model[arrName]) return;
      const items = this.model[arrName].split(',');
      items.forEach(currItem => {
        const item = {
          id: utilService.makeId(),
          txt: currItem.trim()
        };
        this.editedMaterial[arrName].push(item);
      });
      this.model[arrName] = '';
    },
    addSubMaterial(subMaterial) {
      if (!subMaterial) return;
      const idx = this.editedMaterial.subMaterials.findIndex(
        (currSubMaterial) => currSubMaterial._id === subMaterial._id
      );

      if (idx === -1) {
        this.editedMaterial.subMaterials.push(subMaterial);
      }
    }
  },
  created() {
    this.loadMaterial();
    this.loadMaterials();
  },
  components: {
    regionsSelector,
    searchSubMaterial,
    materialLabelPath,
    materialAddTreePath,
    materialReference,
    confirmDeleteItem,
    ckeditor: CKEditor.component
  }
};
</script>
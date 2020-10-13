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
          :rules="[v => !!v || 'Material Name is required']"
        />

        <div class="material-id-row">
          <v-select
            class="mat-type"
            v-model="editedMaterial.type"
            :items="materialType"
            :rules="[v => !!v || 'Material type is required']"
            label="Type*"
            required
          ></v-select>
          <v-text-field id="mat-atc" type="text" v-model="editedMaterial.atc" label="ATC Code" />
          <v-text-field
            id="mat-dbid"
            type="text"
            v-model="editedMaterial.drugBankId"
            label="DrugBank ID"
          />
        </div>
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedMaterial.desc"
          label="Description"
        />

        <div class="list-chips">
          <v-text-field v-model="model.alias" label="Aliases" @keypress.enter.prevent="addAlias" />
          <v-chip-group column active-class="primary--text">
            <v-chip
              v-for="alias in editedMaterial.aliases"
              :key="alias.id"
              close
              @click:close="removeItem('alias', alias.id)"
            >{{ alias.name }}</v-chip>
          </v-chip-group>
        </div>

        <v-text-field type="text" v-model="editedMaterial.qualities" label="Qualities" />

        <search-sub-material
          id="mat-sub-materials"
          :subMaterials="editedMaterial.subMaterials"
          :materials="materials"
          placeholder="Sub Materials"
          @addSubMaterial="addSubMaterial"
          @removeSubMaterial="getSubMaterialToDelete"
        />

        <div class="list-chips">
          <v-text-field
            v-model="model.medicinalActivity"
            label="Medicinal Activity"
            @keypress.enter.prevent="addMedicinalActivity"
          />
          <v-chip-group column active-class="primary--text">
            <v-chip
              v-for="activity in editedMaterial.medicinalActivity"
              :key="activity.id"
              close
              @click:close="removeItem('medicinalActivity', activity.id)"
            >{{ activity.name }}</v-chip>
          </v-chip-group>
        </div>

        <div class="list-chips">
          <v-text-field
            v-model="model.indication"
            label="Indications"
            @keypress.enter.prevent="addIndication"
          />
          <v-chip-group column active-class="primary--text">
            <v-chip
              v-for="indication in editedMaterial.indications"
              :key="indication.id"
              close
              @click:close="removeItem('indication', indication.id)"
            >{{ indication.name }}</v-chip>
          </v-chip-group>
        </div>

        <v-text-field type="text" v-model="editedMaterial.dosage" label="Dosage" />

        <v-text-field type="text" v-model="editedMaterial.sensitivities" label="Sensitivities" />

        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedMaterial.adverseReactions"
          label="Adverse Reactions"
        />

        <v-text-field type="text" v-model="editedMaterial.overdose" label="Overdose" />

        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedMaterial.precautions"
          label="Precautions"
        />

        <div class="list-chips">
          <v-text-field
            v-model="model.contraindication"
            label="Contraindications"
            @keypress.enter.prevent="addContraindication"
          />
          <v-chip-group column active-class="primary--text">
            <v-chip
              v-for="contraindication in editedMaterial.contraindications"
              :key="contraindication.id"
              close
              @click:close="removeItem('contraindication', contraindication.id)"
            >{{ contraindication.name }}</v-chip>
          </v-chip-group>
        </div>

        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedMaterial.toxicity"
          label="Toxicity"
        />
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedMaterial.pregnancy"
          label="Pregnancy"
        />
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedMaterial.lactation"
          label="Lactation"
        />

        <material-reference
          :references="editedMaterial.references"
          @data-ready="AddReferences"
          @save-data="saveReferences"
        />

        <v-textarea type="text" rows="1" auto-grow v-model="editedMaterial.draft" label="Draft" />

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
          <v-text-field v-model="model.brand" label="Brands" @keypress.enter.prevent="addBrand" />
          <v-chip-group column active-class="primary--text">
            <v-chip
              v-for="brand in editedMaterial.brands"
              :key="brand.id"
              close
              @click:close="removeItem('brand', brand.id)"
            >{{ brand.name }}</v-chip>
          </v-chip-group>
        </div>
        <material-label-path
          :labelPaths="editedMaterial.labelPaths"
          @add-label="addLabelPaths"
          @remove-path="removeLabelPathByIdx"
          @open-dialog="labelDialog = true"
        />
        <div>
          <label for="mat-regions">Regions:</label>
          <regions-selector :regions="editedMaterial.regions" @updateRegions="updateRegions" />
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
        >Save Material</v-btn>
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

export default {
  data() {
    return {
      editedMaterial: null,
      isNewReferenceList: false,
      valid: true,
      dialog: false,
      labelDialog: false,
      itemToRemove: null,
      alerts: {
        success: false,
      },
      model: {
        alias: "",
        brand: "",
        medicinalActivity: "",
        indication: "",
        contraindication: "",
      },
      subMaterialName: "",
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
    async saveReferences() {
      const references = await this.$store.dispatch({
        type: "saveReferences",
        references: this.editedMaterial.references,
      });
      try {
        this.editedMaterial.references = references;
        this.isNewReferenceList = false;
      } catch (err) {
        console.log("ERROR:", err);
      }
    },
    AddReferences(data) {
      this.editedMaterial.references = data;
      this.isNewReferenceList = true;
    },
    removeLabelPath(idx) {
      this.editedMaterial.labelPaths.splice(idx, 1);
    },
    addLabelPaths(labelPaths) {
      let old = JSON.parse(JSON.stringify(this.editedMaterial.labelPaths));
      this.editedMaterial.labelPaths = [...old, ...labelPaths];
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
    },
    loadMaterials() {
      this.$store.dispatch({ type: "loadMaterials" });
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
    getSubMaterialToDelete(id) {
      this.removeItem("subMaterial", id);
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
      switch (this.itemToRemove.type) {
        case "alias":
          this.removeAlias(this.itemToRemove.id);
          break;
        case "brand":
          this.removeBrand(this.itemToRemove.id);
          break;
        case "medicinalActivity":
          this.removeMedicinalActivity(this.itemToRemove.id);
          break;
        case "indication":
          this.removeIndication(this.itemToRemove.id);
          break;
        case "contraindication":
          this.removeContraindication(this.itemToRemove.id);
          break;
        case "labelPath":
          this.removeLabelPath(this.itemToRemove.id);
          break;
        case "subMaterial":
          this.removeSubMaterial(this.itemToRemove.id);
          break;
      }
      this.dialog = false;
      this.itemToRemove = null;
    },
    removeLabelPathByIdx(idx) {
      this.removeItem("labelPath", idx);
    },
    addIndication() {
      if (!this.model.indication) return;

      const indications = this.model.indication.split(",");
      indications.forEach((indication) => {
        let newIndication = {
          id: utilService.makeId(10),
          name: indication,
        };
        this.editedMaterial.indications.push(newIndication);
      });

      this.model.indication = "";
    },
    removeIndication(indicationId) {
      const idx = this.editedMaterial.indications.findIndex(
        (currIndication) => currIndication.id === indicationId
      );
      if (idx !== -1) {
        this.editedMaterial.indications.splice(idx, 1);
      }
    },
    addContraindication() {
      if (!this.model.contraindication) return;

      const contraindications = this.model.contraindications.split(",");
      contraindications.forEach((contraindication) => {
        let newContraindication = {
          id: utilService.makeId(10),
          name: contraindication,
        };
        this.editedMaterial.contraindications.push(newContraindication);
      });

      this.model.contraindication = "";
    },
    removeContraindication(contraindicationId) {
      const idx = this.editedMaterial.contraindications.findIndex(
        (currContraindications) =>
          currContraindications.id === contraindicationId
      );
      if (idx !== -1) {
        this.editedMaterial.contraindications.splice(idx, 1);
      }
    },
    updateRegions(regions) {
      this.editedMaterial.regions = regions;
    },
    addAlias() {
      if (!this.model.alias) return;

      const aliases = this.model.alias.split(",");
      aliases.forEach((alias) => {
        let newAlias = {
          id: utilService.makeId(10),
          name: alias,
        };
        this.editedMaterial.aliases.push(newAlias);
      });
      this.model.alias = "";
    },
    removeAlias(aliasId) {
      const idx = this.editedMaterial.aliases.findIndex(
        (currAlias) => currAlias.id === aliasId
      );
      if (idx !== -1) {
        this.editedMaterial.aliases.splice(idx, 1);
      }
    },
    addBrand() {
      if (!this.model.brand) return;

      const brands = this.model.brand.split(",");
      brands.forEach((brand) => {
        let newBrand = {
          id: utilService.makeId(10),
          name: brand,
        };
        this.editedMaterial.brands.push(newBrand);
      });
      this.model.brand = "";
    },
    removeBrand(brandId) {
      const idx = this.editedMaterial.brands.findIndex(
        (currBrand) => currBrand.id === brandId
      );
      if (idx !== -1) {
        this.editedMaterial.brands.splice(idx, 1);
      }
    },
    addMedicinalActivity() {
      if (!this.model.medicinalActivity) return;

      const medicinalActivities = this.model.medicinalActivity.split(",");
      medicinalActivities.forEach((medicinalActivity) => {
        let newMedicinalActivity = {
          id: utilService.makeId(10),
          name: medicinalActivity,
        };
        this.editedMaterial.medicinalActivity.push(newMedicinalActivity);
      });

      this.model.medicinalActivity = "";
    },
    removeMedicinalActivity(medicinalActivityId) {
      const idx = this.editedMaterial.medicinalActivity.findIndex(
        (currMedicinalActivity) =>
          currMedicinalActivity.id === medicinalActivityId
      );
      if (idx !== -1) {
        this.editedMaterial.medicinalActivity.splice(idx, 1);
      }
    },
    addSubMaterial(subMaterial) {
      if (!subMaterial) return;
      const idx = this.editedMaterial.subMaterials.findIndex(
        (currSubMaterial) => currSubMaterial._id === subMaterial._id
      );

      if (idx === -1) {
        this.editedMaterial.subMaterials.push(subMaterial);
      }
    },
    removeSubMaterial(subMaterialId) {
      const idx = this.editedMaterial.subMaterials.findIndex(
        (currSubMaterial) => currSubMaterial._id === subMaterialId
      );
      if (idx !== -1) {
        this.editedMaterial.subMaterials.splice(idx, 1);
      }
    },
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
  },
};
</script>
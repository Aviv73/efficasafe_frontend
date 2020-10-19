<template>
  <section class="material-details" v-if="material">
    <confirm-delete
      v-model="dialog"
      type="material"
      :dialog="dialog"
      @delete-confirm="removeMaterial"
      @delete-cancel="dialog = false"
    />
    <div class="action-container">
      <v-btn class="base-btn action-btn" color="primary" to="/material">
        <v-icon small left>mdi-arrow-left</v-icon>Back to Materials
      </v-btn>
      <v-btn
        class="base-btn action-btn"
        color="primary"
        :to="{ path: '/interaction', query: { material: `${material._id}` } }"
      >
        <v-icon small left>mdi-view-list</v-icon>Interactions
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        class="base-btn action-btn"
        color="primary"
        :to="`/material/edit/${material._id}`"
      >
        <v-icon small left>mdi-pencil</v-icon>Edit
      </v-btn>
      <v-btn color="error" @click="displayDialog">
        <v-icon small left>mdi-delete</v-icon>Delete
      </v-btn>
    </div>

    <v-card class="info-container">
      <v-card-title class="material-details-title">{{
        material.name
      }}</v-card-title>

      <h3 class="info-title">Type:</h3>
      <div class="info-value">{{ material.type }}</div>

      <h3 class="info-title">ATC Code:</h3>
      <div class="info-value">{{ material.atcId }}</div>

      <h3 class="info-title">DrugBank ID:</h3>
      <span class="info-value">{{ material.drugBankId }}</span>

      <h3 class="info-title">Description:</h3>
      <p class="info-value" v-html="material.desc"></p>

      <h3 class="info-title" v-if="material.dosage">Dosage:</h3>
      <p class="info-value" v-if="material.dosage">{{ material.dosage }}</p>

      <h3 class="info-title">Precautions:</h3>
      <p class="info-value" v-html="material.precautions"></p>

      <h3 class="info-title">Adverse Reactions:</h3>
      <p class="info-value" v-html="material.adverseReactions"></p>

      <h3 class="info-title" v-if="material.sensitivities">Sensitivities:</h3>
      <p class="info-value" v-if="material.sensitivities">{{ material.sensitivities }}</p>

      <h3 class="info-title" v-if="material.overdose">Overdose:</h3>
      <p class="info-value" v-if="material.overdose" v-html="material.overdose"></p>

      <h3 class="info-title" v-if="material.contraindications">Contraindications:</h3>
      <p class="info-value" v-if="material.contraindications" v-html="material.contraindications"></p>

      <h3 class="info-title" v-if="material.toxicity">Toxicity:</h3>
      <p class="info-value" v-if="material.toxicity" v-html="material.toxicity"></p>

      <h3 class="info-title" v-if="material.pregnancy">Pregnancy:</h3>
      <p class="info-value" v-if="material.pregnancy" v-html="material.pregnancy"></p>

      <h3 class="info-title" v-if="material.lactation">Lactation:</h3>
      <p class="info-value" v-if="material.lactation" v-html="material.lactation"></p>

      <h3 class="info-title" v-if="material.effectOnDrugMetabolism">Effect on drug metabolism:</h3>
      <p class="info-value" v-if="material.effectOnDrugMetabolism" v-html="material.effectOnDrugMetabolism"></p>

      <h3 class="info-title" v-if="material.editorDraft">Editor draft:</h3>
      <p class="info-value" v-if="material.editorDraft">{{ material.editorDraft }}</p>

      <h3 class="info-title">Draft:</h3>
      <p class="info-value" v-html="material.draft"></p>

      <h3 class="info-title" v-if="material.medicinalActivity.length">Medicinal Activity:</h3>
      <div class="info-value" v-if="material.medicinalActivity.length">
        <v-chip-group column>
          <v-chip v-for="medActivity in material.medicinalActivity" :key="medActivity.id">{{ medActivity.txt }}</v-chip>
        </v-chip-group>
      </div>

      <h3 class="info-title" v-if="material.activeConstituents.length">Active Constituents:</h3>
      <div class="info-value" v-if="material.activeConstituents.length">
        <v-chip-group column>
          <v-chip v-for="activeConstituent in material.activeConstituents" :key="activeConstituent.id">{{ activeConstituent.txt }}</v-chip>
        </v-chip-group>
      </div>

      <h3 class="info-title" v-if="material.qualities.length">Qualities:</h3>
      <div class="info-value" v-if="material.qualities.length">
        <v-chip-group column>
          <v-chip v-for="quality in material.qualities" :key="quality.id">{{ quality.txt }}</v-chip>
        </v-chip-group>
      </div>

      <h3 class="info-title" v-if="material.aliases.length">Synonyms:</h3>
      <v-chip-group
        column
        v-if="material.aliases.length"
      >
        <v-chip v-for="alias in material.aliases" :key="alias.id">{{ alias.txt }}</v-chip>
      </v-chip-group>

      <h3 class="info-title" v-if="material.brands.length">Brands:</h3>
      <v-chip-group
        column
        v-if="material.brands.length"
      >
        <v-chip v-for="brand in material.brands" :key="brand.id">{{
          brand.txt
        }}</v-chip>
      </v-chip-group>

      <h3 class="info-title">Regions:</h3>
      <v-chip-group column>
        <v-chip v-for="region in material.regions" :key="region">
          <v-avatar left>
            <v-img
              :src="require(`@/assets/icons/regions/${region}.svg`)"
            ></v-img>
          </v-avatar>
          {{ region.toUpperCase() }}
        </v-chip>
      </v-chip-group>

      <h3 class="info-title">Indications:</h3>
      <v-chip-group column>
        <v-chip
          v-for="indication in material.indications"
          :key="indication.id"
          >{{ indication.txt }}</v-chip>
      </v-chip-group>

      <h3 class="info-title" v-if="material.subMaterials.length">
        Sub Materials:
      </h3>
      <sub-material-list :subMats="material.subMaterials" />

      <h3 class="info-title" v-if="material.labelPaths.length">Label Paths:</h3>
      <label-path-list :labelPaths="material.labelPaths" :isEdit="false" />

      <h3 class="info-title" v-if="material.refIds.length">References:</h3>
      <reference-table
        :references="materialReferences"
        v-if="material.refIds.length"
      />
    </v-card>

    <icons-map />
  </section>
</template>

<script>
import subMaterialList from "@/cmps/material/SubMaterialList";
import labelPathList from "@/cmps/material/details/LabelPathList";
import confirmDelete from "@/cmps/general/ConfirmDelete";
import referenceTable from "@/cmps/common/ReferenceTable";
import iconsMap from "@/cmps/general/IconsMap";

export default {
  data() {
    return {
      material: null,
      dialog: false,
      materialReferences: null,
    };
  },
  watch: {
    "$route.params.id": function () {
      this.loadMaterial();
    },
  },
  methods: {
    async loadMaterial() {
      const matId = this.$route.params.id;
      if (matId) {
        const material = await this.$store.dispatch({
          type: "loadMaterial",
          matId,
        });
        this.material = material;
        this.getMaterialReferences();
      }
    },
    removeMaterial() {
      const material = JSON.parse(JSON.stringify(this.material));
      const matId = material._id;
      const saveToArchive = this.$store.dispatch({
        type: "saveMaterialToArchive",
        material,
      });
      const removeMaterial = this.$store.dispatch({
        type: "removeMaterial",
        matId,
      });
      Promise.all([saveToArchive, removeMaterial]).then(() => {
        this.$router.push("/material");
      });
    },
    async getMaterialReferences() {
      const refIds = [...this.material.refIds];
      if (refIds.length) {
        const materialReferences = await this.$store.dispatch({
          type: "loadReferences",
          refIds,
        });
        this.materialReferences = materialReferences;
      }
    },
    displayDialog() {
      this.dialog = true;
    },
  },
  created() {
    this.loadMaterial();
  },
  components: {
    subMaterialList,
    labelPathList,
    referenceTable,
    confirmDelete,
    iconsMap,
  },
};
</script>
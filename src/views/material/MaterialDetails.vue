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
        :to="{path:'/interaction',query:{material:`${material._id}`}}"
      >
        <v-icon small left>mdi-view-list</v-icon>Interactions
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn class="base-btn action-btn" color="primary" :to="`/material/edit/${material._id}`">
        <v-icon small left>mdi-pencil</v-icon>Edit
      </v-btn>
      <v-btn color="error" @click="displayDialog">
        <v-icon small left>mdi-delete</v-icon>Delete
      </v-btn>
    </div>

    <v-card class="info-container">
      <v-card-title class="material-details-title">{{material.name}}</v-card-title>

      <h3 class="info-title">Type:</h3>
      <div class="info-value">{{ material.type}}</div>

      <h3 class="info-title">ATC Code:</h3>
      <div class="info-value">{{ material.atcId}}</div>

      <h3 class="info-title">DrugBank ID:</h3>
      <span class="info-value">{{ material.drugBankId}}</span>

      <h3 class="info-title">Description:</h3>
      <p class="info-value">{{ material.desc}}</p>

      <h3 class="info-title">Precautions:</h3>
      <p class="info-value">{{ material.precautions}}</p>

      <h3 class="info-title">Adverse Reactions:</h3>
      <p class="info-value">{{ material.adverseReactions}}</p>

      <h3 class="info-title">Draft:</h3>
      <p class="info-value">{{ material.draft}}</p>

      <h3 class="info-title" v-if="material.aliases">Synonyms:</h3>
      <v-chip-group column active-class="primary--text" v-if="material.aliases">
        <v-chip v-for="alias in material.aliases" :key="alias.id">{{ alias.name }}</v-chip>
      </v-chip-group>

      <h3 class="info-title" v-if="material.brands">Brands:</h3>
      <v-chip-group column active-class="primary--text" v-if="material.brands">
        <v-chip v-for="brand in material.brands" :key="brand.id">{{ brand.name }}</v-chip>
      </v-chip-group>

      <h3 class="info-title">Regions:</h3>
      <v-chip-group column active-class="primary--text">
        <v-chip v-for="region in material.regions" :key="region">
          <v-avatar left>
            <v-img :src="require(`@/assets/icons/regions/${region}.svg`)"></v-img>
          </v-avatar>
          {{ region.toUpperCase() }}
        </v-chip>
      </v-chip-group>

      <h3 class="info-title">Indications:</h3>
      <v-chip-group column active-class="primary--text">
        <v-chip
          v-for="indication in material.indications"
          :key="indication.id"
        >{{ indication.name }}</v-chip>
      </v-chip-group>

      <h3 class="info-title" v-if="material.subMaterials.length">Sub Materials:</h3>
      <sub-material-list :subMats="material.subMaterials" />

      <h3 class="info-title" v-if="material.labelPaths.length">Label Paths:</h3>
      <label-path-list :labelPaths="material.labelPaths" :isEdit="false" />

      <h3 class="info-title" v-if="material.refIds.length">References:</h3>
      <!-- reference-table needs references OBJECTS NOT IDs (get from server) -->
      <reference-table :references="material.references" v-if="material.refIds.length" />
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
      }
    },
    async removeMaterial() {
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
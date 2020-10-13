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

      <span class="info-title">Type:</span>
      <span class="info-value">{{material.type}}</span>

      <span class="info-title">ATC Code:</span>
      <span class="info-value">{{material.atc}}</span>

      <span class="info-title">DrugBank ID:</span>
      <span class="info-value">{{material.drugBankId}}</span>

      <span class="info-title">Description:</span>
      <p class="info-value">{{material.desc}}</p>

      <span class="info-title">Precautions:</span>
      <p class="info-value">{{material.precautions}}</p>

      <span class="info-title">Adverse Reactions:</span>
      <p class="info-value">{{material.adverseReactions}}</p>

      <span class="info-title">Draft:</span>
      <p class="info-value">{{material.draft}}</p>

      <span class="info-title">Synonyms:</span>
      <v-chip-group column active-class="primary--text">
        <v-chip v-for="alias in material.aliases" :key="alias.id">{{ alias.name }}</v-chip>
      </v-chip-group>

      <span class="info-title">Brands:</span>
      <v-chip-group column active-class="primary--text">
        <v-chip v-for="brand in material.brands" :key="brand.id">{{ brand.name }}</v-chip>
      </v-chip-group>

      <span class="info-title">Regions:</span>
      <v-chip-group column active-class="primary--text">
        <v-chip v-for="region in material.regions" :key="region">
          <v-avatar left>
            <v-img :src="require(`@/assets/icons/regions/${region}.svg`)"></v-img>
          </v-avatar>
          {{ region.toUpperCase() }}
        </v-chip>
      </v-chip-group>

      <span class="info-title">Indications:</span>
      <v-chip-group column active-class="primary--text">
        <v-chip
          v-for="indication in material.indications"
          :key="indication.id"
        >{{ indication.name }}</v-chip>
      </v-chip-group>

      <span class="info-title" v-if="material.subMaterials.length">Sub Materials:</span>
      <sub-material-list :subMats="material.subMaterials" />

      <span class="info-title" v-if="material.labelPaths.length">Label Paths:</span>
      <label-path-list :labelPaths="material.labelPaths" :isEdit="false" />

      <!-- <span class="info-title" v-if="material.references.length">References:</span>
      <reference-table :references="material.references" v-if="material.references.length" /> -->
    </v-card>

    <icons-map />
  </section>
</template>

<script>
import subMaterialList from "@/cmps/material/SubMaterialList";
import labelPathList from "@/cmps/material/details/LabelPathList";
import confirmDelete from "@/cmps/general/ConfirmDelete";
// import referenceTable from "@/cmps/common/ReferenceTable";
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
    // referenceTable,
    confirmDelete,
    iconsMap,
  },
};
</script>
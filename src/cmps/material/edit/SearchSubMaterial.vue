<template>
  <section class="search-sub-material">
    <div class="search-container" v-if="materials">
      <autocomplete :items="materials" @emitAutocomplete="addSubMaterial" searchName="Add Sub Material" />
    </div>

    <div class="list-chips">
      <v-chip-group column active-class="primary--text">
        <v-chip
          v-for="subMaterial in subMaterials"
          :key="subMaterial._id"
          close
          @click:close="removeSubMaterial(subMaterial._id)"
        >{{ subMaterial.name }}</v-chip>
      </v-chip-group>
    </div>
  </section>
</template>

<script>
import autocomplete from "@/cmps/Autocomplete";

export default {
  name: "SearchSubMaterial",
  props: {
    subMaterials: Array,
    materials: Array,
  },
  data() {
    return {
      filterBy: {
        q: "",
      },
    };
  },
  methods: {
    loadMaterials() {
      const filterBy = this.filterBy;
      this.$store.dispatch({ type: "loadMaterials", filterBy });
    },
    addSubMaterial(material) {
      if (!material) return
      const newMaterial = {
        _id: material._id,
        name: material.text,
      };
      this.$emit("addSubMaterial", newMaterial);
    },
    removeSubMaterial(itemId) {
      this.$emit("removeSubMaterial", 'subMaterials', itemId);
    },
  },
  components: {
    autocomplete,
  },
};
</script>
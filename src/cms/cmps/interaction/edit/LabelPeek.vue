<template>
  <section class="label-peek">
    <v-card v-if="label">
      <v-card-title class="label-peek-title primary headline">
        <h2>
          {{ label.name }}
          <span
            class="color-circle v-chip"
            :style="{ backgroundColor: label.color }"
          ></span>
          <v-card-subtitle class="label-peek-title-sub pa-0 pt-1">
            There are {{ materials.length }} materials related with this label.
            <span v-if="label.primaryMaterialIds.length">
              With {{ label.primaryMaterialIds.length }} primary material/s.
            </span>
          </v-card-subtitle>
        </h2>
        <v-icon
          dark
          right
          @click="$emit('close-label-dialog')"
          class="label-peek-title-closer"
        >
          mdi-window-close
        </v-icon>
      </v-card-title>
      <section class="label-peek-content">
        <v-chip-group column>
          <v-chip 
            v-for="material in materials" 
            :key="material._id"
            class="px-0"
            :class="{ warning: isPrimaryMaterial(material._id) }"
            >
            <v-btn 
                class="label-peek-content-link transparent" 
                elevation="0" 
                rounded
                @click="$emit('view-material', material)"
            >
                <v-avatar left size="16">
                <img
                    :src="require(`@/cms/assets/icons/${material.type}.svg`)"
                    :alt="material.type"
                />
                </v-avatar>
              {{ material.name }}
            </v-btn>
          </v-chip>
        </v-chip-group>
      </section>
    </v-card>
  </section>
</template>

<script>
export default {
  props: {
    labelId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      label: null,
      materials: [],
    };
  },
  methods: {
    isPrimaryMaterial(matId) {
      return this.label.primaryMaterialIds.includes(matId);
    },
    async getRelatedData() {
      const { labelId } = this;
      const criteria = {
        labelId,
        limit: 0,
      };
      const [label, materials] = await Promise.all([
        this.$store.dispatch({ type: 'loadLabel', labelId }),
        this.$store.dispatch({ type: 'getMaterials', criteria }),
      ]);
      this.label = label;
      this.materials = materials;
    },
  },
  created() {
    this.getRelatedData();
  },
};
</script>
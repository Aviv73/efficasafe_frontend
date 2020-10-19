<template>
  <section class="interaction-side-search">
    <div v-if="side.material || side.label" class="int-side-value">
      <span class="text-capitalize">{{ side.name }}:</span>
      <v-chip
        v-if="side.material"
        class="ma-2 side-container"
        close
        color="primary"
        label
        text-color="white"
        @click:close="removeSide"
      >
        <v-avatar left>
          <v-img
            class="side-type-img"
            :src="materialSideType"
            :alt="side.material.type"
          />
        </v-avatar>
        {{ side.material.name }}
      </v-chip>
      <v-chip
        v-if="side.label"
        class="ma-2 side-container"
        close
        color="primary"
        label
        text-color="white"
        @click:close="removeSide"
      >
        <v-avatar left>
          <v-img
            class="side-type-img"
            :src="labelSideSrc"
            :alt="side.label.src"
          />
        </v-avatar>
        {{ side.label.name }}
      </v-chip>
    </div>

    <div v-else class="select-side">
      <v-radio-group
        row
        class="int-side-radio"
        v-model="isSideMaterial"
        :mandatory="true"
      >
        <v-radio label="Material" :value="true"></v-radio>
        <v-radio label="Label" :value="false" v-if="showLabels"></v-radio>
      </v-radio-group>
      <div v-show="isSideMaterial">
        <autocomplete
          v-if="materials"
          :items="materials"
          @emitAutocomplete="emitSelect"
          :searchName="`Select material ${side.name}`"
        />
      </div>
      <div v-show="!isSideMaterial">
        <autocomplete
          v-if="labels"
          :items="labels"
          @emitAutocomplete="emitSelect"
          :searchName="`Select label ${side.name}`"
        />
      </div>
    </div>
  </section>
</template>

<script>
import autocomplete from '@/cmps/Autocomplete';

export default {
  props: {
    side: {
      type: Object,
      required: true  
    },
    showLabels: {
      type: Boolean,
      defualt: true
    }
  },
  data() {
    return {
      isSideMaterial: true,
    };
  },
  computed: {
    materials() {
      return this.$store.getters.materials;
    },
    labels() {
      return this.$store.getters.labels;
    },
    materialSideType() {
      return require(`@/assets/icons/${this.side.material.type}.svg`);
    },
    labelSideSrc() {
      return require(`@/assets/icons/${this.side.label.src}.svg`);
    },
  },
  methods: {
    async loadMaterials() {
      await this.$store.dispatch({ type: 'loadMaterials' });
    },
    async loadLabels() {
      await this.$store.dispatch({ type: 'loadLabels' });
    },
    emitSelect(selection) {
      const isMaterial = this.isSideMaterial;
      const payload = {
        isMaterial,
        item: {
          _id: selection._id,
          name: selection.text,
        },
      };
      if (selection.type) payload.item.type = selection.type;
      if (selection.src) payload.item.src = selection.src;
      this.$emit('side-selected', JSON.parse(JSON.stringify(payload)));
    },
    removeSide() {
      this.$emit('remove-side');
    },
    updateSidesType() {
      if (this.side.label) {
        this.isSideMaterial = false;
      } else return;
    },
  },
  created() {
    this.loadMaterials();
    this.loadLabels();
  },
  components: {
    autocomplete,
  },
};
</script>

<style>
</style>
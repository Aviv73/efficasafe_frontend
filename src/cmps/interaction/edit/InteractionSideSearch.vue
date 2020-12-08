<template>
  <section class="interaction-side-search">
    <div v-if="side.material || side.label" class="int-side-value">
      <span>Side 1:</span>
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
    </div>

    <div v-else class="select-side">
      <div>
        <autocomplete 
          @emitAutocomplete="emitSelect"
          :placeholder="`Select material ${side.name}`"
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
  computed: {
    materials() {
      return this.$store.getters.materials;
    },
    materialSideType() {
      return require(`@/assets/icons/${this.side.material.type}.svg`);
    }
  },
  methods: {
    async loadMaterials() {
      await this.$store.dispatch({ type: 'loadMaterials' });
    },
    emitSelect(selection) {
      let payload = (selection) ? {} : null;
      if (selection) {
        payload = {
          _id: selection._id,
          name: selection.text
        }
        if (selection.type) payload.type = selection.type;
        if (selection.src) payload.src = selection.src;
      }

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
  },
  components: {
    autocomplete
  },
};
</script>

<style>
</style>
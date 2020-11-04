<template>
  <section class="interaction-sides">
    <div class="interaction-side">
      <interaction-side-search
        :side="sides.side1"
        :showLabels="false"
        @side-selected="updateSide($event)"
        @remove-side="removeSide(1)"
      />
    </div>
    <div class="interaction-side side-picker">
      <span class="text-capitalize" v-if="side2">{{ sides.side2.name }}:</span>
      <v-chip
        v-if="side2"
        class="ma-2 side-container"
        close
        color="primary"
        label
        text-color="white"
        @click:close="removeSide(2)"
      >
        <v-avatar left>
          <v-img
            class="side-type-img"
            :src="materialSideType"
            :alt="side2.type"
          />
        </v-avatar>
        {{ side2.name }}
      </v-chip>
      <v-btn 
        v-else
        class="submit-btn" 
        color="primary"
        @click="isDialogActive = true"
      >Pick Side 2</v-btn>
      <v-dialog v-model="isDialogActive" persistent max-width="1400">
        <side-picker 
          @close-dialog="isDialogActive = false"
          @side2-picked="$emit('side2-picked', $event)"
          ></side-picker>
      </v-dialog>
    </div>
  </section>
</template>

<script>
import interactionSideSearch from '@/cmps/interaction/edit/InteractionSideSearch';
import sidePicker from '@/cmps/interaction/edit/SidePicker';

export default {
  name: 'InteractionSides',
  props: {
    sides: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isDialogActive: false
    }
  },
  computed: {
    side2() {
      return this.sides.side2.material || this.sides.side2.label;
    },
    materialSideType() {
      if (this.sides.side2.material) {
        return require(`@/assets/icons/${this.side2.type}.svg`);
      }
      return require(`@/assets/icons/custom.svg`);
    }
  },
  methods: {
    updateSide(payload) {
      this.$emit('update-side', payload);
    },
    removeSide(side) {
      this.$emit('remove-side', side);
    }
  },
  components: {
    interactionSideSearch,
    sidePicker
  }
};
</script>
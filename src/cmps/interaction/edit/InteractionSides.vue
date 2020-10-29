<template>
  <section class="interaction-sides">
    <div class="interaction-side">
      <interaction-side-search
        :side="sides.side1"
        :showLabels="false"
        @side-selected="updateSide($event)"
        @remove-side="removeSide()"
      />
    </div>
    <div class="interaction-side side-picker">
      <v-btn 
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
  methods: {
    updateSide(payload) {
      this.$emit('update-side', payload);
    },
    removeSide() {
      this.$emit('remove-side');
    }
  },
  components: {
    interactionSideSearch,
    sidePicker
  }
};
</script>
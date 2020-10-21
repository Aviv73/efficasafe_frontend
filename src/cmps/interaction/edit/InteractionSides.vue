<template>
  <section class="interaction-sides">
    <div class="interaction-side">
      <interaction-side-search
        :side="sides.side1"
        :showLabels="false"
        @side-selected="updateSide($event, 1)"
        @remove-side="removeSide(1)"
      />
    </div>
    <div class="interaction-side side-picker">
      <v-btn 
        class="submit-btn" 
        color="primary"
        @click="isDialogActive = true"
      >Pick Side 2</v-btn>
      <v-dialog v-model="isDialogActive" persistent max-width="100%">
        <side-picker @close-dialog="isDialogActive = false"></side-picker>
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
    updateSide(payload, side) {
      payload.side = side;
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
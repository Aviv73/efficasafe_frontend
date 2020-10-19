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
    <div class="interaction-side">
      <interaction-side-search
        :side="sides.side2"
        @side-selected="updateSide($event, 2)"
        @remove-side="removeSide(2)"
      />
    </div>
  </section>
</template>

<script>
import interactionSideSearch from '@/cmps/interaction/edit/InteractionSideSearch';

export default {
  name: 'InteractionSides',
  props: {
    sides: {
      type: Object,
      required: true
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
    interactionSideSearch
  }
};
</script>
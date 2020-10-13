<template>
  <section class="interaction-sides">
    <div class="interaction-side">
      <interaction-side-search
        :side="sides.side1"
        @sideSelected="updateSide1"
        @removeSide="removeSide1"
      />
    </div>
    <div class="interaction-side">
      <interaction-side-search
        :side="sides.side2"
        @sideSelected="updateSide2"
        @removeSide="removeSide2"
      />
    </div>
  </section>
</template>

<script>
import interactionSideSearch from "@/cmps/interaction/edit/InteractionSideSearch";

export default {
  name: "InteractionSides",
  props: {
    sides: Object,
  },
  methods: {
    updateSide1(payload) {
      this.$emit("updateSide1", payload);
    },
    updateSide2(payload) {
      this.$emit("updateSide2", payload);
    },
    removeSide1() {
      this.$emit("removeSide1");
    },
    removeSide2() {
      this.$emit("removeSide2");
    },
  },
  components: {
    interactionSideSearch,
  },
};
</script>
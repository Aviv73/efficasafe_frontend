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
      <span class="mr-2">Side 2:</span>
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
          icon
          title="View label's materials"
          v-if="isLabelEdit"
          @click="$emit('show-label')"
        >
          <v-icon color="primary">mdi-eye</v-icon>
        </v-btn>
      <v-btn 
        class="submit-btn" 
        color="primary"
        @click="isDialogActive = true"
        v-if="!isLabelEdit"
      >
        Pick Side 2
      </v-btn>
      <router-link :to="`/label/edit/${side2LabelId}`" v-if="isLabelEdit" title="Edit Label">
        <v-icon color="primary">mdi-pencil</v-icon>
      </router-link>
      <v-dialog 
        v-model="isDialogActive" 
        persistent 
        max-width="1400" 
      >
        <side-picker 
          @close-dialog="isDialogActive = false"
          @side2-picked="$emit('side2-picked', $event)"
          :side2MaterialId="side2MaterialId"
          :isLabelImport="true"
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
    },
    editedInteraction: {
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
    side2MaterialId() {
      if (!this.editedInteraction.side2Material) return '';
      return this.editedInteraction.side2Material._id;
    },
    side2LabelId() {
      return this.editedInteraction.side2Label && this.editedInteraction.side2Label._id;
    },
    isLabelEdit() {
      return !!this.editedInteraction._id && !!this.side2LabelId;
    },
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
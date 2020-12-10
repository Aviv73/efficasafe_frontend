<template>
  <section v-if="alertOn" class="alert-messages">
    <v-alert
      class="alert-msg"
      :type="(isError) ? 'error' : 'success'"
      :value="alertOn"
      @click:close="alertOn = false"
      dismissible
      close-icon="mdi-close"
      dense
    >
      {{ (isError) ? `Unable to save ${type}` : `${type} ${name} Saved` }}
    </v-alert>
  </section>
</template>

<script>
import {
  eventBus,
  EV_addMaterial,
  EV_addLabel,
  EV_addInteraction,
  EV_edit_interaction_failed
} from "@/services/eventBus.service";

export default {
  data() {
    return {
      alertOn: false,
      name: "",
      type: "",
      isError: false
    };
  },
  methods: {
    displayMessage(payload) {
      if (payload.name) {
        this.name = payload.name;
      }
      this.isError = payload.isError || false;
      this.type = payload.type;
      this.alertOn = true;

      setTimeout(() => {
        this.alertOn = false;
        this.name = "";
        this.type = "";
      }, 3500);
    },
  },
  created() {
    eventBus.$on(EV_addMaterial, this.displayMessage);
    eventBus.$on(EV_addLabel, this.displayMessage);
    eventBus.$on(EV_addInteraction, this.displayMessage);
    eventBus.$on(EV_edit_interaction_failed, this.displayMessage);
  },
};
</script>
<template>
  <section v-if="alertOn" class="alert-messages">
    <v-alert
      class="alert-msg"
      type="success"
      :value="alertOn"
      @click:close="alertOn = false"
      dismissible
      close-icon="mdi-close"
      dense
    >{{type}} {{name}} Saved</v-alert>
  </section>
</template>

<script>
import {
  eventBus,
  EV_addMaterial,
  EV_addLabel,
  EV_addInteraction,
} from "@/services/eventBus.service";

export default {
  data() {
    return {
      alertOn: false,
      name: "",
      type: "",
    };
  },
  methods: {
    displayMessage(payload) {
      this.alertOn = true;
      if (payload.name) this.name = payload.name;
      this.type = payload.type;

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
  },
};
</script>
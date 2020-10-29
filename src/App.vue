<template>
  <v-app>
    <nav-bar />
    <v-main class="app-main-container">
      <app-messages />
      <router-view class="app-main-view" />
    </v-main>
  </v-app>
</template>

<script>
import navBar from "./cmps/NavBar";
import appMessages from "@/cmps/general/AppMessages";

export default {
  name: "App",
  components: {
    navBar,
    appMessages,
  },
  methods: {
    loadLabels() {
      const filterBy = { src: 'atc' };
      this.$store.dispatch({ type: 'loadLabels', filterBy });
    }
  },
  created() {
    this.loadLabels();
  }
};
</script>

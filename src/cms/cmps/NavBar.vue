<template>
  <section class="nav-bar">
    <v-app-bar class="nav-app" color="info" app dark>
      <v-btn class="nav-link" text tile to="/">
        <div class="logo-container">
          <span color="white">Efficasafe</span>
          <img alt="Avatar" :src="require(`@/cms/assets/icons/herb.svg`)" />
        </div>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn class="nav-link" tile color="white" text to="/search"
        >Search-Engine</v-btn
      >
      <v-btn class="nav-link" tile color="white" text to="/data-integrity"
        >Alerts</v-btn
      >
      <v-btn class="nav-link" tile color="white" text to="/material"
        >Materials</v-btn
      >
      <v-btn class="nav-link" tile color="white" text to="/label">Labels</v-btn>
      <v-btn class="nav-link" tile color="white" text to="/featured-interaction"
        >Workshop</v-btn
      >
      <v-btn class="nav-link" tile color="white" text to="/interaction"
        >Interactions</v-btn
      >
      <v-btn
        class="nav-link"
        tile
        color="white"
        text
        to="/archive"
        v-if="isAdmin"
        >Archive</v-btn
      >
      <v-btn class="nav-link" tile color="white" text to="/user" v-if="isAdmin"
        >Users</v-btn
      >
      <v-btn
        class="nav-link"
        tile
        color="white"
        text
        v-if="loggedInUser"
        @click="logout"
      >
        <v-icon left>mdi-logout</v-icon>Logout
      </v-btn>
    </v-app-bar>
  </section>
</template>

<script>
export default {
  name: "NavBar",
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
    isAdmin() {
      return this.loggedInUser ? this.loggedInUser.role === "admin" : false;
    },
  },
  methods: {
    logout() {
      try {
        console.log("try logout");
        this.$store.commit({ type: "logout" });
        this.$router.push("/");
      } catch {
        console.log("Try again");
      }
    },
  },
};
</script>
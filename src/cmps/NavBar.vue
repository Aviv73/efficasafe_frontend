<template>
  <section class="nav-bar">
    <v-app-bar class="nav-app" color="info" app dark>
      <v-btn class="nav-link" text tile to="/">
        <div class="logo-container">
          <span color="white">Efficasafe</span>
          <img alt="Avatar" :src="require(`@/assets/icons/herb.svg`)" />
        </div>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn class="nav-link" tile color="white" text to="/data-integrity">Alerts</v-btn>
      <v-btn class="nav-link" tile color="white" text to="/material">Materials</v-btn>
      <v-btn class="nav-link" tile color="white" text to="/label">Labels</v-btn>
      <v-btn class="nav-link" tile color="white" text to="/interaction">Interactions</v-btn>
      <v-btn class="nav-link" tile color="white" text to="/archive" v-if="isAdmin">Archive</v-btn>
      <v-btn class="nav-link" tile color="white" text v-if="loggedInUser" @click="logout">
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
      return (this.loggedInUser) ? this.loggedInUser.role === 'admin' : false;
    }
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch({ type: "logout" });
        this.$router.push("/login");
      } catch {
        console.log("Try again");
      }
    },
  },
};
</script>
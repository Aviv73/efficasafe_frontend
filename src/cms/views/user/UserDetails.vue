<template>
  <div>
    <div class="action-container" style="display: flex">
      <v-btn color="primary" @click="$router.go(-1)">
        <v-icon small left>mdi-arrow-left</v-icon>Back
      </v-btn>
      <v-spacer></v-spacer>

      <v-btn color="primary" :to="`/user/edit/123`">
        <v-icon small left>mdi-pencil</v-icon>Edit
      </v-btn>
      <v-btn color="error">
        <v-icon small left>mdi-delete</v-icon>Delete
      </v-btn>
    </div>
    <div class="info-container" v-if="user">
      <p>{{ user.name }}</p>
      <p>{{ user.role }}</p>
      <p>{{ user.email }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      isNotFound: false,
    };
  },
  watch: {
    "$route.params.id": function () {
      this.loadUser();
    },
  },
  methods: {
    async loadUser() {
      const userId = this.$route.params.id;
      if (userId) {
        const user = await this.$store.dispatch({ type: "loadUser", userId });
        if (user) this.user = user;
        else this.isNotFound = true;
      }
    },
  },
  created() {
    this.loadUser();
  },
};
</script>
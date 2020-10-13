<template>
  <v-card width="400">
    <v-card-title>Login</v-card-title>
    <v-card-text>
      <v-form v-model="valid" @submit.prevent="login(credentials)">
        <v-text-field
          label="Username*"
          type="text"
          v-model="credentials.username"
          prepend-icon="mdi-account-circle"
          required
          :rules="[v => !!v || 'Username is required']"
        />
        <v-text-field
          label="Password*"
          :type="showPassword ? 'text' : 'password' "
          v-model="credentials.password"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off' "
          required
          :rules="[v => !!v || 'Password is required']"
          @click:append="showPassword = !showPassword"
        />
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="info" :disabled="!valid" @click="login(credentials)">Login</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      credentials: {
        username: "",
        password: "",
      },
      valid: true,
      showPassword: false,
    };
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
  },
  methods: {
    async login(credentials) {
      try {
        const result = await this.$store.dispatch({
          type: "login",
          credentials,
        });
        if (result) this.$router.push("/");
      } catch {
        console.log("Try again");
      }
    },
  },
};
</script>
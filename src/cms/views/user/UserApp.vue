<template>
  <section class="user-page">
    <div class="container">
      <v-card v-if="users" class="mb-10">
        <v-card-title>
          Users collection
          <v-spacer></v-spacer>
        </v-card-title>
        <user-filter @emit-filter="setFilter" />
        <user-list
          :users="users"
          :loading="isLoading"
          @header-clicked="setFilter"
        />
      </v-card>
      <icons-map />
    </div>
  </section>
</template>

<script>
import iconsMap from "@/cms/cmps/general/IconsMap";
import UserList from "../../cmps/user/UserList";
import UserFilter from "../../cmps/user/UserFilter.vue";
export default {
  data() {
    return {
      isLoading: false,
    };
  },
  watch: {
    "$route.query": {
      handler() {
        this.loadUsers();
      },
      immediate: true,
    },
  },
  computed: {
    users() {
      return this.$store.getters.users;
    },
  },
  methods: {
    async loadUsers() {
      this.isLoading = true;
      const filterBy = this.$route.query;
      await this.$store.dispatch({ type: "loadUsers", filterBy });
      this.isLoading = false;
    },
    setFilter(filterBy) {
      const criteria = {
        ...this.$route.query,
        ...filterBy,
      };
      const queryStr = "?" + new URLSearchParams(criteria).toString();
      this.$router.push(queryStr);
    },
  },
  components: {
    iconsMap,
    UserList,
    UserFilter,
  },
};
</script>

<style>
</style>
<template>
  <section class="container">
    <v-card class="home-page">
      <v-card-title>Efficasafe Management System</v-card-title>
      <v-card-subtitle v-if="loggedInUser">
        Welcome back,
        <span class="text-capitalize">{{ loggedInUser.username }}!</span>
      </v-card-subtitle>
      <v-divider></v-divider>
      <v-card-text>Browse Modules:</v-card-text>
      <v-card-actions>
        <v-chip-group column active-class="primary--text">
          <v-chip
            color="info"
            drak
            label
            v-for="module in modules"
            :key="module.name"
            :to="module.path"
          >
            <v-avatar left>
              <v-icon small>{{ module.icon }}</v-icon>
            </v-avatar>
            {{ module.name }}
          </v-chip>
        </v-chip-group>
      </v-card-actions>
    </v-card>
    <icons-map />
  </section>
</template>

<script>
import iconsMap from '@/cms/cmps/general/IconsMap';

export default {
  name: 'Home',
  data() {
    return {
      modules: [
        {
          name: 'Material',
          path: '/material',
          icon: 'mdi-rhombus-split',
        },
        {
          name: 'Label',
          path: '/label',
          icon: 'mdi-rhombus-split',
        },
        {
          name: 'Interaction',
          path: '/interaction',
          icon: 'mdi-rhombus-split',
        },
        {
          name: 'Archive',
          path: '/archive',
          icon: 'mdi-archive',
        },
      ],
    };
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
  },
  components: {
    iconsMap,
  }
};
</script>

<template>
  <v-card class="side-picker">
    <v-card-title
      class="primary headline"
      style="color: white; font-weight: bold"
    >
      <v-icon dark left>mdi-plus-box-multiple</v-icon>
      Add Side 2
      <v-spacer></v-spacer>
      <v-icon dark right @click="$emit('close-dialog')"
        >mdi-window-close</v-icon
      >
    </v-card-title>
    <v-tabs dark background-color="primary" fixed-tabs>
      <v-tab @click="handleNavigation('atc')">ATC Tree</v-tab>
      <v-tab @click="handleNavigation('materials')">Materials</v-tab>
    </v-tabs>
    <section class="content">
      <material-tree-view v-show="activeTab === 'atc'"></material-tree-view>
      <section v-show="activeTab === 'materials'">
        <v-sheet class="pa-4 primary lighten-2 auto-complete-container" dark>
          <auto-complete
            :items="materials"
            searchName="Search Material..."
            :isSoloInverted="true"
            :isFlat="true"
          />
        </v-sheet>
        <v-card class="material-list mx-auto" flat tile>
          <v-list flat>
            <v-list-item-group color="primary">
              <v-list-item v-for="material in materials" :key="material._id" class="material-list-item">
                <v-list-item-icon>
                  <img
                    :src="require(`@/assets/icons/${material.type}.svg`)"
                    :alt="material.type"
                  />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="material.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
        <v-divider></v-divider>
      </section>
    </section>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="normal">Cancel</v-btn>
      <v-btn color="primary">Add Side</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import materialTreeView from '@/cmps/common/MaterialTreeView';
import autoComplete from '@/cmps/Autocomplete';

export default {
  data() {
    return {
      activeTab: 'atc'
    };
  },
  computed: {
    materials() {
      return this.$store.getters.materials;
    },
  },
  methods: {
    handleNavigation(activeTab) {
      this.activeTab = activeTab;
    },
  },
  components: {
    materialTreeView,
    autoComplete,
  },
};
</script>
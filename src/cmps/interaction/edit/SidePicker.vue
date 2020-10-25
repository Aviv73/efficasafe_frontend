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
      <material-tree-view 
        v-show="activeTab === 'atc'"
        @branches-selected="toggleSelection"
        ></material-tree-view>
      <section v-show="activeTab === 'materials'">
        <v-sheet class="pa-4 primary lighten-2" dark>
          <v-text-field label="Search Material..." 
            filled 
            append-icon="mdi-magnify"
            v-debounce="filterMaterials"
            dark
            flat
            solo-inverted
            hide-details
            clearable></v-text-field>
        </v-sheet>
        <v-card class="material-list mx-auto" flat tile>
          <v-list flat>
            <v-list-item-group color="primary">
              <v-list-item
                color="rgba(0, 0, 0, 0.87)"
                v-for="material in materials"
                :key="material._id"
                @click="toggleFromSelection(material)"
                class="material-list-item"
                :class="{'blue lighten-4': isInSelection(material._id)}"
              >
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

export default {
  data() {
    return {
      activeTab: 'atc',
      search: '',
      selection: []
    };
  },
  computed: {
    materials() {
      return this.$store.getters.materials.filter(mat => mat.name.toLowerCase().includes(this.search.toLowerCase()));
    }
  },
  methods: {
    handleNavigation(activeTab) {
      this.activeTab = activeTab;
    },
    filterMaterials(val) {
        this.search = val;
    },
    toggleFromSelection(material) {
        const idx = this.selection.findIndex(selectedItem => selectedItem._id === material._id);
        if (idx < 0) this.selection.push(material);
        else this.selection.splice(idx, 1);

        console.log('Final', this.selection);
    },
    isInSelection(materialId) {
        return this.selection.find(selectedItem => selectedItem._id === materialId);
    },
    toggleSelection(selection) {
      this.selection = selection;
      console.log('Final', selection);
    }
  },
  components: {
    materialTreeView
  },
};
</script>
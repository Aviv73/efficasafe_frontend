<template>
  <v-card class="side-picker">
    <v-card-title
      class="primary headline"
      style="color: white; font-weight: bold"
    >
      <v-icon dark left>mdi-plus-box-multiple</v-icon>
      Add Side 2
      <v-spacer></v-spacer>
      <span class="text-caption"
        >{{ atcSelection.length + materialSelection.length }} Materials are
        picked.</span
      >
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
        @branches-selected="setSelection"
      ></material-tree-view>
      
      <section v-show="activeTab === 'materials'">
        <v-sheet class="pa-4 primary lighten-2" dark>
          <v-text-field
            class="material-search"
            label="Search Material..."
            filled
            append-icon="mdi-magnify"
            v-debounce="filterMaterials"
            dark
            flat
            solo-inverted
            hide-details
            clearable
          ></v-text-field>
        </v-sheet>
        <v-card class="material-list mx-auto" flat tile>
          <v-list flat>
            <v-list-item-group
              color="primary"
              class="infinite-wrapper"
              infinite-wrapper
            >
              <v-list-item
                color="rgba(0, 0, 0, 0.87)"
                v-for="material in materials"
                :key="material._id"
                @click="toggleFromSelection(material)"
                class="material-list-item"
                :class="{ 'blue lighten-4': isInSelection(material._id) }"
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
              <infinite-loading
                @infinite="infiScrollHandler"
                force-use-infinite-wrapper=".infinite-wrapper"
              ></infinite-loading>
            </v-list-item-group>
          </v-list>
        </v-card>
        <v-divider></v-divider>
      </section>
    </section>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="normal" @click="cancelSelection">Cancel</v-btn>
      <v-btn 
        color="primary" 
        @click="emitInteractionSides"
        :disabled="atcSelection.length + materialSelection.length === 0"
        >Add Side</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import materialTreeView from '@/cmps/common/MaterialTreeView';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  currPage: 0,
  data() {
    return {
      activeTab: 'atc',
      search: '',
      atcSelection: [],
      materialSelection: [],
    };
  },
  computed: {
    materials() {
      return this.$store.getters.materials;
    },
  },
  methods: {
    async infiScrollHandler($state) {
      this.$options.currPage++;
      await this.loadMaterials();

      if (this.materials.length < 20) $state.complete();
      else {
        setTimeout(() => {
          $state.loaded();
        }, 100);
      }
    },
    async loadMaterials() {
      const currPage = this.search ? 0 : this.$options.currPage;
      const criteria = {
        page: currPage,
        q: this.search,
      };

      await this.$store.dispatch({ type: 'loadMaterials', criteria });
    },
    handleNavigation(activeTab) {
      this.activeTab = activeTab;
    },
    filterMaterials(val) {
      this.search = val;
      this.loadMaterials();
    },
    toggleFromSelection(material) {
      const idx = this.materialSelection.findIndex(
        (selectedItem) => selectedItem._id === material._id
      );
      if (idx < 0) this.materialSelection.push(material);
      else this.materialSelection.splice(idx, 1);
    },
    isInSelection(materialId) {
      return this.materialSelection.find(
        (selectedItem) => selectedItem._id === materialId
      );
    },
    setSelection(atcSelection) {
      this.atcSelection = atcSelection.filter((atcNode) => atcNode._id);
    },
    cancelSelection() {
      this.atcSelection = [];
      this.$emit('close-dialog');
    },
    emitInteractionSides() {
      const interactionSides = [
        ...this.atcSelection,
        ...this.materialSelection,
      ];
      interactionSides.forEach(mat => {
        delete mat.parentId;
      });
      this.$emit('side2-picked', interactionSides);
      this.$emit('close-dialog');
    },
  },
  components: {
    materialTreeView,
    InfiniteLoading
  },
};
</script>
<template>
  <v-card class="side-picker">
    <v-card-title
      class="side-picker-title primary headline"
      style="color: white; font-weight: bold"
    >
      <v-icon dark left>mdi-plus-box-multiple</v-icon>
      Add Side 2
      
      <autocomplete 
        v-if="isLabelImport"
        class="ml-8 side-picker-autocomplete"
        placeholder="Import label"
        @emitAutocomplete="importSuperLabel"
        :isLabel="true"
        :isDark="true"
        :isSoloInverted="true"
        :isSuperLabelImport="true"
      />

      <span class="text-caption ml-8">
        {{ selection.length }} Materials are picked.
        <span v-if="primaryMaterialIds.length">
          Has primary material/s.
        </span>
      </span>

      <v-spacer></v-spacer>
      <v-icon dark right @click="$emit('close-dialog')">
        mdi-window-close
      </v-icon>
    </v-card-title>
    <v-tabs dark background-color="primary" fixed-tabs>
      <v-tab @click="handleNavigation('atc')">ATC Tree</v-tab>
      <v-tab @click="handleNavigation('materials')">Materials</v-tab>
    </v-tabs>
    <section class="content">
      <material-tree-view
        v-show="activeTab === 'atc'"
        @branches-selected="setSelection"
        :selection="selection"
        :primaryMaterialIds="primaryMaterialIds"
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
                @contextmenu.prevent="setPrimaryMaterial([material._id])"
                class="material-list-item"
                :class="{ 'blue lighten-4': isInSelection(material._id) }"
              >
                <v-list-item-icon>
                  <img
                    :src="require(`@/cms/assets/icons/${material.type}.svg`)"
                    :alt="material.type"
                  />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ material.name }}
                    <v-icon 
                      class="material-list-item-primary-icon" 
                      v-if="isPrimaryMaterial(material._id)"
                      >mdi-shield-star</v-icon>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <div class="loader-container">
                <Loader class="loader" v-if="isLoadingChunk"/>
                <p class="loader" v-else>No more materials...</p>
              </div>
              <!-- <infinite-loading
                @infinite="infiScrollHandler"
                force-use-infinite-wrapper=".infinite-wrapper"
              ></infinite-loading> -->
            </v-list-item-group>
          </v-list>
        </v-card>
        <v-divider></v-divider>
      </section>
    </section>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="normal" @click="closePicker">Cancel</v-btn>
      <v-btn 
        color="primary" 
        @click="emitInteractionSides"
        :disabled="selection.length === 0"
        >Add Side</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { eventBus, EV_material_unselected, EV_cleanSelection, EV_primary_material_changed, EV_refresh_root_tree_view } from '@/cms/services/eventBus.service';
import materialTreeView from '@/cms/cmps/common/MaterialTreeView';
import autocomplete from '@/cms/cmps/Autocomplete';
// import InfiniteLoading from 'vue-infinite-loading';
import Loader from '@/client/cmps/common/icons/Loader.vue';



export default {
  currPage: 0,
  props: {
    side2MaterialId: {
      type: String,
      required: false
    },
    relatedMaterials: {
      type: Array,
      required: false
    },
    labelPrimaryMaterialIds: {
      type: Array,
      required: false
    },
    isLabelImport: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeTab: 'atc',
      search: '',
      atcSelection: [],
      materialSelection: [],
      sortBy: {
        sortBy: [ 'type', 'name' ],
        isDesc: [ true, false ]
      },
      primaryMaterialIds: [],
      // materialsToShow: [],
      isLoadingChunk: false,
      currPage: -1
    };
  },
  computed: {
    materials() {
      return this.$store.getters.materials;
    },
    selection() {
      const selection = this.atcSelection.slice();
      this.materialSelection.forEach(mat => {
        const idx = selection.findIndex(atcMat => atcMat._id === mat._id);
        if (idx === -1) selection.push(mat);
      });
      return selection;
    }
  },
  methods: {
    isPrimaryMaterial(matId) {
      return this.primaryMaterialIds.includes(matId);
    },
    async importSuperLabel(label) {
      const labelId = (label) ? label._id : null; 
      if (labelId) {
        const criteria = { labelId, limit: 0 };
        const [ materials, label ] = await Promise.all([
          this.$store.dispatch({ type: 'getMaterials', criteria }),
          this.$store.dispatch({ type: 'loadLabel', labelId })
        ]);
        this.primaryMaterialIds = [ ...new Set([ ...this.primaryMaterialIds, ...label.primaryMaterialIds ]) ];
        materials.forEach(material => {
          if (this.materialSelection.findIndex(currMaterial => currMaterial._id === material._id) === -1) {
            this.materialSelection.push(material);
          }
        });
        eventBus.$emit(EV_refresh_root_tree_view);
      }
    },
    async getMaterial(matId) {
      const material = await this.$store.dispatch({
        type: 'loadMaterial',
        matId
      });
      this.materialSelection.push(material);
      eventBus.$emit(EV_refresh_root_tree_view);
    },
    setPrimaryMaterial(matIds) {
      if (!this.selection.some(mat => matIds.includes(mat._id))) return;
      matIds.forEach(matId => {
        const idx = this.primaryMaterialIds.findIndex(id => id === matId);
        if (idx !== -1) {
          this.primaryMaterialIds.splice(idx, 1);
        } else this.primaryMaterialIds.push(matId);
      });
    },
    async infiScrollHandler($state) {
      this.$options.currPage++;
      const newMaterials = await this.loadMaterials(this.sortBy);
      this.materialsToShow.push(...newMaterials);
      if (newMaterials.length < 20) {
        $state.complete();
        this.restLoadChunk = $state.reset;
      }
      else {
        this.restLoadChunk = null;
        setTimeout(() => {
          $state.loaded();
        }, 100);
      }
    },
    async loadChunk() {
      // if (this.isLoadingChunk) return;
      this.isLoadingChunk = true;
      this.currPage++;
      const currSearch = this.search; // for case of change of async
      const oldMatireals = JSON.parse(JSON.stringify(this.materials));
      const newMaterials = await this.loadMaterials({...this.sortBy, page: this.currPage});
      let combinedMaterials = []
      if (currSearch !== this.search) {
        return;
        }
      combinedMaterials = [...oldMatireals, ...newMaterials];
      // else this.currPage = -1;
      this.$store.commit('setMaterials', { materials: combinedMaterials });
      this.$store.commit('setMaterialCount', { total: combinedMaterials.length });
      if (newMaterials.length < 20) {
        this.isLoadingChunk = false;
      } else if (this.activeTab === 'materials') setTimeout(() => this.loadChunk(), 2000);
    },
    async loadMaterials(sortBy = {}) {
      // const currPage = this.search ? 0 : this.$options.currPage;
      const currPage = this.$options.currPage;
      const criteria = {
        page: currPage,
        q: this.search,
        ...sortBy,
      };

      return await this.$store.dispatch({ type: 'loadMaterials', criteria });
    },
    handleNavigation(activeTab) {
      this.activeTab = activeTab;
      if (activeTab === 'materials') this.loadChunk();
    },
    filterMaterials(val) {
      this.search = val;

      // this.$options.currPage = 0;
      // this.materialsToShow = [];
      // this.restLoadChunk?.();
      // this.loadMaterials(this.sortBy);

      this.currPage = -1;
      this.$store.commit('setMaterials', { materials: [] });
      this.$store.commit('setMaterialCount', { total: 0 });


      this.loadChunk(this.sortBy);
    },
    toggleFromSelection(material) {
      const idx = this.selection.findIndex(
        (selectedItem) => selectedItem._id === material._id
      );
      if (idx === -1) this.materialSelection.push(material);
      else {
        const idx = this.primaryMaterialIds.findIndex(id => id === material._id);
        if (idx !== -1) {
          this.primaryMaterialIds.splice(idx, 1);
        }
        const matIdx = this.materialSelection.findIndex(mat => mat._id === material._id);
        if (matIdx >= 0) this.materialSelection.splice(matIdx, 1);

        const atcMatIdx = this.atcSelection.findIndex(atcMat => atcMat._id === material._id);
        if (atcMatIdx >= 0) this.atcSelection.splice(atcMatIdx, 1);
      }
    },
    isInSelection(materialId) {
      return this.selection.find(selectedItem => selectedItem._id === materialId);
    },
    setSelection(atcSelection) {
      this.atcSelection = atcSelection.filter((atcNode) => atcNode._id);
    },
    closePicker() {
      this.$emit('close-dialog');
    },
    emitInteractionSides() {
      const interactionSides = this.selection.slice();
      interactionSides.forEach(mat => {
        delete mat.parentId;
      });
      this.$emit('side2-picked', { materials: interactionSides, primaryMaterialIds: this.primaryMaterialIds });
      this.closePicker();
    }
  },
  created() {
    // this.loadMaterials(this.sortBy);
    eventBus.$on(EV_material_unselected, async ({ materialIds }) => {
      if (materialIds && materialIds.length) {
        const criteria = { materialId: materialIds };
        const materials = await this.$store.dispatch({ type: 'getMaterials', criteria });
        materials.forEach(material => {
          this.toggleFromSelection(material);
        });
      }
    });
    eventBus.$on(EV_cleanSelection, () => {
      this.materialSelection = [];
    });
    eventBus.$on(EV_primary_material_changed, this.setPrimaryMaterial);
    if (this.side2MaterialId) {
      this.getMaterial(this.side2MaterialId);
    }
    if (this.relatedMaterials && this.relatedMaterials.length) {
      for (let i = 0; i < this.relatedMaterials.length; i++) {
        this.materialSelection.push(this.relatedMaterials[i]);
      }
      if (this.labelPrimaryMaterialIds) this.primaryMaterialIds = [ ...this.labelPrimaryMaterialIds ];
    }
  },
  beforeDestroy() {
    eventBus.$off(EV_material_unselected);
    eventBus.$off(EV_primary_material_changed);
    eventBus.$off(EV_cleanSelection);
  },
  components: {
    materialTreeView,
    autocomplete,
    // InfiniteLoading,
    Loader
  },
  // watch: {
  //   search() {
  //     this.$options.currPage = -1;
  //     this.materialsToShow = [];
  //     this.restLoadChunk?.();
  //   }
  // }
};
</script>
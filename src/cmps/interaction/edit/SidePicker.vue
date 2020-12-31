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
                @contextmenu.prevent="setPrimaryMaterial(material._id)"
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
                  <v-list-item-title>
                    {{ material.name }}
                    <v-icon 
                      class="material-list-item-primary-icon" 
                      v-if="isPrimaryMaterial(material._id)"
                      >mdi-shield-star</v-icon>
                  </v-list-item-title>
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
import { eventBus, EV_material_unselected, EV_primary_material_changed, EV_refresh_root_tree_view } from '@/services/eventBus.service';
import materialTreeView from '@/cmps/common/MaterialTreeView';
import autocomplete from '@/cmps/Autocomplete';
import InfiniteLoading from 'vue-infinite-loading';

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
      default: false
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
      primaryMaterialIds: []
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
        this.primaryMaterialIds = [ ...label.primaryMaterialIds ];
        this.materialSelection = [ ...materials ];
      } else {
        this.materialSelection = [];
      }
      eventBus.$emit(EV_refresh_root_tree_view);
    },
    async getMaterial(matId) {
      const material = await this.$store.dispatch({
        type: 'loadMaterial',
        matId
      });
      this.materialSelection.push(material);
      eventBus.$emit(EV_refresh_root_tree_view);
    },
    setPrimaryMaterial(matId) {
      if (!this.selection.find(mat => mat._id === matId)) return;
      const idx = this.primaryMaterialIds.findIndex(id => id === matId);
      if (idx !== -1) {
        this.primaryMaterialIds.splice(idx, 1);
      } else this.primaryMaterialIds.push(matId);
    },
    async infiScrollHandler($state) {
      this.$options.currPage++;
      await this.loadMaterials(this.sortBy);

      if (this.materials.length < 20) $state.complete();
      else {
        setTimeout(() => {
          $state.loaded();
        }, 100);
      }
    },
    async loadMaterials(sortBy = {}) {
      const currPage = this.search ? 0 : this.$options.currPage;
      const criteria = {
        ...sortBy,
        page: currPage,
        q: this.search
      };

      await this.$store.dispatch({ type: 'loadMaterials', criteria });
    },
    handleNavigation(activeTab) {
      this.activeTab = activeTab;
    },
    filterMaterials(val) {
      this.search = val;
      this.loadMaterials(this.sortBy);
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
    this.loadMaterials(this.sortBy);
    eventBus.$on(EV_material_unselected, (mat) => {
      this.toggleFromSelection(mat);
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
  destroyed() {
    eventBus.$off(EV_material_unselected);
    eventBus.$off(EV_primary_material_changed);
  },
  components: {
    materialTreeView,
    autocomplete,
    InfiniteLoading
  }
};
</script>
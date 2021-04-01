<template>
  <section class="tree-view">
    <div class="btns">
      <v-btn 
        class="btn"
        elevation="0"
        outlined
        color="secondary lighten-1" 
        v-if="depth === 0" 
        @click="closeAllBranches"
      >Close All</v-btn>
      <v-btn 
        class="btn"
        elevation="0"
        outlined
        color="primary lighten-1" 
        v-if="depth === 0" 
        @click="handleViewAll"
      >View selected</v-btn>
      <v-btn 
        class="btn"
        elevation="0"
        outlined
        color="warning lighten-1" 
        v-if="depth === 0" 
        @click="cleanSelection"
      >Clear All</v-btn>
    </div>
    <ul>
      <li
        v-for="item in items"
        :key="item.id"
        :class="[ { leaf: (!item.children || !item.children.length) && depth > 2 },
          { childless: depth <= 2 && (!item.children || !item.children.length) },
          { 'no-material': item.materialIds && !item.materialIds.length }
        ]"
      >
        <span>
          <label v-if="item.children && item.children.length">
            <input
              hidden
              class="expandInput"
              :id="`expandInput_${item.id}`"
              :checked="isBranchOpen(item.id)"
              type="checkbox"
              :ref="`expandInput_${item.id}`"
              @input="toggleExpand($event.target.checked, item.id)"
            />
            <v-icon>mdi-play</v-icon>
          </label>
        </span>
        <span>
          <input
            type="checkbox"
            class="selection-input"
            v-show="item.children || item.materialIds"
            :key="checkboxRenderKey"
            :ref="`selectionInput_${item.id}`"
            :checked="isNodeChecked(item)"
            :disabled="depth < 2"
            @input="handleSelection($event.target.checked, item)"
          />
        </span>
        <span>
          <label :for="`expandInput_${item.id}`" @contextmenu.prevent="emitPrimaryMaterial(item)">
            <h6 v-html="labelTxt(item.name)"></h6>
             <v-icon 
              class="primary-icon"
              v-if="isPrimaryMaterial(item.materialIds)"
              >mdi-shield-star</v-icon>
          </label>
          <tree-view
            v-if="item.children && isBranchOpen(item.id)"
            :search="search"
            :ref="`branch_${item.id}`"
            :items="item.children"
            :parentId="item.id"
            :parentSelection="selection"
            :depth="childDepth"
            @item-selection="indeterminateBranch"
            @selection-changed="saveSelection($event)"
            :finalSelection="finalSelection"
            :primaryMaterialIds="primaryMaterialIds"
            :doExpandOnMount="isChildsExpand"
          />
        </span>
      </li>
    </ul>
  </section>
</template>

<script>
import { utilService } from '@/cms/services/util.service';
import { eventBus, EV_emptySelection, EV_set_tree_view_selection, 
  EV_cleanSelection, EV_material_unselected, EV_primary_material_changed,
  EV_refresh_root_tree_view } from '@/cms/services/eventBus.service';

export default {
  name: 'tree-view',
  props: {
    items: {
      type: Array,
      required: true,
    },
    parentId: {
      type: String,
      default: '',
    },
    parentSelection: {
      type: Array,
      default: () => [],
    },
    search: {
      type: String,
      default: '',
    },
    depth: {
      type: Number,
      required: true
    },
    finalSelection: {
      type: Array,
      required: true
    },
    primaryMaterialIds: {
      type: Array,
      required: true
    },
    doExpandOnMount: {
      type: Boolean,
      required: false
    }
  },
  branchIdsMap: {},
  data() {
    return {
      selection: this.parentSelection,
      childDepth: this.depth + 1,
      openBranches: [],
      checkboxRenderKey: 1,
      isChildsExpand: this.doExpandOnMount || false
    };
  },
  watch: {
    primaryMaterialIds: {
      handler() {
        this.checkOffspringSelected();
        this.refreshCmps();
      },
      immediate: true
    },
    finalSelection: {
      handler() {
        this.selection = this.finalSelection.reduce((acc, { _id }) => {
          const nodes = this.selection.filter(node => node.materialIds && node.materialIds.includes(_id));
          nodes.forEach(node => {
            const isNotDup = acc.findIndex(currNode => currNode.id === node.id) === -1;
            if (isNotDup) acc.push(node);
          });
          return acc;
        }, []);
        this.checkOffspringSelected();
        this.refreshCmps();
      },
      immediate: true
    },
    search() {
      if (this.search) {
        this.checkForExpand();
      } else {
        this.closeAllBranches();
      }
    }
  },
  computed: {
    labelTxt() {
      return (txt) => {
        if (!this.search) return txt;
        const regex = new RegExp(utilService.escapeStrRegex(this.search), 'i');
        return txt.replace(
          regex,
          `<span style="background-color: yellow">${this.search.toUpperCase()}</span>`
        );
      };
    }
  },
  methods: {
    handleViewAll() {
      this.expandToSelection();
      this.isChildsExpand = true;
      this.$nextTick(() => {
        this.isChildsExpand = false;
      });
    },
    expandToSelection() {
      const paths = [];
      const doExpand = (node) => {
        if (this.isNodeChecked(node)) {
          this.getNodePath(node, paths);
          for (let i = paths.length - 1; i >= 0; i--) {
            if (!this.openBranches.includes(paths[i])) {
              this.openBranches.push(paths[i]);
            }
          }
        }
      }
      this.items.forEach(item => {
        this.traverse(item, 0, doExpand);
      });
    },
    isPrimaryMaterial(matIds) {
      if (!matIds) return false;
      return this.primaryMaterialIds.some(id => matIds.includes(id));
    },
    refreshCmps() {
      this.checkboxRenderKey++;
    },
    emitPrimaryMaterial(node) {
      if (!node.materialIds) return;
      eventBus.$emit(EV_primary_material_changed, node.materialIds);
    },
    cleanSelection() {
      this.selection = [];
      eventBus.$emit(EV_cleanSelection);
      this.emitSelection();
    },
    closeAllBranches() {
      this.openBranches = [];
    },
    isBranchOpen(id) {
      return this.openBranches.includes(id);
    },
    checkForExpand() {
      this.closeAllBranches();
      const checkForExpand = (node) => {
        var foundPaths = [];
        if (node.name.toLowerCase().includes(this.search.toLowerCase())) {
          this.getNodePath(node, foundPaths);
          foundPaths.forEach(path => {
            if (!this.openBranches.includes(path)) {
              this.openBranches.push(path);
            }
          });
        } 
      }
      this.items.forEach(item => {
        this.traverse(item, 0, checkForExpand);
      });
    },
    getNodePath(node, paths) {
      if (node.id) {
        paths.push(node.id);
      } 
      if (node.parentId) {
        const parentNode = this.$options.branchIdsMap[node.parentId];
        if (parentNode) {
          this.getNodePath(parentNode, paths);
        }
      }
    },
    toggleExpand(isChecked, nodeId) {
      if (this.$refs[`expandInput_${nodeId}`]) this.$refs[`expandInput_${nodeId}`][0].checked = isChecked;
      if (isChecked) this.openBranches.push(nodeId);
      else {
        const idx = this.openBranches.findIndex(currId => currId === nodeId);
        this.openBranches.splice(idx, 1);
      }
    },
    checkForIndeterminate() {
      const isSelected = this.isItemSelected(this.items);
      if (this.parentId) this.$emit('item-selection', isSelected, this.parentId);
    },
    indeterminateBranch(isSelected, id) {
      if (!this.$refs[`selectionInput_${id}`]) return; 
      const node = this.items.find(item => item.id === id);
      if (!isSelected) {
        const isIndeterminate = this.isChildIndeterminate(node);
        isSelected = isIndeterminate;
      } 
      this.$refs[`selectionInput_${id}`][0].indeterminate = isSelected;
      this.$refs[`selectionInput_${id}`][0].checked = false;
      if (this.parentId) {
        this.$emit('item-selection', isSelected, this.parentId);
      }
    },
    isChildIndeterminate(node) {
      if (!node.children[0].children) return;
      return node.children.some(childNode => {
        const childInput = this.$refs[`branch_${node.id}`][0].$refs[`selectionInput_${childNode.id}`];
        if (!childInput) return false;
        return childInput[0].indeterminate || childInput[0].checked;
      });
    },
    isItemSelected(items) {
      return items.some((item) => {
        return this.finalSelection.find(material => item.materialIds && item.materialIds.includes(material._id));
      });
    },
    handleSelection(isChecked, node) {
      const addToSelection = (node) => {
        const isExists = this.selection.find(currNode => currNode.id === node.id);
        if (!isExists) this.selection.push(node);
      };
      const removeFromSelection = (node) => {
        const idx = this.selection.findIndex(
          (currNode) => currNode.id === node.id
        );
        if (idx !== -1) {
          this.selection.splice(idx, 1);
        } else {
          eventBus.$emit(EV_material_unselected, node);
        }
      };
      if (!node.materialIds) {
        const selectedOffsprings = [];
        const findSelected = (node) => {
          if (this.isNodeChecked(node)) {
            selectedOffsprings.push(node);
          }
        }
        this.traverse(node, this.depth, findSelected);
        isChecked = !selectedOffsprings.length;
      }
      const visitFunc = isChecked ? addToSelection : removeFromSelection;

      this.traverse(node, this.depth, visitFunc);
      this.emitSelection();
      this.checkForIndeterminate();
    },
    isNodeChecked(node) {
      if (!node.materialIds) return false;
      return !!this.finalSelection.find(material => node.materialIds.includes(material._id));
    },
    saveSelection(selection) {
      this.selection = selection;
      eventBus.$emit(EV_set_tree_view_selection, selection);
      this.emitSelection();
    },
    emitSelection() {
      this.$emit('selection-changed', this.selection);
    },
    unIndeterminateInput(id) {
      const elSelectionInputs = this.$refs[`selectionInput_${id}`];
      if (elSelectionInputs && elSelectionInputs.length) {
        elSelectionInputs[0].indeterminate = false;
        if (this.parentId) {
          eventBus.$emit(EV_emptySelection, this.parentId);
        }
      }
    },
    checkOffspringSelected() {
      const indeterminatePaths = (node) => {
        if (this.depth < 4 && this.isNodeChecked(node)) {
          if (this.primaryMaterialIds.some(_id => node.materialIds.includes(_id))) {
            var primaryPath = [];
            this.getNodePath(node, primaryPath);
            const primaryParent = this.items.find(currItem => primaryPath.includes(currItem.id));
            if (primaryParent) {
              this.$nextTick(() => {
                this.$refs[`selectionInput_${primaryParent.id}`][0].classList.add('primary-parent');
              });
            }
          }
          const path = [];
          this.getNodePath(node, path);
          const item = this.items.find(currItem => path.includes(currItem.id));
          this.$nextTick(() => {
            if (item) {
              this.$refs[`selectionInput_${item.id}`][0].indeterminate = true;
            }
          });
        }
      }
      this.items.forEach(item => {
        this.traverse(item, 0, indeterminatePaths);
      });
    },
    makeBranchIdsMap() {
      const { branchIdsMap } = this.$options;
      const visitFunc = (node) => {
        if (!branchIdsMap[node.id]) {
          branchIdsMap[node.id] = node;
        }
      }
      this.items.forEach(item => {
        this.traverse(item, 0, visitFunc);
      });
    },
    traverse(node, depth, visitFn) {
      visitFn(node, depth);
      if (node.children) {
        node.children.forEach((childNode) => {
          this.traverse(childNode, depth + 1, visitFn);
        });
      }
    }
  },
  created() {
    this.makeBranchIdsMap();
    eventBus.$on(EV_emptySelection, this.unIndeterminateInput);
    this.checkOffspringSelected();
    eventBus.$on(EV_refresh_root_tree_view, this.refreshCmps);
    eventBus.$on(EV_set_tree_view_selection, (selection) => {
      this.selection = selection;
    });
  },
  mounted() {
    if (this.doExpandOnMount) {
      this.expandToSelection();
    }
  },
  beforeDestroy() {
    eventBus.$off(EV_emptySelection);
    eventBus.$off(EV_refresh_root_tree_view);
  }
};
</script>

<style scoped lang="scss">
.btns {
  float: right;
  display: flex;
  flex-direction: column;

  .btn {
    display: block;
    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }
}
h6 {
  display: inline;
}
h6:hover {
  background-color: darken(white, 10%);
}
[type=checkbox]:indeterminate {
  outline: 2px solid #4CAF50;
}
.primary-parent {
  outline: 2px solid #FFA726 !important;
}
.primary-icon {
  color: #FFA726;
  margin-left: 12px;
  font-size: 18px;
  vertical-align: baseline;
}
.expandInput:checked + .v-icon {
  display: inline-block;
  transform: rotateZ(90deg);
}
.leaf {
  padding-left: 36px;
}
.childless {
  padding-left: 24px;
}
.no-material {
  opacity: .5;
}
.selection-input {
  margin: 0 6px;
}
</style>
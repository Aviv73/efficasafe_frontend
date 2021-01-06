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
        :key="item[itemKey]"
        :class="[ { leaf: (!item.children || !item.children.length) && depth > 2 },
                  { childless: depth <= 2 && (!item.children || !item.children.length) }
        ]"
      >
        <span>
          <label v-if="item.children && item.children.length">
            <input
              hidden
              class="expandInput"
              :id="`expandInput_${item[itemKey]}`"
              :checked="isBranchOpen(item[itemKey])"
              type="checkbox"
              :ref="`expandInput_${item[itemKey]}`"
              @input="toggleExpand($event.target.checked, item[itemKey])"
            />
            <v-icon>mdi-play</v-icon>
          </label>
        </span>
        <span>
          <input
            :key="checkboxRenderKey"
            type="checkbox"
            :ref="`selectionInput_${item[itemKey]}`"
            :checked="isChecked(item)"
            :disabled="depth < 2"
            v-if="((item.children && item.children.length) || item._id)"
            @input="handleSelection($event.target.checked, item)"
          />
        </span>
        <span>
          <label :for="`expandInput_${item[itemKey]}`" @contextmenu.prevent="emitPrimaryMaterial(item)">
            <h6 class="atc-id">{{ item.atcId }}</h6>
            <h6 v-html="labelTxt(item[renderTxt])"></h6>
             <v-icon 
              class="primary-icon"
              v-if="isPrimaryMaterial(item._id)"
              >mdi-shield-star</v-icon>
          </label>
          <tree-view
            v-if="item[children] && isBranchOpen(item[itemKey])"
            :search="search"
            :ref="`branch_${item[itemKey]}`"
            :items="item[children]"
            :itemKey="itemKey"
            :renderTxt="renderTxt"
            :children="children"
            :parentId="item[itemKey]"
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
import { utilService } from '@/services/util.service';
import { eventBus, EV_emptySelection, EV_material_unselected, EV_primary_material_changed, EV_refresh_root_tree_view } from '@/services/eventBus.service';

export default {
  name: 'tree-view',
  props: {
    items: {
      type: Array,
      required: true,
    },
    itemKey: {
      type: String,
      default: 'id',
    },
    renderTxt: {
      type: String,
      default: 'name',
    },
    children: {
      type: String,
      default: 'children',
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
        this.selection = [ ...this.finalSelection ];
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
        if (this.isChecked(node)) {
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
    isPrimaryMaterial(matId) {
      return this.primaryMaterialIds.includes(matId);
    },
    refreshCmps() {
      this.checkboxRenderKey++;
    },
    emitPrimaryMaterial(mat) {
      if (!mat._id) return;
      eventBus.$emit(EV_primary_material_changed, mat._id);
    },
    cleanSelection() {
      const removeAllFromSelection = (node) => {
        const itemKey = (node._id) ? '_id' : 'id';
        if (this.selection.find((currItem) => currItem[itemKey] === node[itemKey])) {
          const idx = this.selection.findIndex((currItem) => currItem[itemKey] === node[itemKey]);
          this.selection.splice(idx, 1);
          eventBus.$emit(EV_emptySelection, node.parentId);
          eventBus.$emit(EV_material_unselected, node);
        }
      }
      this.items.forEach(item => {
        this.traverse(item, 0, removeAllFromSelection);
      });
      this.selection = [];
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
        const childInput = this.$refs[`branch_${node[this.itemKey]}`][0].$refs[`selectionInput_${childNode[this.itemKey]}`];
        if (!childInput) return false;
        return childInput[0].indeterminate || childInput[0].checked;
      });
    },
    isItemSelected(items) {
        const itemKey = (items[0] && items[0]._id) ? '_id' : 'id';
        return items.some((item) => {
          return this.finalSelection.find(selectedItem => selectedItem._id === item[itemKey]);
        });
    },
    handleSelection(isChecked, node) {
      if (!node._id) {
        const selectedOffsprings = [];
        const findSelected = (node) => {
          if (this.isChecked(node)) {
            selectedOffsprings.push(node);
          }
        }
        this.traverse(node, 0, findSelected);
        isChecked = !selectedOffsprings.length;
      } 
      const addToSelection = (node) => {
        const itemKey = (node._id) ? '_id' : 'id';
        const isExists = this.selection.find(currNode => currNode[itemKey] === node[itemKey]);
        if (!isExists) this.selection.push(node);
      };
      const removeFromSelection = (node) => {
        const itemKey = (node._id) ? '_id' : 'id';
        const idx = this.selection.findIndex(
          (currNode) => currNode[itemKey] === node[itemKey]
        );
        if (idx !== -1) {
          this.selection.splice(idx, 1);
          eventBus.$emit(EV_material_unselected, node);
        }
      };
      const visitFunc = isChecked ? addToSelection : removeFromSelection;

      this.traverse(node, 0, visitFunc);
      this.emitSelection();
      this.checkForIndeterminate();
    },
    isChecked(item) {
      if (!item._id) return false;
      return this.finalSelection.find((currItem) => currItem._id === item._id);
    },
    saveSelection(selection) {
      this.selection = selection;
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
        const itemKey = (node._id) ? '_id' : 'id';
        if (this.finalSelection.find(currNode => currNode._id === node[itemKey])) {
          if (this.primaryMaterialIds.includes(node[itemKey])) {
            var primaryPath = [];
            this.getNodePath(node, primaryPath);
            const primaryParent = this.items.find(currItem => primaryPath.includes(currItem[this.itemKey]));
            if (primaryParent) {
              this.$nextTick(() => {
                this.$refs[`selectionInput_${primaryParent[this.itemKey]}`][0].classList.add('primary-parent');
              });
            }
          }
          const path = [];
          this.getNodePath(node, path);
          const item = this.items.find(currItem => path.includes(currItem[this.itemKey]));
          this.$nextTick(() => {
            if (item) {
              this.$refs[`selectionInput_${item[this.itemKey]}`][0].indeterminate = true;
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
        if (!branchIdsMap[node[this.itemKey]]) {
          branchIdsMap[node[this.itemKey]] = node;
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
  },
  mounted() {
    if (this.doExpandOnMount) {
      this.expandToSelection();
    }
  },
  destroyed() {
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
.atc-id {
  margin: 0 6px;
}
</style>
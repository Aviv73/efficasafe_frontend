<template>
  <section class="tree-view">
    <div class="btns">

      <v-btn 
        elevation="0"
        color="primary lighten-1" 
        v-if="depth === 0" 
        class="close-btn"
        @click="closeAllBranches"
      >Close All</v-btn>
      <v-btn 
        elevation="0"
        color="warning lighten-1" 
        v-if="depth === 0" 
        class="close-btn"
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
            type="checkbox"
            :ref="`selectionInput_${item[itemKey]}`"
            :checked="isChecked(item)"
            :disabled="depth < 2"
            v-if="((item.children && item.children.length) || item._id)"
            @input="handleSelection($event.target.checked, item)"
          />
        </span>
        <span>
          <label :for="`expandInput_${item[itemKey]}`">
            <h6 class="atc-id">{{ item.atcId }}</h6>
            <h6 v-html="labelTxt(item[renderTxt])"></h6>
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
          />
        </span>
      </li>
    </ul>
  </section>
</template>

<script>
import { utilService } from '@/services/util.service';
import { eventBus, EV_emptySelection } from '@/services/eventBus.service';

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
    }
  },
  branchIdsMap: {},
  data() {
    return {
      selection: this.parentSelection,
      childDepth: this.depth + 1,
      openBranches: []
    };
  },
  watch: {
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
    cleanSelection() {
      const removeFromSelection = (node) => {
        const itemKey = (node._id) ? '_id' : 'id';
        if (this.selection.find((currItem) => currItem[itemKey] === node[itemKey])) {
          const idx = this.selection.findIndex((currItem) => currItem[itemKey] === node[itemKey]);
          this.selection.splice(idx, 1);
          eventBus.$emit(EV_emptySelection, node.parentId);
        }
      }
      this.items.forEach(item => {
        this.traverse(item, 0, removeFromSelection);
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
      const checkForExpand = (node) => {
        var paths = [];
        if (node.name.toLowerCase().includes(this.search.toLowerCase())) {
          this.getNodePath(node, paths);
          paths.forEach(path => {
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
        this.getNodePath(parentNode, paths);
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
      if (!this.parentId) return;
      const isSelected = this.isItemSelected(this.items);
      this.$emit('item-selection', isSelected, this.parentId);
    },
    indeterminateBranch(isSelected, id) {
      if (!this.$refs[`selectionInput_${id}`]) return; 
      const node = this.items.find(item => item.id === id);
      if (!isSelected) {
        const isIndeterminate = this.isChildIndeterminate(node);
        isSelected = isIndeterminate;
      } 
      this.$refs[`selectionInput_${id}`][0].indeterminate = isSelected;
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
          return this.selection.find(
            (selectedItem) => selectedItem[itemKey] === item[itemKey]
          );
        });
    },
    handleSelection(isChecked, node) {
      const addToSelection = (node) => {
        const itemKey = (node._id) ? '_id' : 'id';
        const isExists = this.selection.find(
          (currNode) => currNode[itemKey] === node[itemKey]
        );
        if (!isExists) this.selection.push(node);
      };
      const removeFromSelection = (node) => {
        const itemKey = (node._id) ? '_id' : 'id';
        const idx = this.selection.findIndex(
          (currNode) => currNode[itemKey] === node[itemKey]
        );
        if (idx !== -1) this.selection.splice(idx, 1);
      };
      const visitFunc = isChecked ? addToSelection : removeFromSelection;

      this.traverse(node, 0, visitFunc);
      this.emitSelection();
      this.checkForIndeterminate();
    },
    isChecked(item) {
      const itemKey = (item._id) ? '_id' : 'id';
      return this.selection.find((currItem) => currItem[itemKey] === item[itemKey]);
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
        if (this.selection.find(currNode => currNode[itemKey] === node[itemKey])) {
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
  }
};
</script>

<style scoped lang="scss">
.btns {
  float: right;

  .close-btn {
    display: block;
    &:first-child {
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
  outline: 1px solid #1976d2;
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
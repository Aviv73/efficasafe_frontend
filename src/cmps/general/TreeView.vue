<template>
    <section class="tree-view">
        {{ '\t\t' }}
        <ul>
            <li v-for="item in items" :key="item[itemKey]" :class="{leaf: item.children && !item.children.length}">
                <span>
                    <label v-if="item.children && item.children.length">
                        <input
                            hidden
                            class="expandInput"
                            :id="`expandInput_${item[itemKey]}`"
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
                        :checked="
                            selection.find(
                                (currItem) =>
                                    currItem[itemKey] === item[itemKey]
                            )
                        "
                        @input="handleSelection($event.target.checked, item)"
                    />
                </span>
                <span>
                    <label :for="`expandInput_${item[itemKey]}`">
                        <h6 class="atc-id">{{ item.atcId }}</h6>
                        <h6 v-html="labelTxt(item[renderTxt])"></h6>
                    </label>
                    <tree-view
                        hidden
                        v-if="item[children] && item[children].length"
                        :search="search"
                        :ref="`branch_${item[itemKey]}`"
                        :items="item[children]"
                        :itemKey="itemKey"
                        :renderTxt="renderTxt"
                        :children="children"
                        :parentSelection="selection"
                        @label-name-found="expandBranch"
                        @item-selection="indeterminateBranch"
                        @selection-changed="saveSelection($event)"
                    />
                </span>
            </li>
        </ul>
    </section>
</template>

<script>
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
        parentSelection: {
            type: Array,
            default: () => [],
        },
        search: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            selection: this.parentSelection,
        };
    },
    watch: {
        search() {
            if (this.search) {
                this.checkForExpand();
            }
        }
    },
    methods: {
        checkForExpand() {
            if (!this.items[0] || !this.items[0].parentLabel) return;
            const isFound = this.isItemFound(this.items);
            this.$emit('label-name-found', isFound, this.items[0].parentLabel._id);
        },
        expandBranch(isFound, id) {
            if (!this.$refs[`branch_${id}`]) return;
            this.toggleExpand(isFound, id);
            if (this.items[0].parentLabel) {
                this.$emit('label-name-found', isFound, this.items[0].parentLabel._id);
            }
        },
        toggleExpand(isChecked, nodeId) {
            this.$refs[`expandInput_${nodeId}`][0].checked = isChecked;
            this.$refs[`branch_${nodeId}`][0].$el.hidden = !isChecked;
        },
        checkSelection() {
            if (!this.items[0].parentLabel) return;
            const isSelected = this.isItemSelected(this.items);
            this.$emit('item-selection', isSelected, this.items[0].parentLabel[this.itemKey]); 
        },
        indeterminateBranch(isSelected, id) {
            this.$refs[`selectionInput_${id}`][0].indeterminate = isSelected;
            if (this.items[0].parentLabel) {
                this.$emit('item-selection', isSelected, this.items[0].parentLabel[this.itemKey]);
            }
        },
        isItemFound(items) {
            return items.some(item => {
                return item.name.toLowerCase().includes(this.search.toLowerCase());
            });
        },
        isItemSelected(items) {
            return items.some(item => {
                return this.selection.find(selectedItem => selectedItem[this.itemKey] === item[this.itemKey]);
            });
        },
        handleSelection(isChecked, node) {
            const addToSelection = (node) => {
                const isExists = this.selection.find(currNode => currNode[this.itemKey] === node[this.itemKey]);
                if (!isExists) this.selection.push(node);
            };
            const removeFromSelection = (node) => {
                const idx = this.selection.findIndex(
                    (currNode) => currNode[this.itemKey] === node[this.itemKey]
                );
                this.selection.splice(idx, 1);
            };
            const visitFunc = isChecked ? addToSelection : removeFromSelection;

            this.traverse(node, 0, visitFunc);
            this.checkSelection();
            this.emitSelection();
        },
        saveSelection(selection) {
            this.selection = selection;
            this.emitSelection();
        },
        emitSelection() {
            this.$emit('selection-changed', this.selection);
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
    computed: {
        labelTxt() {
            return (txt) => {
                if (!this.search) return txt;
                const regex = new RegExp(this.search, 'i');
                return txt.replace(regex, `<span style="background-color: yellow">${this.search.toUpperCase()}</span>`);
            }
        }
    }
};
</script>

<style scoped lang="scss">
    h6 {
        display: inline;
    }
    h6:hover {
        background-color: darken(white, 10%);
    }
    [type=checkbox]:indeterminate {
        outline: 1px solid #1976D2;
    }
    .expandInput:checked + .v-icon {
        display: inline-block;
        transform: rotateZ(90deg);
    }
    .leaf {
        padding-left: 15px;
    }
    .atc-id {
        margin: 0 6px;
    }
</style>
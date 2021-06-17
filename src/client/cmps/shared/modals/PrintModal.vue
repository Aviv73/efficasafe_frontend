<template>
    <aside class="print-modal">
        <header class="print-modal-header flex-space-between">
            <printer-icon :size="18" />
            <h5>Select the results you would like to print</h5>
            <button
                class="close-btn"
                @click="$emit('close-modal')"
            >
                <close-icon :size="14" />
            </button>
        </header>
        <main class="print-modal-content">
            <ul class="print-modal-content-list">
                <li class="print-modal-content-list-item flex-align-center">
                    <checkbox v-model="isAllSelected" class="checkbox">
                        <template #label>
                            <span class="checkbox-label">Select all</span>
                        </template>
                    </checkbox>
                </li>
                <li
                    class="print-modal-content-list-item"
                    v-for="(interaction, idx) in interactions"
                    :key="interaction._id + `${idx}`"
                >
                    <interaction-print-preview
                        :interaction="interaction"
                        :selection="printSelection"
                        @interaction-toggled="toggleInteraction"
                    />
                </li>
            </ul>
        </main>
        <footer class="print-modal-footer">
            <button
                class="print-modal-footer-btn"
                @click="$emit('close-modal')"
            >
                Cancel
            </button>
            <button
                class="print-modal-footer-btn print-btn"
                :disabled="!printSelection.length"
                @click="onPrint"
            >
                Print
            </button>
        </footer>
    </aside>
</template>

<script>
import Checkbox from '@/client/cmps/common/Checkbox';
import InteractionPrintPreview from '@/client/cmps/shared/InteractionPrintPreview';

import PrinterIcon from 'vue-material-design-icons/Printer';
import CloseIcon from 'vue-material-design-icons/Close';

export default {
    props: {
        interactions: {
            type: Array,
            required: true
        },
        materials: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            printSelection: [],
            isAllSelected: false
        }
    },
    watch: {
        interactions: {
            handler() {
                this.reset();
            },
            immediate: true
        },
        isAllSelected(val) {
            if (val) {
                this.fillSelection(this.interactions);
            } else {
                this.printSelection = [];
            }
        },
        'printSelection.length'(val) {
            if (!val) this.isAllSelected = false;
        }
    },
    methods: {
        onPrint() {
            console.log('will print! 💪', this.printSelection);
            alert('Feature still in progress and will be available soon :)');
        },
        toggleInteraction(interaction) {
            const idx = this.printSelection.findIndex(i => i._id === interaction._id);
            if (idx === -1) {
                this.printSelection.push(interaction);
            } else {
                this.printSelection.splice(idx, 1);
            }
        },
        reset() {
            this.printSelection = [];
            this.isAllSelected = false;
        },
        fillSelection(interactions) {
            interactions.forEach(interaction => {
                if (interaction.vInteractions) {
                    this.fillSelection(interaction.vInteractions);
                } else this.printSelection.push(interaction);
            });
        }
    },
    components: {
        PrinterIcon,
        CloseIcon,
        Checkbox,
        InteractionPrintPreview
    }
}
</script>
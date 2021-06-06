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
                    class="print-modal-content-list-item flex-align-center"
                    v-for="interaction in flatInteractions"
                    :key="interaction._id"
                >
                    <checkbox
                        class="checkbox"
                        :isChecked="isSelected(interaction._id)"
                        @change="toggleInteraction(interaction)"
                    />
                    <interaction-capsules
                        class="capsules"
                        :name="interaction.name"
                        :color="getInteractionColor(interaction.recommendation)"
                        :vInteractionCount="0"
                        :showDraftName="false"
                        localize
                    />
                    <span>
                        {{ getShortRecommendation(interaction.recommendation) }}
                    </span>
                    <span class="evidence-level">
                        {{ interaction.evidenceLevel || interaction.evidence_level }}
                    </span>
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
import { interactionUIService } from '@/cms/services/interaction-ui.service';

import Checkbox from '@/client/cmps/common/Checkbox';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';

import PrinterIcon from 'vue-material-design-icons/Printer';
import CloseIcon from 'vue-material-design-icons/Close';

export default {
    props: {
        interactions: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            flatInteractions: [],
            printSelection: [],
            isAllSelected: false
        }
    },
    watch: {
        interactions: {
            handler(val) {
                this.reset(val);
            },
            immediate: true
        },
        isAllSelected(val) {
            this.printSelection = val ? [ ...this.flatInteractions ] : []; 
        }
    },
    methods: {
        onPrint() {
            console.log('printing...');
            console.log(this.printSelection);
        },
        toggleInteraction(interaction) {
            const idx = this.printSelection.findIndex(i => i._id === interaction._id);
            if (idx === -1) {
                const prevIdx = this.flatInteractions.findIndex(i => i._id === interaction._id);
                this.printSelection.splice(prevIdx, 0, interaction);
            } else {
                this.printSelection.splice(idx, 1);
            }
        },
        isSelected(interactionId) {
            return this.printSelection.findIndex(i => i._id === interactionId) !== -1;
        },
        getInteractionColor(recommendation) {
            return interactionUIService.getInteractionColor(recommendation);
        },
        getShortRecommendation(fullRec) {
            return interactionUIService.getShortRecommendation(fullRec);
        },
        reset(interactions) {
            this.flatInteractions = [];
            this.printSelection = [];
            this.isAllSelected = false;
            this.flatten(interactions);
        },
        flatten(interactions) {
            interactions.forEach(interaction => {
                if (interaction.vInteractions) {
                    this.flatten(interaction.vInteractions);
                } else this.flatInteractions.push(interaction);
            });
        }
    },
    components: {
        PrinterIcon,
        CloseIcon,
        Checkbox,
        InteractionCapsules
    }
}
</script>
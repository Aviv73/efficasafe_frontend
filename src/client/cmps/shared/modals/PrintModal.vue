<template>
    <aside class="print-modal">
        <header class="print-modal-header">
            <div class="flex-space-between">
                <printer-icon :size="18" />
                <h5>{{ !interactionData ? 'Select the results you would like to print' : 'Interaction details print' }}</h5>
                <button
                    class="close-btn"
                    @click="$emit('close-modal')"
                >
                    <close-icon :size="14" />
                </button>
            </div>
            <span class="print-modal-header-sub" v-if="!interactionData">
                * The full print preview will be shown in the next screen
            </span>
        </header>
        <main class="print-modal-preview">
            <ul class="print-modal-preview-list" v-if="!interactionData">
                <li class="print-modal-preview-list-item flex-align-center">
                    <checkbox v-model="isAllSelected" class="checkbox">
                        <template #label>
                            <span class="checkbox-label">Select all</span>
                        </template>
                    </checkbox>
                </li>
                <li
                    class="print-modal-preview-list-item"
                    v-for="(interaction, idx) in localizedInteraction"
                    :key="interaction._id + `${idx}`"
                >
                    <interaction-print-preview
                        :interaction="interaction"
                        :selection="printSelection"
                        @interaction-toggled="toggleInteraction"
                    />
                </li>
            </ul>
            <section class="print-modal-preview-interaction" v-else>
                <header class="print-modal-preview-interaction-header flex-center">
                    <img :src="require('@/client/assets/imgs/logo-vector.svg')" alt="Logo" />
                    <div>Interaction details</div>
                </header>
                <div
                    class="print-modal-preview-interaction-summary flex-coloumn"
                >
                    <interaction-capsules
                        :name="interactionData.name"
                        :color="interactionData.color"
                        :vInteractionCount="0"
                        :localize="false"
                        :showDraftName="false"
                        on-details-page
                    />
                    <span
                        class="recommendation-capsule capsule"
                        :style="{ 'color': interactionData.color }"
                    >
                        <span class="clip-txt">
                            <component :is="interactionData.icon" class="recommendation-capsule-icon" :size="14" />
                            {{ interaction.recommendation }}
                        </span>
                    </span>
                    <span class="level-of-evidence capsule">
                        Level of evidence:
                        <span class="font-medium">{{ interactionData.evidenceLevel }}</span>
                        = <span class="sub-txt">{{ evidenceLevelTxt }}</span>
                    </span>
                    <span class="note capsule" v-if="interactionData.showNote && interaction.note">
                        <span class="font-bold">Note:</span> {{ interaction.note }}
                    </span>
                    <div v-if="interactionData.showWarning">
                        <div
                            class="narrow-therapuetic-warnning"
                        >
                            Attention: {{ interactionData.side2Name }} has a narrow therapeutic range. Differences
                            in dose or blood concentration may lead to serious therapeutic failures and/or adverse
                            drug reactions.
                        </div>
                    </div>
                </div>
                <div
                    v-if="!interactionData.isDBank"
                    class="print-modal-preview-interaction-content"
                >
                    <div class="print-modal-preview-interaction-content-subheader">Summary</div>
                    <p class="paragraph" v-html="interaction.summary" />
                    <div
                        class="print-modal-preview-interaction-content-subheader"
                        v-if="showMonitor"
                    >
                        What to monitor
                    </div>
                    <div
                        class="paragraph"
                        v-if="showMonitor"
                    >
                        <div v-if="interaction.monitor.general">
                            <span class="font-medium">General: </span>
                            {{ interaction.monitor.general | remove-ending-dot }}
                        </div>
                        <div v-if="interaction.monitor.labTests">
                            <span class="font-medium">Lab tests: </span>
                            {{ interaction.monitor.labTests | remove-ending-dot }}
                        </div>
                        <div v-if="interaction.monitor.otherTests">
                            <span class="font-medium">Other tests: </span>
                            {{ interaction.monitor.otherTests | remove-ending-dot }}
                        </div>
                        <div v-if="interaction.monitor.symptoms">
                            <span class="font-medium">Symptoms: </span>
                            {{ interaction.monitor.symptoms | remove-ending-dot }}
                        </div>
                    </div>
                    <div class="print-modal-preview-interaction-content-subheader">Pharmacokinetics</div>
                    <div class="font-bold small-header">Drug metabolism</div>
                    <div class="enzymes-opener">{{ interactionData.side2Name }} is metabolized by:</div>
                    <div class="paragraph">
                        <div
                            v-for="({ name, pathways }, index) in formatedPathways"
                            :key="index"
                        >
                            <span class="font-medium font-capitalize">{{ name }}: </span>
                            <span
                                class="pathway"
                                v-for="(pathway, idx) in pathways"
                                :key="idx"
                            >
                                <span>{{ idx === 0 ? '' : ', ' }} </span>
                                <span class="font-uppercase">{{ pathway.name + '\xa0' }}</span>
                            </span>
                        </div>
                    </div>
                    <div class="font-bold small-header">{{ interaction.side1Material.name }} effect on drug metabolism</div>
                    <p
                        v-html="interactionData.side1PathwaysTxt"
                    />
                </div>
                <div
                    v-else
                    class="print-modal-preview-interaction-content"
                >
                   <div class="print-modal-preview-interaction-content-subheader">Summary</div>
                   <p class="paragraph">{{ interaction.summary }}</p>
                   <div class="print-modal-preview-interaction-content-subheader">Severity</div>
                   <p class="paragraph">{{ interaction.severity }}</p>
                   <div class="print-modal-preview-interaction-content-subheader">Extended description</div>
                   <p class="paragraph">{{ interaction.extended_description }}</p>
                   <div class="print-modal-preview-interaction-content-subheader">Management</div>
                   <p class="paragraph">{{ interaction.management }}</p>
                </div>
            </section>
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
                :disabled="!printSelection.length && !interactionData"
                @click="onPrint('save')"
            >
                Save
            </button>
            <button
                class="print-modal-footer-btn print-btn"
                :disabled="!printSelection.length && !interactionData"
                @click="onPrint('print')"
            >
                Print
            </button>
        </footer>
    </aside>
</template>

<script>
import { interactionService } from '@/cms/services/interaction.service';
import { eventBus, EV_show_user_msg, EV_sortby_side_swaped } from '@/cms/services/eventBus.service';

import Checkbox from '@/client/cmps/common/Checkbox';
import InteractionPrintPreview from '@/client/cmps/shared/InteractionPrintPreview';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';

import PrinterIcon from 'vue-material-design-icons/Printer';
import CloseIcon from 'vue-material-design-icons/Close';

export default {
    props: {
        interactions: {
            type: Array,
            default: () => []
        },
        materials: {
            type: Array,
            default: () => []
        },
        interaction: {
            type: Object,
            default: () => {}
        },
        interactionData: {
            type: Object,
            required: false
        }
    },
    data() {
        return {
            printSelection: [],
            isAllSelected: false,
            isSidesSwapped: false
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
                this.fillSelection();
            } else {
                this.printSelection = [];
            }
        },
        'printSelection.length'(val) {
            if (!val) this.isAllSelected = false;
        }
    },
    computed: {
        formatedPathways() {
            const formatedPathways = [
                { name: 'enzymes', pathways: this.enzymePathways },
                { name: 'transporters', pathways: this.transporterPathways },
                { name: 'carriers', pathways: this.carrierPathways }
            ];
            return formatedPathways.filter(({ pathways }) => pathways.length);
        },
        enzymePathways() {
            return this.interactionData.side2Pathways.filter(
                pathway => pathway.type === 'enzyme' &&
                (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))
            );
        },
        transporterPathways() {
            return this.interactionData.side2Pathways.filter(
                pathway => pathway.type === 'transporter' &&
                (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))
            );
        },
        carrierPathways() {
            return this.interactionData.side2Pathways.filter(
                pathway => pathway.type === 'carrier' && 
                (!pathway.actions.includes('inducer') && !pathway.actions.includes('inhibitor'))
            );
        },
        showMonitor() {
            const { interaction } = this;
            return interaction.monitor.labTests || interaction.monitor.otherTests || interaction.monitor.symptoms || interaction.monitor.general
        },
        evidenceLevelTxt() {
            const { evidenceLevel } = this.interactionData;
            switch (evidenceLevel.toString().toUpperCase()) {
                case 'A':
                    return 'multi clinical or meta analysis';
                case 'B':
                    return '1 clinical or cohort + pre-clinical';
                case 'C':
                    return '1 clinical or cohort';
                case 'D':
                    return 'case report';
                case 'E':
                    return 'multi pre-clinical';
                case 'F':
                    return '1 pre-clinical';
                case '1':
                    return 'official prescribing information';
                case '2':
                    return 'scientific and clinical knowledge';
                default:
                    return '';
            }
        },
        sortBySide() {
            return this.$store.getters.firstInteractionSide;
        },
        materialSelection() {
            return this.materials.filter(m => !m.isIncluded).map(({ userQuery }) => userQuery);
        },
        localizedInteraction() {
            return this.interactions.map(interaction => {
                const { materialNamesMap } = this.$store.getters;
                let [ side1Name, side2Name ] = interaction.name.split('&').map(str => str.trim());
                if (materialNamesMap[side1Name]) side1Name = materialNamesMap[side1Name][0];
                if (materialNamesMap[side2Name]) side2Name = materialNamesMap[side2Name][0];
                
                if (interaction.isMaterialGroup) {
                    interaction._id = interaction.mainMaterialId;
                }
                let vInteractions = null;
                if (this.isSidesSwapped && interaction.isCompoundGroup) {
                    vInteractions = interaction.vInteractions.map(vInteraction => {
                        let [ side1Name, side2Name ] = vInteraction.name.split('&').map(str => str.trim());
                        return {
                            ...vInteraction,
                            name: `${side2Name} & ${side1Name}`
                        }
                    });
                }
                const localizedItem = {
                    ...interaction,
                    name: interaction.isMaterialGroup ? side1Name.replace(/\(0\)/, '').replace(/\.\.\./, '').trim() : this.isSidesSwapped ? `${side2Name} & ${side1Name}` : `${side1Name} & ${side2Name}`
                }
                if (vInteractions) localizedItem.vInteractions = vInteractions;
                return localizedItem;
            });
        },
        printData() {
            const isList = !this.interactionData;
            return {
                type: isList ? 'list' : 'single',
                interactions: isList ? this.printSelection : null,
                materials: isList ? this.materialSelection : null,
                isD2D: isList && this.$route.name === 'Drug2Drug',
                isSwapped: isList && this.isSidesSwapped,
                isPositives: isList && this.$route.name === 'Boosters',
                path: isList ? '' : this.$route.fullPath
            }
        }
    },
    methods: {
        async onPrint(action) {
            try {
                const buffer = await interactionService.getPrintPreview(this.printData);
                const blob = new Blob([ buffer ], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                
                if (action === 'print') {
                    const iframe = document.createElement('iframe');
                    iframe.style.visibility = 'hidden';
                    iframe.style.position = 'absolute';
                    iframe.src = url;
                    iframe.onload = function() {
                        this.contentWindow.__container__ = this;
                        this.contentWindow.onbeforeunload = function() {
                            document.body.removeChild(this.__container__);
                        }
                        this.contentWindow.onafterprint = function() {
                            document.body.removeChild(this.__container__);
                        }
                        this.contentWindow.focus();
                        this.contentWindow.print();
                    }   
                    document.body.appendChild(iframe);
                } else if (action === 'save') {
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'Efficasafe search results.pdf';
                    link.click();
                }
            } catch(err) {
                eventBus.$emit(EV_show_user_msg, 'Ooops, something went wrong. Please try again later', 5000, 'error');
            }
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
            this.isSidesSwapped = !this.sortBySide;
        },
        fillSelection() {
            this.printSelection = [ ...this.localizedInteraction ];
        },
        swapSideNames() {
            this.isSidesSwapped = !this.isSidesSwapped;
        }
    },
    created() {
        eventBus.$on(EV_sortby_side_swaped, this.swapSideNames);
    },
    beforeDestroy() {
        eventBus.$off(EV_sortby_side_swaped, this.swapSideNames);
    },
    components: {
        PrinterIcon,
        CloseIcon,
        Checkbox,
        InteractionPrintPreview,
        InteractionCapsules,
        CancelIcon: () => import('vue-material-design-icons/Cancel'),
        AlertCircleOutlineIcon: () => import('vue-material-design-icons/AlertCircleOutline'),
        CheckIcon: () => import('vue-material-design-icons/Check'),
        CircleOutlineIcon: () => import('vue-material-design-icons/CircleOutline')
    }
}
</script>
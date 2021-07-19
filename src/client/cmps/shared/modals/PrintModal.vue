<template>
    <aside class="print-modal">
        <header class="print-modal-header">
            <div class="flex-space-between">
                <printer-icon :size="18" />
                <h5>Select the results you would like to print</h5>
                <button
                    class="close-btn"
                    @click="$emit('close-modal')"
                >
                    <close-icon :size="14" />
                </button>
            </div>
            <span class="print-modal-header-sub">
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
                    class="print-modal-preview-interaction-summary"
                    :class="{ 'flex-center': !interactionData.showWarning }"
                >
                    <div class="flex-coloumn">
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
                            <component :is="interactionData.icon" :size="14" />
                            <span class="clip-txt">{{ interaction.recommendation }}</span>
                        </span>
                        <span class="level-of-evidence capsule">
                            Level of evidence:
                            <span class="font-medium">{{ interactionData.evidenceLevel }}</span>
                            = <span class="sub-txt">{{ evidenceLevelTxt }}</span>
                        </span>
                        <span class="note capsule" v-if="interactionData.showNote && interaction.note">
                            <span class="font-bold">Note:</span> {{ interaction.note }}
                        </span>
                        <span
                            class="sub-txt"
                            v-if="interactionData.refsDetailsTxt"
                        >
                            {{ interactionData.refsDetailsTxt }}
                        </span>
                    </div>
                    <div v-if="interactionData.showWarning">
                        <div
                            class="narrow-therapuetic-warnning flex-center"
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
                    <p class="paragraph" v-html="removeRefs(interaction.summary)" />
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
                    <div class="font-bold small-header">{{ interaction.side1Material.name }} effect on drug metabolism Summary</div>
                    <p
                        v-html="removeRefs(interactionData.side1PathwaysTxt)"
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
                   <p class="paragraph">{{ removeRefs(interaction.extended_description, true) }}</p>
                   <div class="print-modal-preview-interaction-content-subheader">Management</div>
                   <p class="paragraph">{{ removeRefs(interaction.management, true) }}</p>
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
import { eventBus, EV_show_user_msg } from '@/cms/services/eventBus.service';

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
        materialSelection() {
            return this.materials.filter(m => !m.isIncluded).map(({ userQuery }) => userQuery);
        },
        localizedInteraction() {
            return this.interactions.map(interaction => {
                const { materialNamesMap } = this.$store.getters;
                let [ side1Name, side2Name ] = interaction.name.split('&').map(str => str.trim());
                if (materialNamesMap[side1Name]) side1Name = materialNamesMap[side1Name].join(', ');
                if (materialNamesMap[side2Name]) side2Name = materialNamesMap[side2Name].join(', ');
                
                if (interaction.isMaterialGroup) {
                    interaction._id = interaction.mainMaterialId;
                }

                return {
                    ...interaction,
                    name: interaction.isMaterialGroup ? side1Name.replace(/\(0\)/, '').trim() : `${side1Name} & ${side2Name}`
                }
            });
        },
        printData() {
            const isList = !this.interactionData;
            return {
                type: isList ? 'list' : 'single',
                interactions: isList ? this.printSelection : null,
                materials: isList ? this.materialSelection : null,
                isD2D: isList && this.$route.name === 'Drug2Drug',
                interaction: isList ? '' : this.interaction,
                interactionData: isList ? '' : this.interactionData
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
                        this.contentWindow.focus(); // Required for IE
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
        },
        fillSelection() {
            this.printSelection = [ ...this.localizedInteraction ];
        },
        removeRefs(txt, isDBank = false) {
            const rgx = isDBank ? /\[(.*?)\]/g : /\(([\d- ,\d]+)\)|<sub>\(([\d- ,\d]+)\)<\/sub>/g;
            return txt.replace(rgx, '');
        }
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
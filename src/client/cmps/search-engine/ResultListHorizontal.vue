<template>
    <section class="horizontal-list">
        <header class="horizontal-list-header">
            <span class="horizontal-list-header-item">
                <label
                    class="flex-align-center"
                    title="Sort A-Z / Z-A"
                    tabindex="0"
                >
                    <input type="checkbox" hidden @change="emitSort('name', $event.target.checked)" />
                    <sort-vertical-icon class="sort-icon v-tour-step-2" title="" />
                    <span>{{ side1Name }} vs {{ side2Name }}</span>
                </label>
                <button
                    @click="changeSortBySide"
                    class="swap-side-btn"
                >
                    <sort-vertical-icon
                        class="swap-side-icon"
                        color="#329D9C"
                        title=""
                    />
                </button>
            </span>
            <span class="horizontal-list-header-item">
                <label
                    class="flex-align-center"
                    title="Sort by recommendation"
                    tabindex="0"
                >
                    <input type="checkbox" hidden @change="emitSort('recommendation', $event.target.checked)" />
                    <sort-vertical-icon class="sort-icon" title="" />
                    <span>Recommendation</span>
                </label>
                <tooltip on="hover" right right-bottom>
                    <template #content>
                        <div class="tooltip-content">
                            <p class="recommendation-tooltip">
                                <span class="d-block">
                                    <span class="highlight">Coadministration is possible</span> means that the combination
                                    has been examined in clinical trials and was found to be safe.
                                </span>
                                <span class="highlight">Coadministration is not contraindicated</span>
                                means that the
                                combination has been only examined in preclinical studies.
                            </p>
                        </div>
                    </template>
                    <information-outline-icon
                        class="tooltip-trigger v-tour-step-3"
                        :size="12"
                        title=""
                    />
                </tooltip>
            </span>
            <span class="horizontal-list-header-item">
                <label
                    class="flex-align-center"
                    title="Sort by level of evidence"
                    tabindex="0"
                >
                    <input type="checkbox" hidden @change="emitSort('evidenceLevel', $event.target.checked)" />
                    <sort-vertical-icon class="sort-icon" title="" />
                    <span>Level of Evidence</span>
                </label>
                <tooltip on="hover" right right-bottom>
                    <template #content>
                        <div class="tooltip-content">
                            <ol v-if="$route.name === 'Drug2Drug'">
                                <li>
                                    information formally provided in official prescribing information
                                </li>
                                <li>
                                    based on scientific and clinical knowledge referenced from a variety of evidence sources
                                </li>
                            </ol>
                            <ul v-else>
                                <li>A - multi clinical or meta analysis</li>
                                <li>B - 1 clinical or cohort + pre-clinical</li>
                                <li>C - 1 clinical or cohort</li>
                                <li>D - case report</li>
                                <li>E - multi pre-clinical</li>
                                <li>F - 1 pre-clinical</li>
                            </ul>
                        </div>
                    </template>
                    <information-outline-icon
                        class="tooltip-trigger v-tour-step-4"
                        :size="12"
                        title=""
                    />
                </tooltip>
            </span>
        </header>
        <ul class="horizontal-list-list">
            <li
                class="horizontal-list-list-item"
                v-if="$route.name === 'Monitor' && total"
            >
                <monitor-summary :interactions="interactions" />
            </li>
            <li
                class="horizontal-list-list-item"
                v-for="(interaction, idx) in interactions"
                :key="idx"
            >
                <interaction-preview
                    :interaction="interaction"
                    :materials="materials"
                    :link="$route.name !== 'Monitor'"
                />
            </li>
        </ul>
    </section>
</template>

<script>
import { eventBus, EV_sortby_side_swaped } from '@/cms/services/eventBus.service';

import InteractionPreview from '@/client/cmps/search-engine/InteractionPreview';
import Tooltip from '@/client/cmps/common/Tooltip';
import MonitorSummary from '@/client/cmps/search-engine/MonitorSummary';

import SortVerticalIcon from '@/client/cmps/common/icons/SortVerticalIcon';
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline';

export default {
    props: {
        interactions: {
            type: Array,
            default: () => []
        },
        pageCount: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        },
        materials: {
            type: Array,
            default: () => []
        },
        evidenceLevelPopupActive: {
            type: Boolean,
            default: false
        }
    },
    data() {
      return {
        sortBySide: 1
      }
    },
    computed: {
        side1Name() {
            return (this.sortBySide === 1) ? 'Supplement' : 'Drug';
        },
        side2Name() {
            return (this.sortBySide === 1) ? 'Drug' : 'Supplement';
        }
    },
    methods: {
        emitSort(sortBy, isDesc) {
            this.$emit('list-sorted', { sortBy, side: this.sortBySide, isDesc });
        },
        getInteractionKey(interaction) {
            return (interaction.side2Material) ? `${interaction._id}-${interaction.side2Material._id}` : interaction._id;
        },
        changeSortBySide() {
            if (this.sortBySide === 1) this.sortBySide = 2;
            else this.sortBySide = 1;

            eventBus.$emit(EV_sortby_side_swaped, this.sortBySide);
        }
    },
    components: {
        InteractionPreview,
        SortVerticalIcon,
        InformationOutlineIcon,
        Tooltip,
        MonitorSummary
    }
};
</script>
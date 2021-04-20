<template>
    <section class="interaction-preview">
        <collapse>
            <template #header>
                <component
                    :is="getHeaderCmp(interaction)"
                    :to="getInteractionUrl(interaction)"
                >
                    <div
                        class="interaction-preview-header table-row"
                        :class="{ 'child': isChild }"
                    >
                        <span class="col">
                            <interaction-capsules
                                :name="interaction.name"
                                :color="getInteractionColor(interaction.recommendation)"
                                :vInteractionCount="getVinteractionsCount(interaction)"
                                :localize="!isCompoundPart"
                                :showDraftName="isDuplicate"
                                :draftName="interaction.side2DraftName"
                            />
                        </span>
                        <span class="col">
                            {{ getShortRecommendation(interaction.recommendation) }}
                        </span>
                        <span class="col">
                            <tooltip
                                :txt="getLongEvidenceLevel(interaction.evidenceLevel || interaction.evidence_level)"
                                right
                            >
                                <span>{{ interaction.evidenceLevel || interaction.evidence_level }}</span>
                            </tooltip>
                            <span
                                class="refs" 
                                v-if="interaction.refs"
                            >
                                {{ getRefsCount(interaction) }}
                            </span>
                            <button
                                v-if="!interaction.refs || interaction.side2Label"
                                class="de-activator"
                                @click.stop="$emit('close-collapse')"
                            >
                                <chevron-up-icon />
                            </button>
                        </span>
                    </div>
                </component>
            </template>
            <template #content>
                <div
                    class="interaction-preview-content"
                    :class="{ 'link': link }"
                    v-if="!interaction.side2Label && interaction.side2Material"
                >
                    <div v-if="!link">
                        <h3 class="font-bold">Summary</h3>
                        <long-txt
                            :txt="interaction.summary"
                            :maxChars="250"
                            :expandable="false"
                            :overflowSymb="getInteractionLink(interaction)"
                            isHTML
                        />
                    </div>
                </div>
                <div
                    class="interaction-preview-content"
                    :class="{ 'child': isChild }"
                    v-else-if="interaction.side2Label && !interaction.side2Material"
                >
                    <label-interaction-preview
                        :interaction="interaction"
                        :shortRecommendation="getShortRecommendation(interaction.recommendation)"
                        :color="getInteractionColor(interaction.recommendation)"
                        :link="link"
                    />
                </div>
                <div 
                    v-else
                    class="interaction-preview-content"
                    :class="{ 'child': isChild }"
                >
                    <p
                        class="msg"
                        v-if="interaction.isCompoundGroup === false"
                    >
                        There are different interactions, dependent on {{ getSide2Name(interaction.name) }} use:
                    </p>
                    <div
                        v-for="(vInteraction, idx) in interaction.vInteractions"
                        :key="idx"
                    >
                        <interaction-preview
                            :interaction="vInteraction"
                            :materials="materials"
                            :isCompoundPart="isCompoundPart || interaction.isCompoundGroup"
                            :isDuplicate="interaction.isCompoundGroup === false"
                            :link="link"
                            is-child
                        />
                    </div>
                </div>
            </template>
            <template #de-activator>
                <img    
                    src="@/client/assets/icons/collapse-toggle.svg"
                    alt="Chevron up circle icon"
                />
            </template>
        </collapse>
    </section>
</template>

<script>
import { interactionService } from '@/cms/services/interaction.service';

import Collapse from '@/client/cmps/common/Collapse';
import Tooltip from '@/client/cmps/common/Tooltip';
import LongTxt from '@/client/cmps/common/LongTxt';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';
import LabelInteractionPreview from '@/client/cmps/search-engine/LabelInteractionPreview';

import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';

export default {
    name: 'InteractionPreview',
    props: {
        interaction: {
            type: Object,
            required: true
        },
        link: {
            type: Boolean,
            default: false
        },
        isChild: {
            type: Boolean,
            default: false
        },
        materials: {
            type: Array,
            required: true
        },
        isCompoundPart: {
            type: Boolean,
            default: false
        },
        isDuplicate: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getSide2Name(name) {
            const side2Name = name.split(' & ')[1].trim();
            if (!this.isCompoundPart && this.$store.getters.materialNamesMap[side2Name]) {
                return this.$store.getters.materialNamesMap[side2Name].join(', ');
            }
            return side2Name;
        },
        getRefsCount(interaction) {
            if (interaction.refs) {
                const pathwayRefCount = this.getSide2PathwayRefsCount(interaction);
                return `(${interaction.refs.length + pathwayRefCount})`;
            }
            return '';
        },
        getSide2PathwayRefsCount(interaction) {
            if (!interaction.side2Material) return 0;
            const side2Material = this.materials.find(material => material._id === interaction.side2Material._id);
            if (!side2Material) return 0;
            return side2Material.pathways.reduce((acc, pathway) => {
                acc += pathway.references.length;
                return acc;
            }, 0);
        },
        getVinteractionsCount(interaction) {
            if (!('vInteractions' in interaction)) return 0;
            return interaction.vInteractions.reduce((acc, vInteraction) => {
                if (!vInteraction.vInteractions) acc++;
                else acc += vInteraction.vInteractions.length;

                return acc;
            }, 0);
        },
        getHeaderCmp(interaction) {
            if (!this.link || interaction.vInteractions || interaction.side2Label) return 'span';
            else return 'router-link';
        },
        getInteractionUrl(interaction) {
            return interaction.isVirtual ? `/interaction/${interaction._id}/${interaction.side2Material._id}` : `/interaction/${interaction._id}`;
        },
        getInteractionLink(interaction) {
            const url = interaction.isVirtual ? `/interaction/${interaction._id}/${interaction.side2Material._id}` : `/interaction/${interaction._id}`;
            return `.
                <a class="interaction-link" href="${url}">
                    Read more...
                </a>
            `;
        },
        getLongEvidenceLevel(evidenceLevel) {
            if (!evidenceLevel) return '';
            switch (evidenceLevel.toString().toUpperCase()) {
                case 'A':
                    return 'A - multi clinical or meta analysis';
                case 'B':
                    return 'B - 1 clinical or cohort + pre-clinical';
                case 'C':
                    return 'C - 1 clinical or cohort';
                case 'D':
                    return 'D - case report';
                case 'E':
                    return 'E - multi pre-clinical';
                case 'F':
                    return 'F - 1 pre-clinical';
                case '1':
                    return 'information formally provided in official prescribing information';
                case '2':
                    return 'based on scientific and clinical knowledge referenced from a variety of evidence sources';
                default:
                    return '';
            }
        },
        getShortRecommendation(fullRec) {
            switch (fullRec.toLowerCase()) {
                case 'avoid coadministration':
                case 'coadministration is not advised':
                    return fullRec;
                case 'caution should be taken':
                case 'coadministration is not contraindicated but caution should be taken':
                case 'coadministration is possible but caution should be taken':
                    return 'Caution should be taken';
                case 'coadministration is not contraindicated':
                case 'coadministration is not contraindicated and may even be advised':
                    return 'Not contraindicated';
                case 'coadministration is possible':
                case 'coadministration is possible and may even be advised':
                case 'coadministration is advised':
                    return 'Coadministration is possible';
            }
        },
        getInteractionColor(recommendation) {
            return interactionService.getInteractionColor(recommendation);
        }
    },
    components: {
        Collapse,
        InteractionCapsules,
        ChevronUpIcon,
        LongTxt,
        LabelInteractionPreview,
        Tooltip
    }
}
</script>
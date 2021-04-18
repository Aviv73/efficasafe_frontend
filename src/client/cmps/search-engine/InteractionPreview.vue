<template>
    <section class="interaction-preview">
        <collapse>
            <template #header>
                <div class="interaction-preview-header">
                    <span>
                        <interaction-capsules
                            :name="interaction.name"
                            :color="getInteractionColor(interaction.recommendation)"
                            :vInteractionCount="getVinteractionsCount(interaction)"
                        />
                    </span>
                    <span>
                        {{ getShortRecommendation(interaction.recommendation) }}
                    </span>
                    <span class="evidence-level">
                        {{ interaction.evidenceLevel }}
                    </span>
                </div>
            </template>
            <template #content>
                <div
                    class="interaction-preview-content"
                    v-if="!interaction.side2Label && interaction.side2Material"
                >
                    <h3 class="font-bold">Summary</h3>
                    <long-txt
                        :txt="interaction.summary"
                        :maxChars="250"
                        :expandable="false"
                        :overflowSymb="getInteractionLink(interaction)"
                        isHTML
                    />
                    <button class="de-activator" @click="$emit('close-collapse')">
                        <chevron-up-icon />
                    </button>
                </div>
                <div v-else-if="interaction.side2Label && !interaction.side2Material">
                    <label-interaction-preview />
                </div>
                <div
                    v-else
                    v-for="(vInteraction, idx) in interaction.vInteractions"
                    :key="idx"
                >
                    <interaction-preview
                        class="interaction-preview-inner"
                        :interaction="vInteraction"
                    />
                </div>
            </template>
        </collapse>
    </section>
</template>

<script>
import { interactionService } from '@/cms/services/interaction.service';

import Collapse from '@/client/cmps/common/Collapse';
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
        }
    },
    methods: {
        getVinteractionsCount(interaction) {
            return ('vInteractions' in interaction) ? interaction.vInteractions.length : 0;
        },
        getInteractionLink(interaction) {
            const url = interaction.isVirtual ? `/interaction/${interaction._id}/${interaction.side2Material._id}` : `/interaction/${interaction._id}`;
            return `.
                <a class="interaction-link" href="${url}">
                    Read more...
                </a>
            `;
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
        LabelInteractionPreview
    }
}
</script>
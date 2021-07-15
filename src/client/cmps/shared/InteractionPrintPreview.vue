<template>
    <div class="interaction-print-preview flex-align-center flex-wrap">
        <checkbox
            class="checkbox"
            :isChecked="isSelected(interaction._id)"
            @change="$emit('interaction-toggled', interaction)"
        />
        <interaction-capsules
            class="capsules"
            :name="getInteractionName(interaction)"
            :color="getInteractionColor(interaction.recommendation)"
            :vInteractionCount="0"
            :showDraftName="false"
            :draftName="interaction.side2DraftName"
            :localize="localize"
            :isMaterialGroup="$route.name === 'Boosters'"
        />
        <span>
            {{ getShortRecommendation(interaction.recommendation) }}
        </span>
        <span class="evidence-level">
            {{ interaction.evidenceLevel || interaction.evidence_level }}
        </span>
    </div>
</template>

<script>
import { interactionUIService } from '@/cms/services/interaction-ui.service';

import Checkbox from '@/client/cmps/common/Checkbox';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';

export default {
    name: 'InteractionPrintPreview',
    props: {
        interaction: {
            type: Object,
            required: true
        },
        selection: {
            type: Array,
            required: true
        },
        localize: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        getInteractionName(interaction) {
            if (interaction.vInteractions) {
                return `${interaction.name} (${interaction.vInteractions.length})`;
            }
            return interaction.name;
        },
        getInteractionColor(recommendation) {
            return interactionUIService.getInteractionColor(recommendation);
        },
        getShortRecommendation(fullRec) {
            return interactionUIService.getShortRecommendation(fullRec);
        },
        isSelected(interactionId) {
            return this.selection.findIndex(i => i._id === interactionId) !== -1;
        }
    },
    components: {
        Checkbox,
        InteractionCapsules
    }
}
</script>
<template>
    <div class="interaction-print-preview flex-align-center flex-wrap">
        <checkbox
            v-if="!interaction.vInteractions"
            class="checkbox"
            :isChecked="isSelected(interaction._id)"
            @change="$emit('interaction-toggled', interaction)"
        />
        <interaction-capsules
            class="capsules"
            :name="interaction.name"
            :color="getInteractionColor(interaction.recommendation)"
            :vInteractionCount="0"
            :showDraftName="isSingleCapsule"
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
        <ul
            class="inner-list"
            v-if="interaction.vInteractions"
        >
            <li
                v-for="vInteraction in interaction.vInteractions"
                :key="vInteraction._id"
            >
                <interaction-print-preview
                    :class="{ 'inner': doPaddStart(vInteraction._id) }"
                    :interaction="vInteraction"
                    :selection="selection"
                    :isSingleCapsule="!vInteraction.vInteractions && $route.name !== 'Boosters' && !interaction.isCompoundGroup"
                    :localize="false"
                    @interaction-toggled="$emit('interaction-toggled', $event)"
                />
            </li>
        </ul>
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
        isSingleCapsule: {
            type: Boolean,
            default: false
        },
        localize: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        getInteractionColor(recommendation) {
            return interactionUIService.getInteractionColor(recommendation);
        },
        getShortRecommendation(fullRec) {
            return interactionUIService.getShortRecommendation(fullRec);
        },
        isSelected(interactionId) {
            return this.selection.findIndex(i => i._id === interactionId) !== -1;
        },
        doPaddStart(interactionId) {
            if (!this.interaction.isCompoundGroup) return false;
            const vInteraction = this.interaction.vInteractions.find(i => i._id === interactionId);
            const restOfVinteractions = this.interaction.vInteractions.filter(i => i._id !== interactionId);
            return !vInteraction.vInteractions && restOfVinteractions.some(v => !!v.vInteractions);
        }
    },
    components: {
        Checkbox,
        InteractionCapsules
    }
}
</script>
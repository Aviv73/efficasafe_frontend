<template>
    <section class="interaction-preview">
        <collapse>
            <template #header>
                <div class="interaction-preview-header">
                    <span>
                        <interaction-capsules
                            :name="interaction.name"
                            :color="getInteractionColor(interaction.recommendation)"
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
                {{ interaction }}
            </template>
        </collapse>
    </section>
</template>

<script>
import { interactionService } from '@/cms/services/interaction.service';

import Collapse from '@/client/cmps/common/Collapse';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';

export default {
    props: {
        interaction: {
            type: Object,
            required: true
        }
    },
    methods: {
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
        InteractionCapsules
    }
}
</script>
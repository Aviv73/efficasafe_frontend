<template>
    <section class="positive-interaction-preview">
        <collapse
            v-for="group in interaction.vInteractions"
            :key="group._id"
        >
            <template #header>
                <div class="positive-interaction-preview-header table-row child">
                    <span class="table-col">
                        <minus-icon
                            class="minus-icon"
                        />
                        <interaction-capsules
                            :name="getInnerGroupName(group.name)"
                            :isMaterialGroup="true"
                            :color="getInteractionColor(group.recommendation)"
                            :showDraftName="false"
                            :vInteractionCount="0"
                            :localize="true"
                        />
                    </span>
                    <span class="table-col">
                        {{ getShortRecommendation(group.recommendation) }}
                    </span>
                    <span class="table-col">
                        <tooltip
                            :txt="getLongEvidenceLevel(group.evidenceLevel)"
                            right
                        >
                            <span class="evidence-level">
                                {{ interaction.evidenceLevel }}
                            </span>
                        </tooltip>
                        <span class="de-activator">
                            <chevron-up-icon class="opened" />
                            <chevron-down-icon class="closed" />
                        </span>
                    </span>
                </div>
            </template>
            <template #content>
            
            </template>
        </collapse>
    </section>
</template>

<script>
import { interactionUIService } from '@/cms/services/interaction-ui.service';

import Collapse from '@/client/cmps/common/Collapse';
import Tooltip from '@/client/cmps/common/Tooltip';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';

import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';
import MinusIcon from 'vue-material-design-icons/Minus';

export default {
    props: {
        interaction: {
            type: Object,
            required: true
        }
    },
    methods: {
        getInteractionColor(recommendation) {
            return interactionUIService.getInteractionColor(recommendation);
        },
        getInnerGroupName(name) {
            return name.split('&')[0].trim();
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
        }
    },
    components: {
        Collapse,
        MinusIcon,
        InteractionCapsules,
        Tooltip,
        ChevronUpIcon,
        ChevronDownIcon
    }
}
</script>
<template>
    <section class="interaction-preview positive-booster">
        <collapse
            v-for="group in interaction.vInteractions"
            :key="group._id"
        >
            <template #header>
                <div class="interaction-preview-header table-row child">
                    <span class="table-col">
                        <minus-icon
                            class="minus-icon"
                            title=""
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
                                {{ group.evidenceLevel }}
                            </span>
                        </tooltip>
                        <span class="de-activator">
                            <chevron-up-icon class="opened" title="" />
                            <chevron-down-icon class="closed" title="" />
                        </span>
                    </span>
                </div>
            </template>
            <template #content>
                <div class="interaction-preview-content">
                    <positive-interaction-inner-list
                        :side1-id="group.side1Material._id"
                        :main-side2-material-id="interaction.mainMaterialId"
                        :materials="materials"
                    />
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
import { interactionUIService } from '@/cms/services/interaction-ui.service';

import Collapse from '@/client/cmps/common/Collapse';
import Tooltip from '@/client/cmps/common/Tooltip';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';
import PositiveInteractionInnerList from '@/client/cmps/search-engine/PositiveInteractionInnerList';

import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';
import MinusIcon from 'vue-material-design-icons/Minus';

export default {
    props: {
        interaction: {
            type: Object,
            required: true
        },
        materials: {
            type: Array,
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
                    return 'Caution should be taken';
                case 'coadministration is possible but caution should be taken':
                    return 'Possible with caution';
                case 'coadministration is not contraindicated':
                case 'coadministration is not contraindicated and may even be advised':
                    return 'Not contraindicated';
                case 'coadministration is possible':
                    case 'coadministration is advised':
                        return 'Coadministration is possible';
                case 'coadministration is possible and may even be advised':
                    return 'Coadministration may be advised';
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
        ChevronDownIcon,
        PositiveInteractionInnerList
    }
}
</script>
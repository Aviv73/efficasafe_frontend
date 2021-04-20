<template>
    <section class="label-interaction-preview">
        <div
            class="label-interaction-preview-group"
            v-for="(atcGroup, idx) in atcGroupedVinteractions"
            :key="idx"
        >
            <collapse>
                <template #header>
                    <div class="label-interaction-preview-group-header table-row">
                        <span class="col">
                            <interaction-capsules
                                :name="getGroupName(atcGroup.name)"
                                :vInteractionCount="4"    
                                :showDraftName="false"
                                :localize="true"
                                :color="color"
                            />
                        </span>
                        <span class="col">
                            {{ shortRecommendation }}
                        </span>
                        <span class="col">
                            {{ interaction.evidenceLevel }}
                            <button
                                class="de-activator"
                                @click.stop="$emit('close-collapse')"
                            >
                                <chevron-up-icon />
                            </button>
                        </span>
                    </div>
                </template>
                <template #content>
                    <pre>{{ atcGroup.vInteractions }}</pre>
                </template>
                <template #de-activator>
                    <chevron-up-circle-icon class="chevron-up-circle-icon" />
                </template>
            </collapse>
        </div>
    </section>
</template>

<script>
import Collapse from '@/client/cmps/common/Collapse';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';

import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';
import ChevronUpCircleIcon from 'vue-material-design-icons/ChevronUpCircle';

export default {
    props: {
        interaction: {
            type: Object,
            required: true
        },
        shortRecommendation: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            vInteractions: [],
            isLoading: false
        };
    },
    computed: {
        atcGroupVinteractionMap() {
            return this.vInteractions.reduce((acc, vinteraction) => {
                vinteraction.atcParentGroups.forEach((atcGroup) => {
                    const atcGroupName = atcGroup.split(' ').splice(1).join(' ');
                    if (!acc[atcGroupName]) {
                        acc[atcGroupName] = [];
                    }
                    if (!acc[atcGroupName].includes(vinteraction.side2Material._id)) {
                        acc[atcGroupName].push(vinteraction.side2Material._id);
                    }
                });
                return acc;
            }, {});
        },
        atcGroupedVinteractions() {
            return Object.keys(this.atcGroupVinteractionMap).reduce(
                (acc, atcGroup) => {
                    const ids = this.atcGroupVinteractionMap[atcGroup];
                    if (ids.length > 1) {
                        let vInteractions = [];
                        ids.forEach((id) => {
                            const matching = this.vInteractions.filter(vinteraction => vinteraction.side2Material._id === id);
                            vInteractions = vInteractions.concat(matching);
                        });
                        acc.push({ name: atcGroup, vInteractions });
                    }
                    return acc;
            }, []);
        },
        restOfVinteractions() {
            const seenDbankIdsMap = {};
            return Object.keys(this.atcGroupVinteractionMap).reduce(
                (acc, atcGroup) => {
                    const ids = this.atcGroupVinteractionMap[atcGroup];
                    if (ids.length === 1 && !seenDbankIdsMap[ids[0]]) {
                        const vInteractions = this.vInteractions.filter(vint => vint.side2Material._id === ids[0]);
                        acc = acc.concat(vInteractions);

                        seenDbankIdsMap[ids[0]] = true;
                    }
                    return acc;
            }, []);
        }
    },
    methods: {
        async getRelatedMaterials() {
            this.isLoading = true;
            const { interaction } = this;
            const labelId = interaction.side2Label._id;
            const criteria = { limit: 0, page: 0, labelId };
            const relatedMaterials = await this.$store.dispatch({
                type: 'getMaterials',
                criteria
            });
            this.vInteractions = relatedMaterials.map(
                ({ _id, name, type, atcPaths, drugBankId }) => {
                    return {
                        _id: interaction._id,
                        side1Material: interaction.side1Material,
                        side2Material: {
                            _id,
                            name,
                            type,
                        },
                        side2Label: null,
                        recommendation: interaction.recommendation,
                        isVirtual: true,
                        side2DraftName: interaction.side2DraftName,
                        drugBankId,
                        atcParentGroups: atcPaths.map((atcPath) => atcPath.filter((path, idx) => idx === 3)).flat(1),
                    };
                }
            );
            this.isLoading = false;
        },
        getGroupName(groupName) {
            return `${this.interaction.side1Material.name} & ${groupName}`;
        }
    },
    created() {
        this.getRelatedMaterials();
    },
    components: {
        Collapse,
        InteractionCapsules,
        ChevronUpIcon,
        ChevronUpCircleIcon
    }
}
</script>

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
                        <span class="table-col">
                            <minus-icon
                                class="minus-icon"
                            />
                            <interaction-capsules
                                :name="getGroupName(atcGroup.name)"
                                :vInteractionCount="4"    
                                :showDraftName="false"
                                :localize="true"
                                :color="color"
                            />
                        </span>
                        <span class="table-col">{{ shortRecommendation }}</span>
                        <span class="table-col">
                            {{ interaction.evidenceLevel }}
                            <span
                                class="de-activator"
                            >
                                <chevron-up-icon class="opened" />
                                <chevron-down-icon class="closed" />
                            </span>
                        </span>
                    </div>
                </template>
                <template #content>
                    <component
                        v-for="vInteraction in atcGroup.vInteractions"
                        :key="vInteraction.side2Material._id"
                        :is="vInteractionHeaderEl"
                        :to="`/interaction/${vInteraction._id}/${vInteraction.side2Material._id}`"
                    >
                        <collapse>
                            <template #header>
                                <div class="label-interaction-preview-group-header table-row child">
                                    <span class="table-col">
                                        <minus-icon
                                            class="minus-icon"
                                        />
                                        <interaction-capsules
                                            :name="`${vInteraction.side1Material.name} & ${vInteraction.side2Material.name}`"
                                            :vInteractionCount="0"    
                                            :showDraftName="false"
                                            :localize="true"
                                            :color="color"
                                        />
                                    </span>
                                    <span class="table-col">{{ shortRecommendation }}</span>
                                    <span class="table-col">
                                        {{ interaction.evidenceLevel }}
                                        <span
                                            class="refs" 
                                            v-if="interaction.refs"
                                        >
                                            {{ `(${interaction.refs.length + getPathwayRefCount(vInteraction.side2Material._id)})` }}
                                        </span>
                                    </span>
                                </div>
                            </template>
                            <template #content>
                                <div v-if="!link" class="summary-container">
                                    <h3 class="font-bold">Summary</h3>
                                    <long-txt
                                        :txt="vInteraction.summary"
                                        :maxChars="250"
                                        :expandable="false"
                                        :overflowSymb="getInteractionLink(vInteraction)"
                                        isHTML
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
                    </component>
                </template>
                <template #de-activator>
                    <img    
                        src="@/client/assets/icons/collapse-toggle.svg"
                        alt="Chevron up circle icon"
                    />
                </template>
            </collapse>
        </div>
        <div
            class="label-interaction-preview-list"
            v-if="restOfVinteractions.length"
        >
            <component
                v-for="vInteraction in restOfVinteractions"
                :key="vInteraction.side2Material._id"
                :is="vInteractionHeaderEl"
                :to="`/interaction/${vInteraction._id}/${vInteraction.side2Material._id}`"
            >
                    <collapse>
                    <template #header>
                        <div class="label-interaction-preview-group-header table-row">
                            <span class="table-col">
                                <minus-icon
                                    class="minus-icon"
                                />
                                <interaction-capsules
                                    :name="`${vInteraction.side1Material.name} & ${vInteraction.side2Material.name}`"
                                    :vInteractionCount="0"    
                                    :showDraftName="false"
                                    :localize="true"
                                    :color="color"
                                />
                            </span>
                            <span class="table-col">{{ shortRecommendation }}</span>
                            <span class="table-col">
                                {{ interaction.evidenceLevel }}
                                <span
                                    class="refs" 
                                    v-if="interaction.refs"
                                >
                                    {{ `(${interaction.refs.length + getPathwayRefCount(vInteraction.side2Material._id)})` }}
                                </span>
                            </span>
                        </div>
                    </template>
                    <template #content>
                        <div v-if="!link" class="summary-container">
                            <h3 class="font-bold">Summary</h3>
                            <long-txt
                                :txt="vInteraction.summary"
                                :maxChars="250"
                                :expandable="false"
                                :overflowSymb="getInteractionLink(vInteraction)"
                                isHTML
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
            </component>
        </div>
        <img
            v-if="isLoading"
            :src="require('@/client/assets/icons/loader.gif')"
            alt="Loader"
        />
    </section>
</template>

<script>
import { interactionService } from '@/cms/services/interaction.service';

import Collapse from '@/client/cmps/common/Collapse';
import LongTxt from '@/client/cmps/common/LongTxt';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';

import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';
import MinusIcon from 'vue-material-design-icons/Minus';

export default {
    props: {
        interaction: {
            type: Object,
            required: true
        },
        material: {
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
        },
        link: {
            type: Boolean,
            default: false
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
        },
        vInteractionHeaderEl() {
            return this.link ? 'router-link' : 'span';
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
            this.relatedMaterials = relatedMaterials;
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
                        summary: interaction.summary,
                        atcParentGroups: atcPaths.map((atcPath) => atcPath.filter((path, idx) => idx === 3)).flat(1),
                    };
                }
            );
            this.isLoading = false;
        },
        getInteractionLink(interaction) {
            const url = `/interaction/${interaction._id}/${interaction.side2Material._id}`;
            return `.
                <a class="interaction-link" href="${url}">
                    Read more...
                </a>
            `;
        },
        getGroupName(groupName) {
            return `${this.interaction.side1Material.name} & ${groupName}`;
        },
        getPathwayRefCount(materialId) {
            const { pathways } = this.relatedMaterials.find(m => m._id === materialId);
            const side2Pathways = pathways.reduce((acc, pathway) => {
                if (
                    ((pathway.type === 'enzyme' || pathway.type === 'transporter') &&
                    (pathway.actions.includes('substrate') || pathway.actions.includes('binder')))
                    ||
                    (pathway.type === 'carrier' &&
                    (!pathway.actions.includes('inducer') && !pathway.actions.includes('inhibitor')))
                ) {
                    acc.push(pathway)
                }

                return acc;
            }, []);
            const seenRefsMap = {};
            const side2Refs = side2Pathways.reduce((acc, pathway) => {
                pathway.references.forEach(ref => {
                        if (!seenRefsMap[ref]) {
                            acc.push(ref);
                            seenRefsMap[ref] = true;
                        }
                    });
                return acc;
            }, []);
            const side2PathwayRefs = this.material.pathways.reduce((acc, pathway) => {
                const idx = side2Pathways.findIndex(side2Pathway => side2Pathway.name.replace('CYP', '').toUpperCase() === pathway.name.replace('CYP', '').toUpperCase());
                if (idx !== -1) {
                    const refs = interactionService.getRefsOrder(pathway.influence);
                    refs.forEach(ref => {
                        if (!seenRefsMap[ref]) {
                            if (!this.interaction.refs.includes(ref)) {
                                acc.push(ref);
                            }
                            seenRefsMap[ref] = true;
                        }
                    });
                }
                return acc;
            }, []);
            
            return side2Refs.length + side2PathwayRefs.length;
        }
    },
    created() {
        this.getRelatedMaterials();
    },
    components: {
        Collapse,
        InteractionCapsules,
        ChevronUpIcon,
        LongTxt,
        ChevronDownIcon,
        MinusIcon
    }
}
</script>

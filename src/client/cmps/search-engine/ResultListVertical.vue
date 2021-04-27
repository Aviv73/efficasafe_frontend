<template>
    <section class="vertical-list">
        <div v-if="lists">
                <header class="vertical-list-header">
                <div class="flex-center">
                    <interaction-icon
                        class="interaction-icon"
                        :color="getInteractionColor('avoid coadministration')"
                    />
                    Avoid
                    <span
                        class="count"
                        v-if="lists.reds.total"
                    >
                        ({{ lists.reds.total }})
                    </span>
                </div>
                <div class="flex-center">
                    <interaction-icon
                        class="interaction-icon"
                        :color="getInteractionColor('caution should be taken')"
                    />
                    Require caution
                    <span
                        class="count"
                        v-if="lists.yellows.total"
                    >
                        ({{ lists.yellows.total }})
                    </span>
                </div>
                <div class="flex-center">
                    <interaction-icon
                        class="interaction-icon"
                        :color="getInteractionColor('coadministration is possible')"
                    />
                    Synergistic
                    <span
                        class="count"
                        v-if="lists.greens.total"
                    >
                        ({{ lists.greens.total }})
                    </span>
                </div>
            </header>
            <main
                class="vertical-list-lists"
            >
                <ul>
                    <li
                        v-for="interaction in lists.reds[interactions]"
                        :key="interaction._id"
                    >   
                        <interaction-capsules
                            :title="interaction.evidenceLevel || interaction.evidence_level"
                            :name="getInteractionName(interaction)"
                            :color="getInteractionColor('avoid coadministration')"
                            :vInteractionCount="0"
                            :showDraftName="false"
                            localize
                            dense
                        />
                    </li>
                </ul>
                <ul>
                    <li
                        v-for="interaction in lists.yellows[interactions]"
                        :key="interaction._id"
                    >
                        <interaction-capsules
                            :title="interaction.evidenceLevel || interaction.evidence_level"
                            :name="getInteractionName(interaction)"
                            :color="getInteractionColor('caution should be taken')"
                            :vInteractionCount="0"
                            :showDraftName="false"
                            localize
                            dense
                        />
                    </li>
                </ul>
                <ul>
                    <li
                        v-for="interaction in lists.greens[interactions]"
                        :key="interaction._id"
                    >
                        <interaction-capsules
                            :title="interaction.evidenceLevel || interaction.evidence_level"
                            :name="getInteractionName(interaction)"
                            :color="getInteractionColor('coadministration is possible')"
                            :vInteractionCount="0"
                            :showDraftName="false"
                            localize
                            dense
                        />
                    </li>
                </ul>
            </main>
        </div>
        <div v-else>Loading...</div>
    </section>
</template>

<script>
import { interactionService } from '@/cms/services/interaction.service';

import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';
import InteractionIcon from '@/client/cmps/common/icons/InteractionIcon';

export default {
    props: {
        materials: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            lists: null,
            isLoading: false
        }
    },
    computed: {
        interactions() {
            return (this.$route.name === 'Drug2Drug') ? 'dBankInteractions' : 'interactions';
        }
    },
    methods: {
        async getInteractions(filterBy) {
            this.isLoading = true;
            const lists = await this.$store.dispatch({ type: 'getInteractions', filterBy });
            this.lists = lists;
            this.isLoading = false;
        },
        async getDBankInteractions(criteria) {
            this.isLoading = true;
            const lists = await this.$store.dispatch({ type: 'getDBankInteractions', criteria });
            this.lists = lists;
            this.isLoading = false;
        },
        getInteractionName(interaction) {
            if (interaction.name) return interaction.name;
            if (interaction.side2Material) return `${interaction.side1Material.name} & ${interaction.side2Material.name}`;
            if (interaction.side2Label) return `${interaction.side2Label.name}`;
        },
        getInteractionColor(recommendation) {
            return interactionService.getInteractionColor(recommendation);
        }
    },
    created() {
        switch (this.$route.name) {
            case 'Drug2Drug': {
                const drugBankIds = this.materials.map(mat => mat.drugBankId);
                const drugBankId = (drugBankIds.length === 1) ? drugBankIds[0] : drugBankIds;
                const criteria = { drugBankId, page: 0, isMultiList: true };
                this.getDBankInteractions(criteria);
            }
            break;
            default: {
                const ids = this.materials.reduce((acc, { _id, labels }) => {
                    if (!acc.includes(_id)) acc.push(_id);
                    labels.forEach(label => {
                        if (!acc.includes(label._id)) acc.push(label._id);
                    });
                    return acc;
                }, []);
                const filterBy = {
                    isSearchResults: true,
                    page: 0,
                    id: ids,
                    materialCount: this.materials.filter(({ isIncluded }) => !isIncluded).length,
                    isMultiList: true
                };
                this.getInteractions(filterBy);
            }
            break;
        }
    },
    components: {
        InteractionIcon,
        InteractionCapsules
    }
}
</script>
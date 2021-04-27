<template>
    <section class="vertical-list">
        <header class="vertical-list-header">
            <div class="flex-center">
                <interaction-icon
                    class="interaction-icon"
                    :color="getInteractionColor('avoid coadministration')"
                />
                Avoid
            </div>
            <div class="flex-center">
                <interaction-icon
                    class="interaction-icon"
                    :color="getInteractionColor('caution should be taken')"
                />
                Require caution
            </div>
            <div class="flex-center">
                <interaction-icon
                    class="interaction-icon"
                    :color="getInteractionColor('coadministration is possible')"
                />
                Synergistic
            </div>
        </header>
    </section>
</template>

<script>
import { interactionService } from '@/cms/services/interaction.service';

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
            dBankLists: null,
            lists: null,
            isLoading: false
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
            this.dBankLists = lists;
            this.isLoading = false;
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
        InteractionIcon
    }
}
</script>
<template>
    <section class="positive-interaction-inner-list">
        <interaction-preview
            v-for="interaction in interactions"
            :key="interaction._id"
            :interaction="interaction"
            :materials="materials"
            is-child
            link
        />
    </section>
</template>

<script>
export default {
    name: 'PositiveInteractionInnerList',
    props: {
        side1Id: {
            type: String,
            required: true
        },
        materials: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            interactions: []
        }
    },
    computed: {
        materialIds() {
            return this.materials.reduce((acc, material) => {
                if (material.type !== 'drug') return acc;
                const ids = [ material._id, ...material.labels.map(l => l._id) ];
                ids.forEach(id => {
                    if (!acc.includes(id)) acc.push(id);
                });
                return acc;
            }, []);
        }
    },
    methods: {
        async getInteractions() {
            const filterBy = {
                isSearchResults: true,
                id: [ this.side1Id, ...this.materialIds ],
                page: 0,
                limit: Number.MAX_SAFE_INTEGER,
                materialCount: this.materialIds.length + 1,
                recommendation: 'positives'
            };
            const { interactions } = await this.$store.dispatch({ type: 'getInteractions', filterBy });
            this.interactions = this.formatInteractions(interactions);
        },
        formatInteractions(interactions) {
            interactions.forEach(interaction => {
                if (interaction.side2Label) {
                    const { _id, name, type } = this.materials.find(m => m.labels.some(l => l._id === interaction.side2Label._id));
                    interaction.side2Material = {
                        _id,
                        name,
                        type
                    };
                    interaction.side2Label = null;
                    interaction.isVirtual = true;
                }
            });
            return interactions;
        }
    },
    created() {
        this.getInteractions();
    },
    components: {
        InteractionPreview: () => import('./InteractionPreview')
    }
}
</script>
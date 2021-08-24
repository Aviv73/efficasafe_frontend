<template>
    <section class="positive-interaction-inner-list">
        <interaction-preview
            v-for="(interaction, idx) in interactions"
            :key="interaction._id"
            :interaction="interaction"
            :materials="materials"
            :idx="idx"
            :exactName="exactName"
            is-child
            is-positive
            link
        />
    </section>
</template>

<script>
import { interactionUIService } from '@/cms/services/interaction-ui.service';

export default {
    recommendationMap: interactionUIService.getRecommendationOrderMap(),
    name: 'PositiveInteractionInnerList',
    props: {
        side1Id: {
            type: String,
            required: true
        },
        side2Id: {
            type: String,
            required: true
        },
        mainSide2MaterialId: {
            type: String,
            required: true
        },
        materials: {
            type: Array,
            required: true
        },
        exactName: {
            type: String,
            required: false
        },
        isSupp: {
            type: Boolean,
            default: false
        },
        groupIdx: {
            type: Number,
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
        },
        materialSuppIds() {
            let materialsIds =  this.materials.reduce((acc, material) => {
                const ids = [ material._id, ...material.labels.map(l => l._id) ];
                ids.forEach(id => {
                    if (!acc.includes(id)) acc.push(id);
                });
                return acc;
            }, []);
            return materialsIds
        }
    },
    methods: {
        async getInteractions() {
            const filterBy = {
                isSearchResults: true,
                id: [ this.side1Id, ...this.materialIds ],
                page: 0,
                limit: Number.MAX_SAFE_INTEGER,
                materialCount: this.materialIds.length + 1
            };
            let { interactions } = await this.$store.dispatch({ type: 'getInteractions', filterBy });
            this.interactions = this.formatInteractions(interactions);
        },
        async getSuppInteractions() {
            const ids = {
                side1Id: this.side1Id,
                side2Id: this.side2Id,
                mainSide2MaterialId: this.mainSide2MaterialId
            }
            const idCountMap = Object.values(ids).reduce((acc, id) => {
                if(!acc[id]) acc[id] = 0
                acc[id]++ 
                return acc
            }, {})
            const idToCompare = Object.keys(idCountMap).find(key => idCountMap[key] === 1)
            const filterBy = {
                isSearchResults: true,
                id: [...this.materialSuppIds, idToCompare],
                page: 0,
                limit: Number.MAX_SAFE_INTEGER,
                materialCount: this.materialIds.length + 1
            };
            let { interactions } = await this.$store.dispatch({ type: 'getInteractions', filterBy });
            interactions = interactions.filter(interaction => interaction.side1Material._id === idToCompare || interaction.side2Material?._id === idToCompare)
            const redInteractions = interactions.filter( ({recommendation})=> {
                return interactionUIService.getIsRed(recommendation)
            })
            if(redInteractions.length){
                this.$emit('remove', this.groupIdx)
            }else{
                this.interactions = this.formatInteractions(interactions);
            }
            this.$emit('groupDone')
        },
        formatInteractions(interactions) {
            const { recommendationMap: map } = this.$options;
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
                    interaction.name = `${interaction.side1Material.name} & ${interaction.side2Material.name}`;
                }
            });
            const seenVinteractionsMap = {};
            interactions.forEach(interaction => {
                const side1Queries = this.$store.getters.materialNamesMap[interaction.side1Material.name];
                    const side1Name = side1Queries ? side1Queries[0] : interaction.side1Material.name;
                    if (interaction.side2Material) {
                        // const userQuery = this.$store.getters.materialNamesMap[interaction.side2Material.name];
                        // const interactionName = `${side1Name} & ${userQuery ? userQuery[0] : interaction.side2Material.name}`;
                        const interactionName = `${side1Name} & ${interaction.side2Material.name}`;
                        if (!seenVinteractionsMap[interactionName]) seenVinteractionsMap[interactionName] = [ interaction ];
                        else seenVinteractionsMap[interactionName].push(interaction);
                    } else {
                        const matchingMaterial = this.materials.find(m => m.labels.some(l => l._id === interaction.side2Label._id));
                        
                        const userQueries = this.$store.getters.materialNamesMap[matchingMaterial.name];
                        const side2Name = userQueries ? userQueries[0] : matchingMaterial.name;
                        const interactionName = `${side1Name} & ${side2Name}`;
                        if (!seenVinteractionsMap[interactionName]) seenVinteractionsMap[interactionName] = [ interaction ];
                        else seenVinteractionsMap[interactionName].push(interaction);
                    }
            });
            Object.values(seenVinteractionsMap).forEach(seenInteractions => {
                if (seenInteractions.length <= 1) return;
                const leadInteraction = this.getMoreSeverInteraction(seenInteractions);
                seenInteractions = seenInteractions.filter(i => i._id !== leadInteraction._id);
                seenInteractions.forEach(({ _id }) => {
                    interactions = interactions.filter(i => i._id !== _id);
                });
            });
            interactions.sort((a, b) => {
                return (map[b.recommendation] - map[a.recommendation]) * -1 ||
                (a.evidenceLevel.toLowerCase().localeCompare(b.evidenceLevel.toLowerCase())) ||
                (a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            });
            const mainInteractionIdx = interactions.findIndex(i => i.side2Material._id === this.mainSide2MaterialId);
            if (mainInteractionIdx > 0) {
                const [ mainInteraction ] = interactions.splice(mainInteractionIdx, 1);
                interactions.unshift(mainInteraction);
            }
            return interactions;
        },
        getMoreSeverInteraction(interactions) {
            const map = interactionUIService.getRecommendationOrderMap();
            interactions.slice().sort((a, b) => {
                return (map[a.recommendation.toLowerCase()] > map[b.recommendation.toLowerCase()]) ? -1 : (map[a.recommendation.toLowerCase()] < map[b.recommendation.toLowerCase()]) ? 1 : 0;
            });
            return interactions[0];
        }
    },
    created() {
        if(this.isSupp){
            this.getSuppInteractions()
        }else{
            this.getInteractions();
        }
    },
    components: {
        InteractionPreview: () => import('./InteractionPreview')
    }
}
</script>
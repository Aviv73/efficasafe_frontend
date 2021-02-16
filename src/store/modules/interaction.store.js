import { interactionService } from '@/services/interaction.service';

export const interactionStore = ({
    state: {
        interactions: null,
        interactionCount: 0
    },
    getters: {
        interactions(state) {
            return state.interactions;
        },
        interaction: (state) => (id) => {
            return state.interactions && state.interactions.find(currInteraction => currInteraction._id === id);
        },
        interactionCount(state) {
            return state.interactionCount;
        }
    },
    mutations: {
        setInteractions(state, { interactions }) {
            state.interactions = interactions;
        },
        addInteraction(state, { interaction }) {
            if (state.interactions) {
                state.interactions.unshift(interaction);
            }
        },
        updateInteraction(state, { interaction }) {
            if (!state.interactions) return;
            const idx = state.interactions.findIndex(currInteraction => currInteraction._id === interaction._id);
            if (idx !== -1) {
                state.interactions.splice(idx, 1, interaction);
            }
        },
        removeInteraction(state, { intId }) {
            const idx = state.interactions.findIndex(currInteraction => currInteraction._id === intId);
            state.interactions.splice(idx, 1);
        },
        setInteractionCount(state, { total }) {
            state.interactionCount = total;
        }
    },
    actions: {
        async loadInteractions(context, { filterBy }) {
            const { interactions, total } = await interactionService.list(filterBy);
            context.commit({ type: 'setInteractions', interactions });
            context.commit({ type: 'setInteractionCount', total });
            return interactions;
        },
        async getInteractions(context, { filterBy }) {
            const { interactions, pageCount } = await interactionService.list(filterBy);
            return { interactions, pageCount };
        },
        async loadInteraction(context, { intId }) {
            return await interactionService.getById(intId);
        },
        async saveInteraction(context, { interaction }) {
            const isEdit = !!interaction._id;
            const savedInteraction = await interactionService.save(interaction);
            context.commit({
                type: (isEdit) ? 'updateInteraction' : 'addInteraction',
                interaction: savedInteraction
            });
            return savedInteraction;
        },
        async restoreInteraction(context, { interaction }) {
            return await interactionService.restore(interaction);
        },
        async removeInteraction(context, { intId }) {
            await interactionService.remove(intId);
            context.commit({
                type: 'removeInteraction',
                intId
            });
        }
    }
})
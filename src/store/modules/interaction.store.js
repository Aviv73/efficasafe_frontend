import { interactionService } from '@/services/interaction.service';

export const interactionStore = ({
    state: {
        interactions: null
    },
    getters: {
        interactions(state) {
            return state.interactions;
        }
    },
    mutations: {
        setInteractions(state, { interactions }) {
            state.interactions = interactions;
        },
        addInteraction(state, { interaction }) {
            state.interactions.unshift(interaction);
        },
        updateInteraction(state, { interaction }) {
            const idx = state.interactions.findIndex(currInteraction => currInteraction._id === interaction._id);
            if (idx !== -1) {
                state.interactions.splice(idx, 1, interaction);
            }
        },
        removeInteraction(state, { intId }) {
            const idx = state.interactions.findIndex(currInteraction => currInteraction._id === intId);
            state.interactions.splice(idx, 1);
        },
    },
    actions: {
        async loadInteractions(context, { filterBy }) {
            const interactions = await interactionService.list(filterBy);
            context.commit({ type: 'setInteractions', interactions });
            return interactions;
        },
        async loadInteraction(context, { intId }) {
            const int = await interactionService.getById(intId);
            return int;
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
        async removeInteraction(context, { intId }) {
            await interactionService.remove(intId);
            context.commit({
                type: "removeInteraction",
                intId
            });
        }
    }
})
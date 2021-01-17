import { featuredInteractionService } from '@/services/featured-interaction.service';

export const featuredInteractionStore = {
    state: {
        featuredInteractions: [],
        featuredInteractionCount: 0
    },
    getters: {
        featuredInteractions(state) {
            return state.featuredInteractions;
        },
        featuredInteractionCount(state) {
            return state.featuredInteractionCount;
        }
    },
    mutations: {
        setFeaturedInteractions(state, { featuredInteractions }) {
            state.featuredInteractions = featuredInteractions;
        },
        setFeaturedInteractionsCount(state, { total }) {
            state.featuredInteractionCount = total;
        }
    },
    actions: {
        async loadFeaturedInteractions(context, { filterBy }) {
            const { featuredInteractions, total } = await featuredInteractionService.list(filterBy);
            context.commit({ type: 'setFeaturedInteractions', featuredInteractions });
            context.commit({ type: 'setFeaturedInteractionsCount', total });
        }
    }
}
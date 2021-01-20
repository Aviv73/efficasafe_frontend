import { featuredInteractionService } from '@/services/featured-interaction.service';

export const featuredInteractionStore = {
    state: {
        featuredInteractionGroups: [],
        featuredGroupsCount: 0
    },
    getters: {
        featuredInteractionGroups(state) {
            return state.featuredInteractionGroups;
        },
        featuredGroupsCount(state) {
            return state.featuredGroupsCount;
        }
    },
    mutations: {
        setFeaturedInteractionGroups(state, { groups }) {
            state.featuredInteractionGroups = groups;
        },
        setFeaturedGroupsCount(state, { total }) {
            state.featuredGroupsCount = total;
        }
    },
    actions: {
        async loadFeaturedInteractionGroups(context, { filterBy }) {
            const { groups, total } = await featuredInteractionService.list(filterBy);
            context.commit({ type: 'setFeaturedInteractionGroups', groups });
            context.commit({ type: 'setFeaturedGroupsCount', total });
        },
        async getFeaturedInteractions(context, { filterBy }) {
            return await featuredInteractionService.list(filterBy);
        },
        async getFeaturedInteraction(context, { id }) {
            return await featuredInteractionService.getById(id);
        },
        async getFeaturedInteractionGroups(context, { filterBy }) {
            const { groups } = await featuredInteractionService.list(filterBy);
            return groups;
        },
        async updateFeaturedInteractions(context, { filterBy }) {
            await featuredInteractionService.updateMany(filterBy);
        },
        async removeFaeturedInteractions(context, { filterBy }) {
            await featuredInteractionService.removeMany(filterBy);
        }
    }
}
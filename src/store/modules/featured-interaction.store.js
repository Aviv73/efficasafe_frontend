import { featuredInteractionService } from '@/services/featured-interaction.service';

export const featuredInteractionStore = {
    state: {
        featuredInteractionGroups: [],
        featuredInteractions: [],
        featuredGroupsCount: 0
    },
    getters: {
        featuredInteractionGroups(state) {
            return state.featuredInteractionGroups;
        },
        featuredInteractions(state) {
            return state.featuredInteractions;
        },
        featuredGroupsCount(state) {
            return state.featuredGroupsCount;
        }
    },
    mutations: {
        setFeaturedInteractions(state, { featuredInteractions }) {
            state.featuredInteractions = featuredInteractions;
        },
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
        async getFeaturedInteractionGroups(context, { filterBy }) {
            const { groups } = await featuredInteractionService.list(filterBy);
            return groups;
        }
    }
}
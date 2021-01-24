import { featuredInteractionService } from '@/services/featured-interaction.service';

export const featuredInteractionStore = {
    state: {
        featuredInteractionGroups: [],
        featuredGroupsCount: 0,
        expandedGroups: null
        // filterBy: {
        //     isGroups: false,
        //     drugBankId: '',
        //     limit: 15,
        //     page: 0,
        //     sortBy: 'affected_drug.name',
        //     isDesc: false,
        //     side2Name: '',
        //     summary: '',
        //     extended_description: '',
        //     isStartsWith: true,
        //     operator: ''
        // }
    },
    getters: {
        expandedGroups(state) {
            return state.expandedGroups;
        },
        featuredInteractionGroups(state) {
            return state.featuredInteractionGroups;
        },
        featuredGroupsCount(state) {
            return state.featuredGroupsCount;
        }
    },
    mutations: {
        setExpandedGroups(state, { groups }) {
            state.expandedGroups = groups;
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
        async updateFeaturedInteraction(context, { interaction }) {
            return await featuredInteractionService.update(interaction);
        },
        async removeFaeturedInteractions(context, { filterBy }) {
            await featuredInteractionService.removeMany(filterBy);
        }
    }
}
import { featuredInteractionService } from '@/cms/services/featured-interaction.service';

export const featuredInteractionStore = {
    state: {
        featuredInteractionGroups: [],
        featuredGroupsCount: 0,
        expandedGroups: null,
        lastFilterBy: null,
        prevState: null,
        height: null
    },
    getters: {
        prevState(state) {
            return state.prevState;
        },
        lastFilterBy(state) {
            return state.lastFilterBy;
        },
        expandedGroups(state) {
            return state.expandedGroups;
        },
        featuredInteractionGroups(state) {
            return state.featuredInteractionGroups;
        },
        featuredGroupsCount(state) {
            return state.featuredGroupsCount;
        },
        getHeight(state){
            return state.height
        }
    },
    mutations: {
        setPrevState(state, { prevState }) {
            state.prevState = prevState;
        },
        setLastFilterBy(state, { filterBy }) {
            state.lastFilterBy = filterBy;
        },
        setExpandedGroups(state, { groups }) {
            state.expandedGroups = groups;
        },
        setFeaturedInteractionGroups(state, { groups }) {
            state.featuredInteractionGroups = groups;
        },
        setFeaturedGroupsCount(state, { total }) {
            state.featuredGroupsCount = total;
        },
        setFeaturedHeight(state, {height}){
            state.height = height
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
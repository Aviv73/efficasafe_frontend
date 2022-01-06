import { interactionService } from '@/cms/services/interaction.service';

export const interactionStore = ({
    state: {
        interactions: null,
        interactionCount: 0,
        supplementsRefs: [],
        seenRefsMap: {},
        pathwayRefCount:{},
        openCollapses: {
            'Results': {},
            'Boosters': {},
            'suppBoosters': {}
        },
        isPosSuppOpen: false,
        firstInteractionSide: 1,
        redPositiveSupp: [],
        sortBy:['recommendation', true],
        interactionPageHeight: null,
        listType: 'all',
        interactionListHight: null
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
        },
        supplementsRefs(state) {
            return state.supplementsRefs;
        },
        openCollapses(state) {
            return state.openCollapses;
        },
        firstInteractionSide(state) {
            return state.firstInteractionSide;
        },
        InteractionSort(state) {
            return state.sortBy;
        },
        getRedPositiveSupp(state){
            return state.redPositiveSupp
        },
        getIsPosSuppOpen(state){
            return state.isPosSuppOpen
        },
        getPathwayRefCount(state){
            return state.pathwayRefCount
        },
        getInteractionPageHeight(state){
            return state.interactionPageHeight
        },
        getListType(state){
            return state.listType
        },
        getInteractionListHight(state){
            return state.interactionListHight
        }
    },
    mutations: {
        setInteractionListHight(state, { hight }){
            state.interactionListHight = hight
        },
        resetInteractionListHight(state){
            state.interactionListHight = null
        },
        setSortBy(state, { newSort }) {
            state.sortBy = newSort
        },
        setFirstInteractionSide(state, { side }) {
            state.firstInteractionSide = side;
        },
        setOpenCollapses(state, { openCollapses, routeName }) {
            state.openCollapses[routeName] = openCollapses;
        },
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
        removeInteractions(state, { ids }) {
            state.interactions = state.interactions.filter(interaction => {
                return !ids.includes(interaction._id);
            });
        },
        setInteractionCount(state, { total }) {
            state.interactionCount = total;
        },
        updateSupplementsRefs(state, { refs }) {
            refs.forEach(ref => {
                if (!state.seenRefsMap[ref + '']) {
                    state.supplementsRefs.push(ref);
                    state.seenRefsMap[ref + ''] = true;
                }
            });
        },
        resetSupplementsRefs(state) {
            state.supplementsRefs = [];
        },
        resetRedPositiveSupp(state) {
            state.redPositiveSupp = [];
        },
        setRedPositiveSupp(state, {redIds}) {
            state.redPositiveSupp = redIds
        },
        setIsPosSuppOpen(state){
            state.isPosSuppOpen = !state.isPosSuppOpen
        },
        setPathwayRefCount(state, {data}){
            state.pathwayRefCount[data.id] = data.count
        },
        setInteractionHeight(state, {interactionPageHeight}){
            state.interactionPageHeight = interactionPageHeight
        },
        setListType(state, {listType}){
            state.listType = listType
        }
    },
    actions: {
        async loadInteractions(context, { filterBy }) {
            const { interactions, total } = await interactionService.list(filterBy);
            context.commit({ type: 'setInteractions', interactions });
            context.commit({ type: 'setInteractionCount', total });
            return interactions;
        },
        async getInteractions(context, { filterBy, cacheKey }) {
            return await interactionService.list(filterBy, cacheKey);
        },
        async loadInteraction(context, { id }) {
            return await interactionService.getById(id);
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
        },
        async removeInteractions(context, { ids }) {
            await interactionService.removeMany(ids);
            context.commit({ type: 'removeInteractions', ids });
        }
    }
})
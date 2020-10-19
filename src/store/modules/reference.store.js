import { referenceService } from '@/services/reference.service';

export const referenceStore = ({
    state: {
        references: null
    },
    getters: {
        references(state) {
            return state.references;
        }
    },
    mutations: {
        setReferences(state, { references }) {
            state.references = references;
        }
    },
    actions: {
        async loadReferences(context, { refIds }) {
            const references = await referenceService.list({ refIds });
            context.commit({ type: 'setReferences', references });
            return references;
        }
    }
})
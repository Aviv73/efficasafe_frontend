import { referenceService } from '@/services/reference.service'

export const referenceStore = ({
    state: {
        references: null
    },
    getters: {
        references(state) {
            return state.references
        }
    },
    mutations: {
    },
    actions: {
        async saveReferences(context, { references }) {
            const savedReferences = await referenceService.saveReferences(references)
            try {
                return savedReferences
            } catch (err) {
                console.log('ERROR:', err)
            }
        }
    }
})
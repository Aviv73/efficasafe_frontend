import { archiveService } from '@/services/archive.service'

export const archiveStore = ({
    state: {
        archiveMaterials: null,
        archiveLabels: null,
        archiveInteractions: null,
    },
    getters: {
        archiveMaterials(state) {
            return state.archiveMaterials
        },
        archiveLabels(state) {
            return state.archiveLabels
        },
        archiveInteractions(state) {
            return state.archiveInteractions
        },
    },
    mutations: {
        setArchiveMaterials(state, { materials }) {
            state.archiveMaterials = materials
        },
        setArchiveLabels(state, { labels }) {
            state.archiveLabels = labels
        },
        setArchiveInteractions(state, { interactions }) {
            state.archiveInteractions = interactions
        },
        removeMaterialFromArchive(state, { matId }) {
            const idx = state.archiveMaterials.findIndex(currMaterial => currMaterial._id === matId)
            state.archiveMaterials.splice(idx, 1)
        },
        removeLabelFromArchive(state, { labelId }) {
            const idx = state.archiveLabels.findIndex(currLabel => currLabel._id === labelId)
            state.archiveLabels.splice(idx, 1)
        },
        removeInteractionFromArchive(state, { intId }) {
            const idx = state.archiveInteractions.findIndex(currInteraction => currInteraction._id === intId)
            state.archiveInteractions.splice(idx, 1)
        },
    },
    actions: {
        async loadArchiveMaterials(context, { filterBy }) {
            const materials = await archiveService.archiveMaterialList(filterBy)
            context.commit({ type: 'setArchiveMaterials', materials })
            return materials
        },
        async loadArchiveLabels(context, { filterBy }) {
            const labels = await archiveService.archiveLabelList(filterBy)
            context.commit({ type: 'setArchiveLabels', labels })
            return labels
        },
        async loadArchiveInteractions(context, { filterBy }) {
            const interactions = await archiveService.archiveInteractionList(filterBy)
            context.commit({ type: 'setArchiveInteractions', interactions })
            return interactions
        },
        async restoreMaterial(context, { material }) {
            const isRestored = await archiveService.restoreMaterial(material)
            return isRestored
        },
        async restoreLabel(context, { label }) {
            const isRestored = await archiveService.restoreLabel(label)
            return isRestored
        },
        async restoreInteraction(context, { interaction }) {
            const isRestored = await archiveService.restoreInteraction(interaction)
            return isRestored
        },
        async removeMaterialFromArchive(context, { matId }) {
            const isRemoved = await archiveService.removeMaterial(matId)
            try {
                context.commit({
                    type: 'removeMaterialFromArchive',
                    matId
                })
                return isRemoved
            } catch (err) {
                console.log('ERROR', err)
            }
        },
        async removeLabelFromArchive(context, { labelId }) {
            const isRemoved = await archiveService.removeLabel(labelId)
            try {
                context.commit({
                    type: 'removeLabelFromArchive',
                    labelId
                })
                return isRemoved
            } catch (err) {
                console.log('ERROR', err)
            }
        },
        async removeInteractionFromArchive(context, { intId }) {
            const isRemoved = await archiveService.removeInteraction(intId)
            try {
                context.commit({
                    type: 'removeInteractionFromArchive',
                    intId
                })
                return isRemoved
            } catch (err) {
                console.log('ERROR', err)
            }
        },
        async loadArchiveMaterial(context, { matId }) {
            const material = await archiveService.getMatrialById(matId)
            return material
        },
        async loadArchiveLabel(context, { labelId }) {
            const label = await archiveService.getLabelById(labelId)
            return label
        },
        async loadArchiveInteraction(context, { intId }) {
            const interaction = await archiveService.getInteractionById(intId)
            return interaction
        },
        async saveMaterialToArchive(context, { material }) {
            let savedMaterial = await archiveService.saveMaterialToArchive(material)
            try {
                return savedMaterial
            } catch {
                return null;
            }
        },
        async saveLabelToArchive(context, { label }) {
            await archiveService.saveLabelToArchive(label)
        },
        async saveInteractionToArchive(context, { interaction }) {
            await archiveService.saveInteractionToArchive(interaction)
        },
    }
})
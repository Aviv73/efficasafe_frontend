import { labelService } from '@/services/label.service'

export const labelStore = ({
    state: {
        labels: null,
    },
    getters: {
        labels(state) {
            return state.labels
        },
    },
    mutations: {
        setLabels(state, { labels }) {
            state.labels = labels
        },
        removeLabel(state, { labelId }) {
            const idx = state.labels.findIndex(currLabel => currLabel._id === labelId)
            state.labels.splice(idx, 1)
        },
    },
    actions: {
        async loadLabels(context, { filterBy }) {
            const labels = await labelService.list(filterBy)
            context.commit({ type: 'setLabels', labels })
            return labels
        },
        async loadLabel(context, { labelId }) {
            const label = await labelService.getById(labelId)
            return label
        },
        async saveLabel(context, { label }) {
            const newlabel = await labelService.save(label)
            return newlabel
        },
        async removeLabel(context, { labelId }) {
            await labelService.remove(labelId)
            context.commit({
                type: "removeLabel",
                labelId
            })
        },
        async getLabelPaths(context, { selectedPaths }) {
            const labelPaths = await labelService.getLabelPaths(selectedPaths)
            return labelPaths
        }
    }
})
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
            const labels = await labelService.list(filterBy);
            context.commit({ type: 'setLabels', labels });
            return labels;
        },
        async loadLabel(context, { labelId }) {
            return await labelService.getById(labelId);
        },
        async saveLabel(context, { label }) {
            return await labelService.save(label);
        },
        async removeLabel(context, { labelId }) {
            await labelService.remove(labelId);
            context.commit({
                type: "removeLabel",
                labelId
            });
        },
        async getLabelPaths(context, { selectedPaths }) {
            return await labelService.getLabelPaths(selectedPaths);
        }
    }
})
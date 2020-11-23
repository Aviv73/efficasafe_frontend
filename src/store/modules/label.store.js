import { labelService } from '@/services/label.service'

export const labelStore = ({
    state: {
        labels: null,
    },
    getters: {
        labels(state) {
            return state.labels;
        }
    },
    mutations: {
        setLabels(state, { labels }) {
            state.labels = labels;
        },
        addLabel(state, { label }) {
            state.labels.unshift(label);
        },
        removeLabel(state, { labelId }) {
            const idx = state.labels.findIndex(currLabel => currLabel._id === labelId);
            state.labels.splice(idx, 1);
        },
        updateLabel(state, { label }) {
            const idx = state.labels.findIndex(currLabel => currLabel._id === label._id);
            state.labels.splice(idx, 1, label);
        }
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
            const isEdit = !!label._id;
            const savedLabel = await labelService.save(label);
            context.commit({
                type: (isEdit) ? 'updateLabel' : 'addLabel',
                label: savedLabel
            });
            return savedLabel;
        },
        async restoreLabel(context, { label }) {
            return await labelService.restore(label);
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
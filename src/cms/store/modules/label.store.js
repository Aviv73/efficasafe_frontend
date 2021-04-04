import { labelService } from '@/cms/services/label.service'

export const labelStore = ({
    state: {
        labels: null,
        labelsCount: 0
    },
    getters: {
        labels(state) {
            return state.labels;
        },
        labelsCount(state) {
            return state.labelsCount;
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

        removeLabels(state, { ids }) {
            state.labels = state.labels.filter(label => {
                return !ids.includes(label._id);
            });
        },
        updateLabel(state, { label }) {
            const idx = state.labels.findIndex(currLabel => currLabel._id === label._id);
            state.labels.splice(idx, 1, label);
        },
        setLabelCount(state, { total }) {
            state.labelsCount = total;
        }  
    },
    actions: {
        async loadLabels(context, { filterBy }) {
            const { labels, total } = await labelService.list(filterBy);
            context.commit({ type: 'setLabels', labels });
            context.commit({ type: 'setLabelCount', total });
            return labels;
        },
        async getLabels(context, { criteria }) {
            const { labels } = await labelService.list(criteria);
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
        async removeLabels(context, { ids }) {
            await labelService.removeMany(ids);
            context.commit({ type: 'removeLabels', ids });
        },
        async getLabelPaths(context, { selectedPaths }) {
            return await labelService.getLabelPaths(selectedPaths);
        }
    }
})
import { atcService } from '@/services/atc.service'

export const atcStore = ({
    state: {
        atcLabels: null
    },
    getters: {
        atcLabels(state) {
            return state.atcLabels;
        }
    },
    mutations: {
        setAtcLabels(state, { atcLabels }) {
            state.atcLabels = atcLabels;
        }
    },
    actions: {
        async loadAtcLabels(context) {
            const atcLabels = await atcService.list();
            context.commit({ type: 'setAtcLabels', atcLabels });
            return atcLabels;
        },
        async loadAtcLabel(context, { labelId }) {
            return await atcService.getById(labelId);
        }
    }
})
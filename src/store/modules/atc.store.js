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
            const atcLabels = await atcService.query();
            context.commit({ type: 'setAtcLabels', atcLabels });
            return atcLabels;
        }
    }
})
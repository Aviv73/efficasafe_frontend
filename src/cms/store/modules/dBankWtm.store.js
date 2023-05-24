import { dBankWtmService } from '@/cms/services/dBankWtm.service';

export const dBankWtmStore = {
    state: {
      dbankWtmsData: { items: [], total: 0 },
    },
    getters: {
        dBankWtmsData(state) {
            return state.dbankWtmsData;
        },
        dBankWtms(state) {
            return state.dbankWtmsData.items;
        },
    },
    mutations: {
        setDBankWtmsData(state, { dbankWtmsData }) {
            state.dbankWtmsData = dbankWtmsData;
        },
    },
    actions: {
        async loadDBankWtms(context, { filterBy }) {
            const dbankWtmsData = await dBankWtmService.queryByManagement(filterBy);
            context.commit({ type: 'setDBankWtmsData', dbankWtmsData });
        },
        async generateData(context, { data }) {
            await dBankWtmService.generateData(data);
            console.log('DONE!');
        },
    }
}
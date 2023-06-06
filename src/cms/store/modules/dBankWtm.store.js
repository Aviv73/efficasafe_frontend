import { dBankWtmService } from '@/cms/services/dBankWtm.service';

export const dBankWtmStore = {
    state: {
      dbankWtmsData: { items: [], total: 0 },
      dbankWtmsGroups: { groups: [], total: 0 },
      allDbankWtmInteractionsFilterBy: {
            filter: {
                search: '',
                params: {}
            },
            pagination: {
                page: 0,
                limit: 10,
            },
            sort: {},
        }
    },
    getters: {
        dBankWtmsData(state) {
            return state.dbankWtmsData;
        },
        dBankWtms(state) {
            return state.dbankWtmsData.items;
        },
        allDbankWtmInteractionsFilterBy(state) { return state.allDbankWtmInteractionsFilterBy },

        
        dbankWtmsGroups(state) {
            return state.dbankWtmsGroups;
        },
    },
    mutations: {
        setDBankWtmsData(state, { dbankWtmsData }) {
            state.dbankWtmsData = dbankWtmsData;
        },
        setAllDbankWtmInteractionsFilterBy(state, {filterBy}) {
            state.allDbankWtmInteractionsFilterBy = JSON.parse(JSON.stringify(filterBy));
        },
        setDbankWtmsGroups(state, {dbankWtmsGroups}) {
            state.dbankWtmsGroups = JSON.parse(JSON.stringify(dbankWtmsGroups));
        }
    },
    actions: {
        async loadDBankWtms(context, { filterBy }) {
            const dbankWtmsData = await dBankWtmService.queryByManagement(filterBy);
            context.commit({ type: 'setDBankWtmsData', dbankWtmsData });
        },
        async generateData(context, { data }) {
            await dBankWtmService.generateData(data);
        },
        async getDbankWtmGroups(context, { filterBy }) {
            const dbankWtmsGroups = await dBankWtmService.getDbankWtmGroups(filterBy);
            context.commit({ type: 'setDbankWtmsGroups', dbankWtmsGroups });
        },
        async toggleWtmItemsAsDone(context, { ids, value }) {
            await dBankWtmService.toggleWtmItemsAsDone({ids, value});
        },
        async markAllManagementTerm(context, { ids, term }) {
            console.log('YO', ids, term);
            await dBankWtmService.markAllManagementTerm({ids, term});
        },
    }
}
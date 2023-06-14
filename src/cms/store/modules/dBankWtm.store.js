import { dBankWtmService } from '@/cms/services/dBankWtm.service';

export const dBankWtmStore = {
    state: {
      dbankWtmsData: { items: [], total: 0 },
      dbankWtmsGroups: { groups: [], total: 0 },
      dbankWtmsMaterialsData: { items: [], total: 0 },
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
        dbankWtmsMaterialsData(state) {
            return state.dbankWtmsMaterialsData;
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
        },
        setDbankWtmMaterialsData(state, {dbankWtmsMaterialsData}) {
            state.dbankWtmsMaterialsData = JSON.parse(JSON.stringify(dbankWtmsMaterialsData));
        }
    },
    actions: {
        async loadDBankWtms(context, { filterBy }) {
            const dbankWtmsData = await dBankWtmService.queryByManagement(filterBy);
            context.commit({ type: 'setDBankWtmsData', dbankWtmsData });
        },
        async generateDbankWtmData(context, { data }) {
            return await dBankWtmService.generateDbankWtmData(data);
        },
        async getDbankWtmGroups(context, { filterBy }) {
            const dbankWtmsGroups = await dBankWtmService.getDbankWtmGroups(filterBy);
            context.commit({ type: 'setDbankWtmsGroups', dbankWtmsGroups });
        },
        async getDbankWtmMaterials(context, { filterBy }) {
            const dbankWtmsMaterialsData = await dBankWtmService.getDbankWtmMaterials(filterBy);
            context.commit({ type: 'setDbankWtmMaterialsData', dbankWtmsMaterialsData });
        },
        async toggleWtmItemsAsDone(context, { ids, value }) {
            await dBankWtmService.toggleWtmItemsAsDone({ids, value});
        },
        async markAllManagementTerm(context, { ids, term }) {
            return await dBankWtmService.markAllManagementTerm({ids, term});
        },
        async getDbankWtmInnerListData(context, { filterBy }) {
            return await dBankWtmService.getDbankWtmInnerListData(filterBy);
        },
    }
}
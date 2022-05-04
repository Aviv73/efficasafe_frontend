import { drugBankService } from '@/cms/services/drug-bank.service';

export const drugBankStore = {
    state:{
        isShowAll: false,
        theoreticalDiff: 0
    },
    getters:{
        isShowAllDBI(state){
            return state.isShowAll
        },
        theoreticalDiff(state){
            return state.theoreticalDiff
        }
    },
    mutations:{
        setIsShowAll(state, { isChecked }){
            state.isShowAll = isChecked
        },
        setTheoreticalDiff(state, { diff }){
            state.theoreticalDiff = diff
        }
    },
    actions: {
        getDBankInteractions(context, { criteria, cacheKey }) {
            return drugBankService.getInteractions(criteria, cacheKey);
        }
    }
}
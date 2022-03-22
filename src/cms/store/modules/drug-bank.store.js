import { drugBankService } from '@/cms/services/drug-bank.service';

export const drugBankStore = {
    state:{
        isShowAll: false
    },
    getters:{
        isShowAllDBI(state){
            return state.isShowAll
        }
    },
    mutations:{
        setIsShowAll(state, { isChecked }){
            state.isShowAll = isChecked
        }
    },
    actions: {
        getDBankInteractions(context, { criteria, cacheKey }) {
            return drugBankService.getInteractions(criteria, cacheKey);
        }
    }
}
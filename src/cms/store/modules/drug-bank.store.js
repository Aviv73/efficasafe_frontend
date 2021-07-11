import { drugBankService } from '@/cms/services/drug-bank.service';

export const drugBankStore = {
    actions: {
        getDBankInteractions(context, { criteria, doChache }) {
            return drugBankService.getInteractions(criteria, doChache);
        }
    }
}
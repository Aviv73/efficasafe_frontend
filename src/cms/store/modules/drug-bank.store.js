import { drugBankService } from '@/cms/services/drug-bank.service';

export const drugBankStore = {
    actions: {
        getDBankInteractions(context, { criteria, chacheKey }) {
            return drugBankService.getInteractions(criteria, chacheKey);
        }
    }
}
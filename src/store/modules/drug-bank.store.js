import { drugBankService } from '@/services/drug-bank.service';

export const drugBankStore = {
    actions: {
        getDBankInteractions(context, { criteria }) {
            return drugBankService.getInteractions(criteria);
        }
    }
}
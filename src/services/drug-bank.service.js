import { httpService } from './http.service.js';

const END_POINTS = {
    INTERACTION: 'd-bank-interaction'
};

export const drugBankService = {
    getInteractions
}

function getInteractions(filterBy) {
    return httpService.get(END_POINTS.INTERACTION, filterBy);
}
import { httpService } from './http.service.js';

const END_POINTS = {
    INTERACTION: 'd-bank-interaction'
};

export const drugBankService = {
    getInteractions,
    getInteraction
}

function getInteractions(filterBy) {
    return httpService.get(END_POINTS.INTERACTION, filterBy);
}

function getInteraction(id) {
    return httpService.get(`${END_POINTS.INTERACTION}/${id}`);
}
import { httpService } from './http.service.js';

const END_POINTS = {
    INTERACTION: 'd-bank-interaction'
};

export const drugBankService = {
    getInteractions,
    getInteraction,
    getWrongRefsMap,
    getEmptyRef
}

function getInteractions(filterBy) {
    return httpService.get(END_POINTS.INTERACTION, filterBy);
}

function getInteraction(id) {
    return httpService.get(`${END_POINTS.INTERACTION}/${id}`);
}

function getEmptyRef() {
    return {
        ref_id: '',
        pubmed_id: '',
        citation: '',
        title: '',
        url: '',
        draftIdx: 0
    }
}

function getWrongRefsMap() {
    return {
        'A36595': 'A36594'
    }
}
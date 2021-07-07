import { httpService } from './http.service.js';

const END_POINT = 'd-bank-interaction';

const chache = {};

export const drugBankService = {
    getInteractions,
    getInteraction,
    getWrongRefsMap,
    getEmptyRef
}

async function getInteractions(filterBy) {
    const key = filterBy.drugBankId.toString();
    if (chache[key]) return chache[key];
    
    const res = await httpService.get(END_POINT, filterBy);
    chache[key] = res;
    return res;
}

function getInteraction(id) {
    return httpService.get(`${END_POINT}/${id}`);
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
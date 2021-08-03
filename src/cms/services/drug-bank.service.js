import { httpService } from './http.service.js';

const END_POINT = 'd-bank-interaction';

const cache = {};

export const drugBankService = {
    getInteractions,
    getInteraction,
    getWrongRefsMap,
    getEmptyRef
}

async function getInteractions(filterBy, cacheKey = '') {
    if (cacheKey && cache[cacheKey]) {
        return cache[cacheKey];
    }
    const res = await httpService.get(END_POINT, filterBy);
    if (cacheKey) cache[cacheKey] = res;
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
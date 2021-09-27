import { httpService } from './http.service.js';

const END_POINT = 'interaction';

var cache = {};

export const interactionService = {
    list,
    getById,
    save,
    remove,
    removeMany,
    restore,
    getEmptyInteraction,
    chacheSearchState,
    getPrintPreview,
    getChache
}

function getChache(key) {
    return cache[key];
}

function chacheSearchState({ key, parentIdx, idx }) {
    const chached = cache[key];
    if (chached) {
        if (!chached.searchState) chached.searchState = {};

        if (parentIdx === undefined) {
            if (!chached.searchState[idx]) chached.searchState[idx] = {};
            else delete chached.searchState[idx];
        } else {
            if (!chached.searchState[parentIdx]) chached.searchState[parentIdx] = {};
            
            if (!chached.searchState[parentIdx][idx]) chached.searchState[parentIdx][idx] = {};
            else delete chached.searchState[parentIdx][idx];
        }
    }
}

async function list(filterBy, cacheKey = '') {
    if (cacheKey && cache[cacheKey]) {
        return cache[cacheKey];
    }
    const res = await httpService.post(END_POINT, {filterBy});
    if (cacheKey) cache[cacheKey] = res;

    return res;
}
// async function list(filterBy, cacheKey = '') {
//     if (cacheKey && cache[cacheKey]) {
//         return cache[cacheKey];
//     }
//     const res = await httpService.get(END_POINT, filterBy);
//     if (cacheKey) cache[cacheKey] = res;

//     return res;
// }

function getById(id) {
    return httpService.get(`${END_POINT}/${id}`);
}

function save(interaction) {
    if (interaction._id) return httpService.put(`${END_POINT}/${interaction._id}`, interaction);
    else return httpService.post(`${END_POINT}/add`, interaction);
}

function restore(interaction) {
    return httpService.post(`${END_POINT}`, interaction);
}

function remove(id) {
    httpService.delete(`${END_POINT}/${id}`);
}

function removeMany(ids) {
    httpService.delete(END_POINT, ids);
}

function getPrintPreview(filterBy) {
    return httpService.post(`${END_POINT}/print`, filterBy, 'arraybuffer');
}

function getEmptyInteraction() {
    return {
        isActive: false,
        side1Material: null,
        side2Material: null,
        side2Label: null,
        side2DraftName: '',
        updatedAt: null,
        src: 'manual',
        recommendation: '',
        note: '',
        summary: '',
        monitor: {
            general: '',
            labTests: '',
            otherTests: '',
            symptoms: ''
        },
        reviewOfStudies: '',
        evidenceLevel: '',
        indications: [],
        refs: [],
        editorDraft: {
            general: '',
            infoSide1: '',
            infoSide2: ''
        }
    }
}
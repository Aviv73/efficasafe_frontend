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
    cacheSearchState,
    getPrintPreview,
    getCache
}

function getCache(key) {
    return cache[key];
}

function cacheSearchState({ key, parentIdx, idx }) {
    const cached = cache[key];
    if (cached) {
        if (!cached.searchState) cached.searchState = {};

        if (parentIdx === undefined) {
            if (!cached.searchState[idx]) cached.searchState[idx] = {};
            else delete cached.searchState[idx];
        } else {
            if (!cached.searchState[parentIdx]) cached.searchState[parentIdx] = {};
            
            if (!cached.searchState[parentIdx][idx]) cached.searchState[parentIdx][idx] = {};
            else delete cached.searchState[parentIdx][idx];
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
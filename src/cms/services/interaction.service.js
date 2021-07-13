import { httpService } from './http.service.js';

const END_POINT = 'interaction';

var chache = {};

export const interactionService = {
    list,
    getById,
    save,
    remove,
    removeMany,
    restore,
    getEmptyInteraction,
    chacheSearchState
}

function chacheSearchState({ key, parentIdx, idx }) {
    const chached = chache[key];
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

async function list(filterBy, chacheKey = '') {
    if (chacheKey && chache[chacheKey]) {
        return chache[chacheKey];
    }
    const res = await httpService.get(END_POINT, filterBy);
    if (chacheKey) chache[chacheKey] = res;

    return res;
}

function getById(id) {
    return httpService.get(`${END_POINT}/${id}`);
}

function save(interaction) {
    if (interaction._id) return httpService.put(`${END_POINT}/${interaction._id}`, interaction);
    else return httpService.post(`${END_POINT}`, interaction);
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
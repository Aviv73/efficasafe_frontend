import { httpService } from './http.service.js';

const END_POINT = 'interaction';

const chache = {
    positives: {},
    default: {}
};

export const interactionService = {
    list,
    getById,
    save,
    remove,
    removeMany,
    restore,
    getEmptyInteraction
}

async function list(filterBy, doChache = false) {
    let type = filterBy.isPositives ? 'positives' : 'default';
    let key = '';
    if (doChache) {
        key = filterBy.id.toString();
        if (chache[type][key]) return chache[type][key];
    }
    const res = await httpService.get(END_POINT, filterBy);
    if (doChache) chache[type][key] = res;

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
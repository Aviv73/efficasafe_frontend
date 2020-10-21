import { httpService } from './http.service.js';

const END_POINT = 'interaction';

export const interactionService = {
    list,
    getById,
    save,
    remove,
    restore,
    getEmptyInteraction
}

function list(filterBy) {
    return httpService.get(END_POINT, filterBy);
}

function getById(id) {
    return httpService.get(`${END_POINT}/${id}`);
}

function save(interaction) {
    if (interaction._id) return httpService.put(`${END_POINT}/${interaction._id}`, interaction);
    else return httpService.post(`${END_POINT}`, interaction);
}

// restore to main collection:
function restore(interaction) {
    return httpService.post(`${END_POINT}`, interaction);
}

function remove(id) {
    httpService.delete(`${END_POINT}/${id}`);
}

function getEmptyInteraction() {
    return {
        isActive: false,
        side1Material: null,
        side2Material: null,
        side2Label: null,
        side2DraftName: '',
        src: 'manual',
        recommendation: '',
        note: '',
        summery: '',
        monitor: {
            labTests: [],
            otherTests: [],
            symptoms: []
        },
        reviewOfStudies: '',
        evidenceLevel: '',
        indications: [],
        refs: [],
        editorDraft: {
            general: '',
            infoSide1: '',
            infoSide2: '',
            gates: []
        }
    }
}
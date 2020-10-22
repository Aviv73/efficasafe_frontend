import { httpService } from './http.service.js';

const END_POINT = 'interaction';

export const interactionService = {
    list,
    getById,
    save,
    remove,
    restore,
    getEmptyInteraction,
    calculateEvidenceLevel
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

function calculateEvidenceLevel(refs) {
    const map = _evidenceLevelMap(refs)
    console.log('EvidenceLevelMap', map)

    if (
        (map.meta || map.systematic || map['drug label']) ||
        (map.clinical && map.clinical > 1)
    ) {
        return 'A'
    } else if (
        (map.clinical && map.animal) ||
        (map.clinical && map['in vitro']) ||
        (map.retrospective && map.animal) ||
        (map.retrospective && map['in vitro'])
    ) {
        return 'B'
    } else if (map.clinical || map.retrospective) {
        return 'C'
    } else if (map.case) {
        return 'D'
    } else if (
        (map.animal && map.animal > 1) ||
        (map['in vitro'] && map['in vitro'] > 1) ||
        (map.animal && map['in vitro'])
    ) {
        return 'E'
    } else if (map.animal || map['in vitro']) {
        return 'F'
    } else return 'Z'
}

function _evidenceLevelMap(refs) {
    const map = refs.reduce((acc, ref) => {
        acc[ref.type] = acc[ref.type]++ || 1
        return acc
    }, {})

    return map
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
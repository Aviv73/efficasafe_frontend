import { httpService } from './http.service.js';

const END_POINT = 'material';

export const materialService = {
    list,
    getById,
    save,
    remove,
    restore,
    getEmptyMaterial,
    updateMaterials,
    getEmptyRef,
    getEmptyPathway
}

function list(filterBy = {}) {
    return httpService.get(END_POINT, filterBy);
}

function getById(id) {
    return httpService.get(`${END_POINT}/${id}`);
}

function save(material) {
    if (material._id) return httpService.put(`${END_POINT}/${material._id}`, material);
    else return httpService.post(END_POINT, material);
}

function restore(material) {
    return httpService.post(END_POINT, material);
}

function remove(id) {
    httpService.delete(`${END_POINT}/${id}`);
}

function updateMaterials(data) {
    return httpService.put(END_POINT, data);
}

function getEmptyMaterial() {
    return {
        name: '',
        type: '',
        atcIds: [],
        drugBankId: '',
        updatedAt: null,
        botanicalFamily: '',
        plantPartUsed: '',
        desc: '',
        dBankDesc: '',
        dBankClinicalDesc: '',
        dosage: '',
        mechanismOfAction: '',
        precautions: '',
        adverseReactions: '',
        activeConstituents: '',
        brands: [],
        aliases: [],
        dBankAliases: [],
        medicinalActions: [],
        indications: [],
        dBankIndications: [],
        labels: [],
        atcPaths: [],
        regions: [],
        refs: [],
        dBankRefs: [],
        qualities: [],
        compounds: [],
        pathways: [],
        pathwayRefs: [],
        sensitivities: '',
        overdosage: '',
        contraindications: '',
        toxicity: '',
        pregnancy: '',
        lactation: '',
        effectOnDrugMetabolism: '',
        detailedPharmacology: '',
        externalLinks: [],
        isNarrowTherapeutic: false,
        fdaLabel: '',
        pharmacology: {
            indication: '',
            pharmacodynamics: '',
            mechanismOfAction: '',
            absorption: '',
            toxicity: '',
            proteinBinding: '',
            metabolism: '',
            halfLife: '',
            routeOfElimination: '',
            volumeOfDistribution: '',
            clearance: '',
        },
        structuredAdverseEffects: [],
        structuredContraIndications: [],
        foodInteractions: []
    }
}

function getEmptyRef() {
    return {
        draftIdx: 0,
        type: '',
        txt: '',
        link: '',
        pubmedId: ''
    }
}

function getEmptyPathway() {
    return {
        enzyme: '',
        influence: '',
        references: [],
        fullReferences: []
    }
}
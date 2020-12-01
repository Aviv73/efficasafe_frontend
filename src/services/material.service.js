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
        atcId: '',
        drugBankId: '',
        botanicalFamily: '',
        plantPartUsed: '',
        desc: '',
        dosage: '',
        draft: '',
        mechanismOfAction: '',
        precautions: '',
        adverseReactions: '',
        activeConstituents: '',
        brands: [],
        aliases: [],
        medicinalActions: [],
        indications: [],
        labelPaths: [],
        regions: [],
        subMaterials: [],
        refs: [],
        qualities: [],
        sensitivities: '',
        overdosage: '',
        contraindications: '',
        toxicity: '',
        pregnancy: '',
        lactation: '',
        effectOnDrugMetabolism: '',
        detailedPharmacology: '',
        editorDraft: '',
        drugBankInfo: {
            boxedWarnings: '',
            foodInteractions: '',
            desc: '',
            clinicalDesc: '',
            pharmacology: ''
        }
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
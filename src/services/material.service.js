import { httpService } from './http.service.js';

const END_POINT = 'material';

export const materialService = {
    list,
    getById,
    save,
    getEmptyMaterial,
}

function list(filterBy = {}) {
    return httpService.get(END_POINT, filterBy);
}

function getById(id) {
    return httpService.get(`${END_POINT}/${id}`);
}

function save(material) {
    if (material._id) return httpService.put(`${END_POINT}/${material._id}`, material);
    else return httpService.post(`${END_POINT}`, material);
}

function getEmptyMaterial() {
    return {
        name: '',
        type: '',
        atcId: '',
        drugBankId: '',
        desc: '',
        dosage: '',
        draft: '',
        precautions: '',
        adverseReactions: '',
        brands: [],
        aliases: [],
        medicinalActivity: [],
        indications: [],
        labelPaths: [],
        regions: [],
        subMaterials: [],
        refIds: [],
        qualities: '',
        sensitivities: '',
        overdose: '',
        contraindications: [],
        toxicity: '',
        pregnancy: '',
        lactation: '',
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
import { httpService } from './http.service.js';

const END_POINT = 'material';

export const materialService = {
    list,
    getById,
    getEmptyMaterial,
}

function list(criteria) {
    return httpService.get(END_POINT, criteria);
}


function getById(id) {
    try {
        return httpService.get(`${END_POINT}/${id}`);
    } catch (err) {
        console.log('ERROR:', err);
    }
}


function getEmptyMaterial() {
    return {
        name: '',
        type: '',
        atc: '',
        drugBankId: '',
        desc: '',
        dosage: '',
        draft: '',
        precautions: '',
        adverseReactions: '',
        brands: null,
        aliases: null,
        medicinalActivity: [],
        indications: [],
        labelPaths: [],
        regions: [],
        subMaterials: [],
        references: [],
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
// import axios from 'axios'
// import { utilService } from './util.service.js'
import { httpService } from './http.service.js'

const END_POINT = 'material'

export const materialService = {
    list,
    getById,
    // save,
    // remove,
    getEmptyMaterial,
}

function list(criteria) {
    return httpService.get(END_POINT, criteria)
}


function getById(id) {
    try {
        return httpService.get(`${END_POINT}/${id}`);
    } catch (err) {
        console.log('ERROR:', err)
    }
}

// async function save(material) {
//     try {
//         if (material._id) {
//             const res = await axios.put(`${baseUrl}/${material._id}`, material)
//             return res.data
//         } else {
//             material._id = utilService.makeId()
//             const res = await axios.post(`${baseUrl}`, material)
//             return res.data
//         }
//     } catch (err) {
//         console.log('ERROR:', err)
//     }
// }

// async function remove(id) {
//     await axios.delete(`${baseUrl}/${id}`)
//     try {
//         console.log('DELETED!');
//     } catch (err) {
//         console.log('ERROR:', err)
//     }
// }

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
        brands: [],
        aliases: [],
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
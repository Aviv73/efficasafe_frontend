import { httpService } from './http.service.js';

const END_POINT = 'material';
const cache = {};

export const materialService = {
    list,
    getById,
    getByDBId,
    save,
    remove,
    restore,
    getEmptyMaterial,
    updateMaterials,
    getEmptyRef,
    getEmptyPathway,
    removeMany
}

async function list(filterBy = {}, doCache = false, cacheKey = false) {
    let key = '';
    if (doCache) {
        key = filterBy.q ? filterBy.q.toString() : cacheKey
        if (cache[key]) {
            return cache[key];
        }
    }

    const res = await httpService.get(END_POINT, filterBy);
    if (doCache) cache[key] = res;
    return res;
}

function getById(id) {
    return httpService.get(`${END_POINT}/${id}`);
}

function getByDBId(DBId) {
    return httpService.get(`${END_POINT}/byDB/${DBId}`);
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

function removeMany(ids) {
    httpService.delete(END_POINT, ids);
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
        medicinalUsesTxt: '',
        brands: [],
        aliases: [],
        dBankAliases: [],
        medicinalActions: [],
        indications: [],
        dBankIndications: [],
        dBankCategories: [],
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
        isG6pd: false,
        isSalicylate: false,
        isComposite: false,
        isTannin: false,
        isPhototoxicity: false,
        isSulfa: false,
        isUnderStudy: false,
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
        foodInteractions: [],
        ODA: '',
        RDA: '',
        absorptionAndExcretion: '',
        causesOfDeficiency: '',
        nutritionalSources: '',
        otherCharacteristics: '',
        symptomsOfDeficiency: ''
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
        name: '',
        type: '',
        fullName: '',
        influence: '',
        actions: [],
        references: [],
        fullReferences: []
    }
}
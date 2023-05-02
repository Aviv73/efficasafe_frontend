import { httpService } from './http.service.js';

const END_POINT = 'material';
const cache = {};

export const materialService = {
  list,
  getById,
  getByName,
  getByDBId,
  save,
  remove,
  restore,
  getEmptyMaterial,
  updateMaterials,
  getEmptyRef,
  getEmptyPathway,
  removeMany,
  getMaterials,
  getMatsFromGroupSelection,
  getMaterialGroupNames,
  loadRefs
};

async function list(filterBy = {}, doCache = false, cacheKey = false) {
  let key = '';
  if (doCache) {
    key = filterBy.q ? filterBy.q.toString() : cacheKey;
    if (cache[key]) {
      return cache[key];
    }
  }

  const res = await httpService.get(END_POINT, filterBy);
  if (doCache) cache[key] = res;
  return res;
}
async function getMaterials(filterBy = {}) {
  const materials = await httpService.get(`${END_POINT}/index`, filterBy);
  return materials;
}

function getById(id, criteria = {}) {
  return httpService.get(`${END_POINT}/${id}`, criteria);
}

function getByName(name) {
  return httpService.get(`${END_POINT}/name/${name}`);
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

function loadRefs(criteria) {
  return httpService.get(`${END_POINT}/refrences`, {criteria});
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
    formulas: [],
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
      clearance: ''
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
  };
}

function getEmptyRef() {
  return {
    draftIdx: 0,
    type: '',
    txt: '',
    link: '',
    pubmedId: ''
  };
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
  };
}


function getMaterialGroupNames() {
  return ['mag-supplements', 'mag-antacid', 'mag-laxatives', 'Inorganic mag comp', 'Organic mag comp', 'All zincs'];
}
const magSupplements = ['Magnesium sulfate', 'Magnesium glycinate', 'Magnesium phosphate', 'Magnesium oxide', 'Magnesium orotate', 'Magnesium malate', 'Magnesium levulinate', 'Magnesium lactate', 'Magnesium gluconate', 'Magnesium citrate', 'Magnesium chloride', 'Magnesium aspartate', 'Magnesium acetate tetrahydrate', 'Magnesium ascorbate', 'Magnesium Fumarate'];
const magAntacid = ['Magnesium trisilicate', 'Magnesium silicate', 'Magnesium peroxide', 'Magnesium oxide', 'Magnesium hydroxide', 'Magnesium carbonate', 'Magnesium Aluminum Silicate'];
const magLaxatives = ['Magnesium sulfate', 'Magnesium peroxide', 'Magnesium oxide', 'Magnesium hydroxide', 'Magnesium citrate',' Magnesium cation', 'Magnesium carbonate', 'Magnesium acetate'];
const inorganicMagComp = ['Magnesium trisilicate', 'Magnesium silicate', 'Magnesium peroxide', 'Magnesium oxide', 'Magnesium hydroxide', 'Magnesium carbonate', 'Magnesium Aluminum Silicate', 'Magnesium sulfate', 'Magnesium phosphate', 'Magnesium chloride'];
const organicMagComp = ['Magnesium malate', 'Magnesium lactate', 'Magnesium gluconate', 'Magnesium citrate', 'Magnesium acetate tetrahydrate', 'Magnesium pidolate', 'Magnesium orotate', 'Magnesium glycinate', 'Magnesium ascorbate', 'Magnesium Fumarate', 'Magnesium gluconate', 'Magnesium acetate', 'Magnesium aspartate', 'Magnesium levulinate'];
const allZincs = ['Zinc L-carnosine', 'Zinc acetate', 'Zinc ascorbate', 'Zinc carbonate', 'Zinc cation', 'Zinc chloride', 'Zinc citrate', 'Zinc DL-aspartate', 'Zinc gluconate', 'Zinc glycinate', 'Zinc glycinate citrate', 'Zinc iodide', 'Zinc monoethylfumarate', 'Zinc orotate', 'Zinc oxide', 'Zinc picolinate', 'Zinc phenolsulfonate', 'Zinc protoporphyrin', 'Zinc sulfate'];


async function getMatsFromGroupSelection(groupName) {
  let materialNames
  if(groupName === 'mag-supplements') materialNames = magSupplements
  else if(groupName === 'mag-antacid') materialNames = magAntacid
  else if(groupName === 'mag-laxatives') materialNames = magLaxatives
  else if(groupName === 'Inorganic mag comp') materialNames = inorganicMagComp
  else if(groupName === 'Organic mag comp') materialNames = organicMagComp
  else if(groupName === 'All zincs') materialNames = allZincs
  else return

  const res = await materialService.list({isSearchResults: true, q: materialNames});
  const miniMaterials = res.materials.map( ({name,_id,type}) => {
    return {
      text: name,
      _id,
      type
    }
  })
  return miniMaterials;
}
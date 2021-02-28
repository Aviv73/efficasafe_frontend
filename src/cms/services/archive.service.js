import { httpService } from './http.service.js';

const END_POINT = {
    MATERIAL: 'archive/material',
    LABEL: 'archive/label',
    INTERACTION: 'archive/interaction'
};

// List functions:
function archiveMaterialList(filterBy = {}) {
    return httpService.get(END_POINT.MATERIAL, filterBy);
}

function archiveLabelList(filterBy = {}) {
    return httpService.get(END_POINT.LABEL, filterBy);
}

function archiveInteractionList(filterBy = {}) {
    return httpService.get(END_POINT.INTERACTION, filterBy);
}

// Get by ID functions:
function getMatrialById(id) {
    return httpService.get(`${END_POINT.MATERIAL}/${id}`);
}

function getLabelById(id) {
    return httpService.get(`${END_POINT.LABEL}/${id}`);
}

function getInteractionById(id) {
    return httpService.get(`${END_POINT.INTERACTION}/${id}`);
}

// Save to Archive functions:
function saveMaterialToArchive(material) {
    return httpService.post(`${END_POINT.MATERIAL}`, material);
}

function saveLabelToArchive(label) {
    return httpService.post(`${END_POINT.LABEL}`, label);
}

function saveInteractionToArchive(interaction) {
    return httpService.post(`${END_POINT.INTERACTION}`, interaction);
}

// Remove from Archive functions:
function removeMaterial(id) {
    return httpService.delete(`${END_POINT.MATERIAL}/${id}`);
}

function removeLabel(id) {
    return httpService.delete(`${END_POINT.LABEL}/${id}`);
}

function removeInteraction(id) {
    return httpService.delete(`${END_POINT.INTERACTION}/${id}`);
}


export const archiveService = {
    archiveMaterialList,
    archiveLabelList,
    archiveInteractionList,
    getMatrialById,
    getLabelById,
    getInteractionById,
    saveMaterialToArchive,
    saveLabelToArchive,
    saveInteractionToArchive,
    removeMaterial,
    removeLabel,
    removeInteraction
}
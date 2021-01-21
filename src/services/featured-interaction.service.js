import { httpService } from './http.service.js';

const END_POINT = 'featured-interaction';

export const featuredInteractionService = {
    list,
    getById,
    removeMany,
    update,
    updateMany
}

function list(filterBy) {
    return httpService.get(END_POINT, filterBy);
}

function getById(id) {
    return httpService.get(`${END_POINT}/${id}`);
}

function removeMany(filterBy) {
    return httpService.delete(END_POINT, filterBy);
}

function update(interaction) {
    return httpService.put(`${END_POINT}/${interaction._id}`, interaction);
}

function updateMany(filterBy) {
    return httpService.put(END_POINT, filterBy);
}
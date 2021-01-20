import { httpService } from './http.service.js';

const END_POINT = 'featured-interaction';

export const featuredInteractionService = {
    list,
    removeMany,
    updateMany
}

function list(filterBy) {
    return httpService.get(END_POINT, filterBy);
}

function removeMany(filterBy) {
    return httpService.delete(END_POINT, filterBy);
}

function updateMany(filterBy) {
    return httpService.put(END_POINT, filterBy);
}
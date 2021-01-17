import { httpService } from './http.service.js';

const END_POINT = 'featured-interaction';

export const featuredInteractionService = {
    list
}

function list(filterBy) {
    return httpService.get(END_POINT, filterBy);
}
import { httpService } from './http.service.js';

const END_POINT = 'statistics';

export const statisticsService = {
    addSearch
}

function addSearch(query) {
    return httpService.put(END_POINT, query);

}
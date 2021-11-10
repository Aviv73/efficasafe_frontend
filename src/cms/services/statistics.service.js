import { httpService } from './http.service.js';

const END_POINT = 'statistics';

export const statisticsService = {
    list,
    addSearch
}

async function list() {
    return await httpService.get(END_POINT);
}

function addSearch(query) {
    return httpService.get(`${END_POINT}/${query}`);
}
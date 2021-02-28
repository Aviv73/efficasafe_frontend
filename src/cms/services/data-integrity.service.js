import { httpService } from './http.service';

const END_POINT = 'data-integrity';

export const dataIntegrityService = {
    list,
    getById
}

function list(filterBy) {
    return httpService.get(END_POINT, filterBy);
}

function getById(matId) {
    return httpService.get(`${END_POINT}/${matId}`);
}
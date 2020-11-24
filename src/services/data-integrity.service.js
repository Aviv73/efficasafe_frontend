import { httpService } from './http.service';

const END_POINT = 'data-integrity';

export const dataIntegrityService = {
    list
}

function list(filterBy) {
    return httpService.get(END_POINT, filterBy);
}
import { httpService } from './http.service';

const END_POINT = 'atc';

export const atcService = {
    query
}

function query(filterBy) {
    return httpService.get(END_POINT, filterBy);
}
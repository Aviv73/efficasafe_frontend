import { httpService } from './http.service';

const END_POINT = 'reference';


function list(filterBy) {
    return httpService.get(END_POINT, filterBy);
}

export const referenceService = {
    list
}
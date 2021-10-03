import { httpService } from './http.service.js';

const END_POINT = 'manage';

export const manageService = {
    list,
    update
}

function list() {
    return httpService.get(END_POINT);
}

function update(manage) {
    return httpService.put(`${END_POINT}/${manage._id}`, manage);

}
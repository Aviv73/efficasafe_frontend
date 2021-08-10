import { httpService } from "./http.service";

const END_POINT = 'log';

function add(action) {
    return httpService.post(END_POINT, action);
}

export const logService = {
    add
}
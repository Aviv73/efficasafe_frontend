import { httpService } from "./http.service";

const END_POINT = 'log';

function add(action) {
    return httpService.post(END_POINT, action);
}

function update(log){
    return httpService.put(END_POINT, log);
}

export const logService = {
    add,
    update
}
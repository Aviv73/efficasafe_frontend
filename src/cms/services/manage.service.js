import { httpService } from './http.service.js';

const END_POINT = 'manage';

export const manageService = {
    list,
    createNewCoupon,
    update,
}

function list() {
    return httpService.get(END_POINT);
}

function createNewCoupon() {
    return httpService.get(`${END_POINT}/auto-coupon`);
}

function update(manage) {
    return httpService.put(`${END_POINT}/${manage._id}`, manage);
}
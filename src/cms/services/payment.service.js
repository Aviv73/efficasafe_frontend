import { httpService } from './http.service.js';

const END_POINT = 'payment';

export const paymentService = {
    getEndpoint,
    endSubscription
}

async function getEndpoint(url){
    const res = await httpService.get(END_POINT, url);
    return res
}

async function endSubscription(data){
    const res = await httpService.get(`${END_POINT}/end`, data);
    return res
}
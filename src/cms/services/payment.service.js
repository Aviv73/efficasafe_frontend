import { httpService } from './http.service.js';

const END_POINT = 'payment';

export const paymentService = {
    getEndpoint
}

async function getEndpoint(url){
    const res = await httpService.get(END_POINT, url);
    return res
}
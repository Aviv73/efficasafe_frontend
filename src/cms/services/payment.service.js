import { httpService } from './http.service.js';

const END_POINT = 'payment';

export const paymentService = {
    getEndpoint,
    endSubscription
}

async function getEndpoint(plan, currency){
    const data = {plan, currency}
    const res = await httpService.get(`${END_POINT}/get-end-point`, data);
    return res
}

async function endSubscription(recurringId){
    const res = await httpService.get(`${END_POINT}/end`, recurringId);
    return res
}
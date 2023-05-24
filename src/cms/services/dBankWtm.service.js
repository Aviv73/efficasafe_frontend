import { httpService } from './http.service.js';

const END_POINT = 'dBankWTM';

export const dBankWtmService = {
  queryByManagement,
  generateData
}

function queryByManagement(filterBy) {
    return httpService.get(`${END_POINT}/queryByManagement`, filterBy);
}
function generateData(data) {
    return httpService.post(`${END_POINT}/generateWTM`, data);
}
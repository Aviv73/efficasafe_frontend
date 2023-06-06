import { httpService } from './http.service.js';

const END_POINT = 'dBankWTM';

export const dBankWtmService = {
  queryByManagement,
  generateData,
  getDbankWtmGroups,
  toggleWtmItemsAsDone,
  markAllManagementTerm
}

function queryByManagement(filterBy) {
    return httpService.get(`${END_POINT}/queryByManagement`, filterBy);
}
function getDbankWtmGroups(filterBy) {
    return httpService.get(`${END_POINT}/getGroups`, filterBy);
}
function generateData(data) {
    return httpService.post(`${END_POINT}/generateWTM`, data);
}
function toggleWtmItemsAsDone({ids, value}) {
    return httpService.post(`${END_POINT}/toggleWtmItemsAsDone`, {ids, value});
}
function markAllManagementTerm({ids, term}) {
    return httpService.post(`${END_POINT}/markManagementTerm`, {ids, term});
}
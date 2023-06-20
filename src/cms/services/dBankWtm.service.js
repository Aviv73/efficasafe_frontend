import { httpService } from './http.service.js';

const END_POINT = 'dBankWTM';

export const dBankWtmService = {
  queryByManagement,
  generateDbankWtmData,
  getDbankWtmGroups,
  toggleWtmItemsAsDone,
  markAllManagementTerm,
  getDbankWtmMaterials,
  getDbankWtmInnerListData
}

function queryByManagement(filterBy) {
    return httpService.get(`${END_POINT}/queryByManagement`, filterBy);
}
function getDbankWtmGroups(filterBy) {
    return httpService.get(`${END_POINT}/getGroups`, filterBy);
}
function generateDbankWtmData(data) {
    return httpService.post(`${END_POINT}/generateWTM`, data);
}
function toggleWtmItemsAsDone({ids, value}) {
    return httpService.post(`${END_POINT}/toggleWtmItemsAsDone`, {ids, value});
}
function markAllManagementTerm({ids, term}) {
    return httpService.post(`${END_POINT}/markManagementTerm`, {ids, term});
}
function getDbankWtmMaterials(filterBy) {
    return httpService.get(`${END_POINT}/getDbankWtmMaterials`, { filterBy });
}
function getDbankWtmInnerListData(filterBy) {
    return httpService.get(`${END_POINT}/getDbankWtmInnerListData`, { filterBy });
}
import { httpService } from './http.service';
const END_POINT = 'populate';

export const uploadDataService = {
    uploadData
}

function uploadData(files){
    return httpService.post(END_POINT, files, 'json', 'multipart/form-data')
}
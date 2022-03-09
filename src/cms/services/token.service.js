import { httpService } from './http.service.js';

const END_POINT = 'token';

export const tokenService = {
    checkIfValidToken,
    add
}

async function checkIfValidToken(tokenCode){
    return httpService.get(`${END_POINT}/${tokenCode}`);
}

async function add(){
    return httpService.get(`${END_POINT}`);
}
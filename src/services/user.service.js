
import { httpService } from './http.service';
import { storageService } from './storage.service';

const END_POINT = 'auth';
const KEY = 'loggedInUser';

export const userService = {
    login,
    logout,
    getLoggedInUser
}

function getLoggedInUser() {
    return storageService.load(KEY) || null;
}

async function login(credentials) {
    const res = await httpService.post(`${END_POINT}/login`, credentials);
    if (res.account) {
        storageService.store(KEY, res.account);
    }
    return res.account || null;
}

async function logout() {
    await httpService.post(`${END_POINT}/logout`);
    storageService.remove(KEY);
}

import { httpService } from './http.service';
import { storageService } from './storage.service';

const USER_END_POINT = 'auth';
const ACCOUNT_END_POINT = 'account';
const KEY = 'loggedInUser';

export const userService = {
    login,
    logout,
    getLoggedInUser,
    getUser,
    loadUsers,
    getById,
    getEmptyUser,
    save,
    removeMany
}


async function removeMany(ids) {
    return httpService.delete(`${ACCOUNT_END_POINT}`, ids);
}


async function save(user) {
    return httpService.put(`${ACCOUNT_END_POINT}/${user._id}`, user);

}
async function loadUsers(filterBy) {
    return await httpService.get(`${ACCOUNT_END_POINT}/`, filterBy)
}

async function getById(id) {
    return httpService.get(`${ACCOUNT_END_POINT}/${id}`);

}

async function getUser() {
    const token = storageService.load('token')
    if (token) {
        return await httpService.get(`${USER_END_POINT}/userInfo`)
    }

}

function getLoggedInUser() {
    return storageService.load('userProfile')
}


async function login(credentials) {
    const res = await httpService.post(`${USER_END_POINT}/login`, credentials);
    if (res.account) {
        storageService.store(KEY, res.account);
    }
    return res.account || null;
}

async function logout() {
    await httpService.post(`${USER_END_POINT}/logout`);
}

async function getEmptyUser() {
    return {
        name: '',
        email: '',
        role: '',
        email_verified: true
    }
}


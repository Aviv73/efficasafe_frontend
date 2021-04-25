
import { httpService } from './http.service';
import { storageService } from './storage.service';

const END_POINT = 'auth';
const KEY = 'loggedInUser';

export const userService = {
    login,
    logout,
    getLoggedInUser,
    getUser,
    loadUsers,
    getById,
    getEmptyUser,
    save
}


async function save(user) {
    return httpService.put(`account/${user._id}`, user);

}
async function loadUsers(filterBy) {
    return await httpService.get(`account/`, filterBy)
}

async function getById(id) {
    return httpService.get(`account/${id}`);

}

async function getUser() {
    const token = storageService.load('token')
    if (token) {
        return await httpService.get(`${END_POINT}/userInfo`)
    }

}

function getLoggedInUser() {
    return storageService.load('userProfile')
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
}

async function getEmptyUser() {
    return {
        name: '',
        email: '',
        role: '',
        email_verified: true
    }
}


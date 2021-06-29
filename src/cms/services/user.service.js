
import { httpService } from './http.service';
import { storageService } from './storage.service';

const AUTH_END_POINT = 'auth';
const ACCOUNT_END_POINT = 'account';

export const userService = {
    logout,
    getLoggedInUser,
    getUserInfo,
    loadUsers,
    getById,
    getEmptyUser,
    save,
    removeMany,
    sendResetPass,
    resetPassword,
    resnedVerifcationMail,
    checkTrial,
    getEmptySearch
}


async function resnedVerifcationMail(user) {
    return httpService.post(`${ACCOUNT_END_POINT}/resendMail`, { user: user })
}

async function removeMany(ids) {
    return httpService.delete(`${ACCOUNT_END_POINT}`, ids);
}


async function save(user) {
    return httpService.put(`${ACCOUNT_END_POINT}/${user._id}`, user);

}
async function loadUsers(filterBy) {
    return await httpService.get(`${ACCOUNT_END_POINT}/`, filterBy);
}

async function getById(id) {
    return httpService.get(`${ACCOUNT_END_POINT}/${id}`);
}

async function checkTrial(user) {
    const now = Date.now()
    if (now - user.start_trial < 0) {
        try {
            await httpService.put(`${ACCOUNT_END_POINT}/endTrial`, { user })
        } catch (err) {
            console.log('problem with updated user', err)
        } finally {
            user.type = 'registered'
        }
    }
    return user
}

async function getUserInfo() {
    const token = storageService.load('token');
    if (token) {
        return await httpService.get(`${AUTH_END_POINT}/userInfo`);
    }
}

function getLoggedInUser() {
    return storageService.load('userProfile');
}

async function logout() {
    await httpService.post(`${AUTH_END_POINT}/logout`);
}

async function getEmptyUser() {
    return {
        name: '',
        email: '',
        role: '',
        email_verified: true
    }
}

function getEmptySearch() {
    return {
        at: null,
        url: '',
        title: ''
    }
}

async function sendResetPass(email) {
    return await httpService.get(`${ACCOUNT_END_POINT}/replace-pass?email=${email}`);
}

async function resetPassword(pass, token) {
    try {
        await httpService.put(`${ACCOUNT_END_POINT}/reset-pass`, { pass, token });
        return 'done';
    } catch (err) {
        console.log('cannot change pass ', err);
    }
}




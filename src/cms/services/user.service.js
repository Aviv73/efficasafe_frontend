
import { httpService } from './http.service';

const AUTH_END_POINT = 'auth';
const ACCOUNT_END_POINT = 'account';

export const userService = {
    logout,
    getUserInfo,
    loadUsers,
    getById,
    getEmptyUser,
    update,
    addSavedSearch,
    removeSavedSearch,
    removeMany,
    sendResetPass,
    resetPassword,
    resnedVerifcationMail,
    updateAutoPilotContact,
    // checkTrial,
    getEmptySearch,
    verifyEmail,
    signup,
    login,
    getUserSearches,
    updateSession,
    completeEmailVerification,
    updateMany,
    checkFailedPayments
}

function verifyEmail(token) {
    return httpService.get(`${ACCOUNT_END_POINT}/verifyEmail?token=${token}`);
}

async function checkFailedPayments(costumers) {
    return await httpService.post(`${ACCOUNT_END_POINT}/checkFailedPayments`, { costumers: costumers });
}

function resnedVerifcationMail(user) {
    return httpService.post(`${ACCOUNT_END_POINT}/resendMail`, { user: user })
}

function removeMany(ids) {
    return httpService.delete(`${ACCOUNT_END_POINT}`, ids);
}

function update(user, isUpdateSession = false) {
    return httpService.put(`${ACCOUNT_END_POINT}/${user._id}`, { user, isUpdateSession });
}

function updateMany(data) {
    return httpService.put(`${ACCOUNT_END_POINT}/updateMany`, data);
}

function updateAutoPilotContact(user) {
    return httpService.post(`${ACCOUNT_END_POINT}/autopilot-contact`, user);
}

function addSavedSearch(newSearch, userId, searchIdx) {
    return httpService.put(`${ACCOUNT_END_POINT}/addSavedSearch/${userId}`, { newSearch, searchIdx });
}

function removeSavedSearch(searchAt, userId) {
    return httpService.delete(`${ACCOUNT_END_POINT}/removeSavedSearch/${userId}`, { searchAt });
}

function loadUsers(filterBy) {
    return httpService.get(`${ACCOUNT_END_POINT}/`, filterBy);
}

function getById(id) {
    return httpService.get(`${ACCOUNT_END_POINT}/${id}`);
}

// async function checkTrial(user) {
//     const now = Date.now()
//     if (now - user.trialTime < 0) {  // .start_trial
//         try {
//             await httpService.put(`${ACCOUNT_END_POINT}/endTrial`, { user })
//         } catch (err) {
//             console.log('problem with updated user', err)
//         }
//     }
//     return user
// }

async function getUserInfo() {
    return await httpService.get(`${AUTH_END_POINT}/userInfo`);
}

async function updateSession(user){
    return await httpService.put(`${AUTH_END_POINT}/update-session`, user);
}

async function completeEmailVerification(){
    return await httpService.get(`${AUTH_END_POINT}/completeVerification`)
}

function logout() {
    httpService.get(`${AUTH_END_POINT}/logout`);
}

function getEmptyUser() {
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
        title: '',
        materials: null,
        updates: []
    }
}

async function sendResetPass(email) {
    return await httpService.get(`${ACCOUNT_END_POINT}/replace-pass?email=${email}`);
}

async function resetPassword(pass, token) {
    return await httpService.put(`${ACCOUNT_END_POINT}/reset-pass`, { pass, token });
}

async function signup(cred) {
    return await httpService.post(AUTH_END_POINT+'/signup', cred);
}

async function login(cred) {
    return await httpService.post(AUTH_END_POINT+'/login', cred);
}

async function getUserSearches(userId){
    return await httpService.put(ACCOUNT_END_POINT+'/getUserSearches', { userId });
}
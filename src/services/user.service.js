
import { storageService } from './storage.service'

const KEY = 'loggedInUser'
const gUsers = [
    {
        username: "admin",
        password: "nana123"
    }
]

export const userService = {
    login,
    logout,
    getLoggedInUser
}

function getLoggedInUser() {
    return storageService.load(KEY) || null
}

function login(userCred) {
    const user = gUsers.find(currUser => {
        return currUser.username === userCred.username && currUser.password === userCred.password
    })

    if (user) {
        const loggedInUser = JSON.parse(JSON.stringify(user))
        delete loggedInUser.password
        storageService.store(KEY, loggedInUser)
        return loggedInUser
    } else {
        return null
    }

}

function logout() {
    storageService.remove(KEY)
}
import { userService } from '@/services/user.service'

export const userStore = {
    state: {
        loggedInUser: userService.getLoggedInUser()
    },
    getters: {
        loggedInUser(state) {
            return state.loggedInUser
        },
        username(state) {
            return state.loggedInUser.username
        }
    },
    mutations: {
        login(state, { user }) {
            state.loggedInUser = user
        },
        logout(state) {
            state.loggedInUser = null
        },
    },
    actions: {
        async login(context, { credentials }) {
            const user = await userService.login(credentials)
            try {
                context.commit({ type: 'login', user })
                return user
            } catch {
                console.log('error - unautorized');
                throw new Error
            }
        },
        async logout(context) {
            await userService.logout()
            context.commit({ type: 'logout' })
        },
        async loadUsername(context) {
            const user = await userService.getLoggedInUser()
            try {
                context.commit({ type: 'login', user })
            } catch {
                console.log('error - unautorized');
                throw new Error
            }
        }
    }
}
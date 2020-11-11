import { userService } from '@/services/user.service'

export const userStore = {
    state: {
        loggedInUser: userService.getLoggedInUser()
    },
    getters: {
        loggedInUser(state) {
            return state.loggedInUser
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
            const user = await userService.login(credentials);
            context.commit({ type: 'login', user });
            return user;
        },
        async logout(context) {
            await userService.logout();
            context.commit({ type: 'logout' });
        }
    }
}
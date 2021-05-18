import { userService } from '@/cms/services/user.service'
import { storageService } from '../../services/storage.service'

export const userStore = {
    state: {
        loggedInUser: userService.getLoggedInUser(),
        token: null,
        users: null
    },
    getters: {
        loggedInUser(state) {
            return state.loggedInUser
        },
        users(state) {
            return state.users
        }
    },
    mutations: {
        setToken(state, { token }) {
            state.token = token;
            storageService.store('token', token);
        },
        logout(state) {
            storageService.remove('token');
            storageService.remove('userProfile');
            state.loggedInUser = null;
        },
        setLoggedInUser(state, { user }) {
            state.loggedInUser = user;
        },
        setUsers(state, { users }) {
            state.users = users;
        },
        updateUser(state, { user }) {
            if (!state.users) return;
            const idx = state.users.findIndex(currUser => currUser._id === user._id);
            state.users.splice(idx, 1, user);
        },
        removeUsers(state, { ids }) {
            state.users = state.users.filter(user => !ids.includes(user._id));
        },
        setUseApproval(state) {
            state.loggedInUser.approvedUse = true;
        }
    },
    actions: {
        async getUserInfo({ commit }) {
            const user = await userService.getUserInfo();
            if (user) {
                storageService.store('userProfile', user);
                commit({ type: 'setLoggedInUser', user });
            }
        },
        async removeUsers(context, { ids }) {
            await userService.removeMany(ids)
            context.commit({ type: 'removeUsers', ids })
        },
        async updateUser(context, { user }) {
            const savedUser = await userService.save(user);
            context.commit({
                type: 'updateUser',
                user: savedUser
            });
            return savedUser;
        },
        async loadUser(context, { userId }) {
            return await userService.getById(userId);
        },
        async logout(context) {
            await userService.logout();
            context.commit({ type: 'logout' });
        },
        async loadUsers({ commit }, { filterBy }) {
            const users = await userService.loadUsers(filterBy)
            commit({ type: 'setUsers', users })

        }
    }
}
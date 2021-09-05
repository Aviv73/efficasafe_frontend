import { userService } from '@/cms/services/user.service'
import { storageService } from '../../services/storage.service'

export const userStore = {
    state: {
        loggedInUser: userService.getLoggedInUser(),
        token: null,
        users: null,
        total: 0
    },
    getters: {
        loggedInUser(state) {
            return state.loggedInUser
        },
        users(state) {
            return state.users
        },
        usersTotal(state) {
            return state.total;
        }
    },
    mutations: {
        logout(state) {
            storageService.remove('userProfile');
            state.loggedInUser = null;
        },
        setLoggedInUser(state, { user }) {
            state.loggedInUser = user;
        },
        setUsers(state, { users, total }) {
            state.users = users;
            state.total = total;
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
            const savedUser = await userService.update(user);
            context.commit({
                type: 'updateUser',
                user: savedUser
            });
            return savedUser;
        },
        async updateLoggedInUser(context, { user }) {
            const savedUser = await userService.update(user);
            context.commit({
                type: 'setLoggedInUser',
                user: savedUser
            });
            storageService.store('userProfile', savedUser);
            return savedUser;
        },
        async updateAutoPilotContact(context, { user }) {
            return await userService.updateAutoPilotContact(user);
        },
        async updateAuth0Account(context, { user }) {
            return await userService.updateAuth0Account(user);
        },
        async loadUser(context, { userId }) {
            let user = await userService.getById(userId);
            if (user.type === 'trial') user = await userService.checkTrial(user)
            return user
        },
        async logout(context) {
            await userService.logout();
            context.commit({ type: 'logout' });
        },
        async loadUsers({ commit }, { filterBy }) {
            const { users, total } = await userService.loadUsers(filterBy);
            commit({ type: 'setUsers', users, total });
        },
        async signup({ commit, dispatch }, { cred }) {
            try {
              const user = await userService.signup(cred);
              await dispatch({type: 'updateAutoPilotContact', user});
              commit({ type: 'setLoggedInUser', user });
              storageService.store('userProfile', user);
            } catch (err) {
              console.log(err);
            }
        },
        async signupWithGoogle() {
        // async signupWithGoogle({ commit, dispatch }) {
            try {
              const user = await userService.signupWithGoogle();
              console.log(user);
            //   await dispatch({type: 'updateAutoPilotContact', user});
            //   commit({ type: 'setLoggedInUser', user });
            //   storageService.store('userProfile', user);
            } catch (err) {
              console.log(err);
            }
        },
        async login({ commit }, { cred }) {
            try {
              const user = await userService.login(cred);
              commit({ type: 'setLoggedInUser', user });
              storageService.store('userProfile', user);
              return 'successes'
            } catch (err) {
                throw 'err'
            }
        },
        // async loginWithGoogle({ commit }) {
        //     try {
        //       const user = await userService.loginWithGoogle();
        //       commit({ type: 'setLoggedInUser', user });
        //       storageService.store('userProfile', user);
        //       return 'successes'
        //     } catch (err) {
        //         throw 'err'
        //     }
        // },
    }
}
import { userService } from '@/cms/services/user.service'
import { storageService } from '../../services/storage.service'

export const userStore = {
    state: {
        loggedInUser: userService.getLoggedInUser(),
        token: null,
        users: null,
        userPageHeight: null,
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
        },
        getUserPageHeight(state){
            return state.userPageHeight
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
        },
        setUserPageHeight(state, {height}){
            state.userPageHeight = height
        }
    },
    actions: {
        async getUserInfo({ commit }) {
            const user = await userService.getUserInfo();
            if (!user.message) {
                commit({ type: 'setLoggedInUser', user });
            }
        },
        async completeEmailVerification({ commit }){
            const updatedUser = await userService.completeEmailVerification();
            await userService.updateAutoPilotContact(updatedUser)
            commit({ type: 'setLoggedInUser',user: updatedUser });
        },
        async checkIfSession({ dispatch }) {
            const session = await userService.checkIfSession();
            if(session.message === 'No session') await dispatch({type: 'logout'});
        },
        async removeUsers(context, { ids }) {
            await userService.removeMany(ids)
            context.commit({ type: 'removeUsers', ids })
        },
        async updateUser(context, { user }) {
            const savedUser = await userService.update(user);
            await userService.updateAutoPilotContact(user)
            context.commit({
                type: 'updateUser',
                user: savedUser
            });
            return savedUser;
        },
        async updateLoggedInUser(context, { user }) {
            const savedUser = await userService.update(user);
            await userService.updateSession(savedUser)
            context.commit({
                type: 'setLoggedInUser',
                user: savedUser
            });
            return savedUser;
        },
        async updateAutoPilotContact(context, { user }) {
            return await userService.updateAutoPilotContact(user);
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
            } catch (err) {
              console.log(err);
            }
        },
        async login({ commit }, { cred }) {
            try {
              const user = await userService.login(cred);
              commit({ type: 'setLoggedInUser', user });
              return 'successes'
            } catch (err) {
                throw 'err'
            }
        }
    }
}
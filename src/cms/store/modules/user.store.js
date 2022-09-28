import { userService } from '@/cms/services/user.service'
import { storageService } from '../../services/storage.service'

export const userStore = {
    state: {
        loggedInUser: null,
        token: null,
        users: null,
        userPageHeight: null,
        userSearches: [],
        total: 0
    },
    getters: {
        loggedInUser(state) {
            return state.loggedInUser
        },
        userSearches(state) {
            return state.userSearches
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
        setUserSearches(state, { searches }) {
            state.userSearches = searches;
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
            if(!state.users) return
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
        async getUserInfo({ commit, dispatch }) {
            const res = await userService.getUserInfo();
            if(!res.user){
                await dispatch({type: 'logout'});
                return
            }
            const {user} = res
            if(user.purchases.length && typeof user.purchases[0].until === 'number' && user.purchases[0].until < Date.now()){
                user.purchases[0].until = 'Done'
                user.type = 'registered'
                user.trialTime = null
                await dispatch({ type: 'updateLoggedInUser', user });
            }else{
                commit({ type: 'setLoggedInUser', user });
            }
            return user
        },
        async getUserSearches({commit, state}) {
            if(!state.loggedInUser) return
            const searches = await userService.getUserSearches(state.loggedInUser._id)
            commit({ type: 'setUserSearches', searches })
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
        async updatedManyUsers(context, {data}){
            await userService.updateMany(data)
        },
        async updateLoggedInUser(context, { user }) {
            const savedUser = await userService.update(user, true);
            context.commit({
                type: 'setLoggedInUser',
                user: savedUser
            });
            return savedUser;
        },
        async saveNewSearch(context, { data }) {
            const updatedUser = await userService.addSavedSearch(data.newSearch, data.userId, data.searchIdx);
            context.commit({
                type: 'setLoggedInUser',
                user: updatedUser
            });
        },
        async removeSavedSearch(context, { data }) {
            const updatedUser = await userService.removeSavedSearch(data.searchAt, data.userId);
            context.commit({
                type: 'setLoggedInUser',
                user: updatedUser
            });
        },
        async updateAutoPilotContact(context, { user }) {
            return await userService.updateAutoPilotContact(user);
        },
        async loadUser(context, { userId }) {
            let user = await userService.getById(userId);
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
              location.reload() // temp for renewing event for disconnecting other clients
              return 'successes'
            } catch (err) {
                throw 'err'
            }
        }
    }
}
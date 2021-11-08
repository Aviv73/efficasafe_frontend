<template>
    <section class="user-page">
        <div class="container">
            <v-btn class="download-btn" title="Download list" color="success">
                <download-excel
                    :data="userToExcel"
                    :escapeCsv="false"
                    type="csv"
                    name="User List.xls"
                    >
                    <v-icon>mdi-download</v-icon>
                </download-excel>
            </v-btn>
            <v-card v-if="users" class="mb-10">
                <v-card-title>
                    Users collection
                    <v-spacer></v-spacer>
                </v-card-title>
                <user-filter @emit-filter="setFilter" />
                <user-list
                    :users="users"
                    :loading="isLoading"
                    :totalItems="totalItems"
                    @header-clicked="setFilter"
                    @options-updated="setFilter"
                    @delete-many-users="removeMany"
                />
            </v-card>
        </div>
    </section>
</template>

<script>
import UserList from '@/cms/cmps/user/UserList';
import UserFilter from '@/cms/cmps/user/UserFilter';

export default {
    data() {
        return {
            isLoading: false,
        };
    },
    watch: {
        '$route.query': {
            handler() {
                this.loadUsers();
            },
            immediate: true,
        },
    },
    computed: {
        users() {
            return this.$store.getters.users;
        },
        totalItems() {
            return this.$store.getters.usersTotal;
        },
        height(){
            return this.$store.getters.getUserPageHeight
        },
        userToExcel(){
            if(!this.users) return []
            const users = JSON.parse(JSON.stringify(this.users))
            const convertedUsers =  users.map(user => {
                user.registeredTime = new Date(user.registeredTime).toLocaleDateString("he-IL")
                user.trialTime = new Date(user.trialTime).toLocaleDateString("he-IL")
                delete user._id
                delete user.password
                delete user.isSubscribe
                delete user.purchases
                delete user.searches
                return user
            })
            console.log(convertedUsers);
            return convertedUsers
        }
    },
    methods: {
        async loadUsers() {
            this.isLoading = true;
            const filterBy = this.$route.query;
            filterBy.limit = filterBy.limit || 50;
            if (filterBy.q) filterBy.page = 0;
            await this.$store.dispatch({ type: 'loadUsers', filterBy });
            this.isLoading = false;
        },
        setFilter(filterBy) {
            const criteria = {
                ...this.$route.query,
                ...filterBy,
            };
            const queryStr = '?' + new URLSearchParams(criteria).toString();
            this.$router.push(queryStr);
        },
        async removeMany(ids) {
            await this.$store.dispatch({ type: 'removeUsers', ids });
        },
    },
    mounted(){
        if(this.height){
            window.scrollTo(0, this.height);
        }
    },
    components: {
        UserList,
        UserFilter,
    },
};
</script>
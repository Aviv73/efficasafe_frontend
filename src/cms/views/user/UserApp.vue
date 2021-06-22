<template>
    <section class="user-page">
        <div class="container">
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
    },
    methods: {
        async loadUsers() {
            this.isLoading = true;
            const filterBy = this.$route.query;
            filterBy.limit = filterBy.limit || 15;
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
    components: {
        UserList,
        UserFilter,
    },
};
</script>
<template>
    <section class="user-app">
        <div class="user-app-header">
            <div class="flex-align-center">
                <div class="user-app-header-search font-medium">
                    <input
                        type="text"
                        placeholder="Search..."
                        v-model="filterBy.name"
                    />
                </div>
            </div>
            <div class="flex-space-between">
                <span class="user-app-header-notice">
                    Showing 10/100 searches
                </span>
                <span class="user-app-header-filter">
                    <custom-select
                        :options="filterOptions.limit"
                        v-model.number="filterBy.itemsPerPage"
                    />
                    <custom-select
                        :options="filterOptions.createdAt"
                        v-model="filterBy.createdAt"
                    />
                </span>
            </div>
        </div>
        <div class="user-app-content">
            <user-data-table
                :headers="tableHeaders"
                :items="tableItems"
                @item-deleted="removeItem"
            />
            <list-pagination
                class="list-pagination flex-center"
                v-if="pageCount > 1"
                v-model.number="filterBy.page"
                :pageCount="pageCount"
            >
                <template #first-btn>
                    <page-first-icon
                        :size="18"
                        title="First page"
                    />
                </template>
                <template #last-btn>
                    <page-last-icon
                        :size="18"
                        title="Last page"
                    />
                </template>
            </list-pagination>
        </div>
    </section>
</template>

<script>
import CustomSelect from '@/client/cmps/common/CustomSelect';
import UserDataTable from '@/client/cmps/user-account/UserDataTable';
import ListPagination from '@/client/cmps/common/ListPagination';

import PageFirstIcon from 'vue-material-design-icons/PageFirst';
import PageLastIcon from 'vue-material-design-icons/PageLast';

export default {
    data() {
        return {
            filterBy: {
                name: '',
                page: 1, // USE ME!
                itemsPerPage: 5,
                createdAt: 0
                /// TODO:
                /// filter by name (regex) && createdAt > (Date.now() - hodesh)
                /// sort by
            },
            filterOptions: {
                createdAt: [
                    { title: 'All', value: 0 },
                    { title: 'Last 3 days', value: this.getDaysAgo(3) },//(Date.now() - 3 days)
                    { title: 'Last 2 weeks', value: this.getDaysAgo(14) },
                    { title: 'Last month', value: this.getDaysAgo(30) },
                    { title: 'Last year', value: this.getDaysAgo(365) }
                ],
                limit: [
                    { title: 'Show 5', value: 5 },/// DELETE ME!!!
                    { title: 'Show 20', value: 20 },
                    { title: 'Show 50', value: 50 },
                    { title: 'Show 100', value: 100 },
                ]
            }
        }
    },
    watch: {
        filterBy: {
            handler(){
                console.log(this.filterBy);
            },
            deep: true
        }
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        tableHeaders() {
            if (this.$route.name === 'Searches') {
                return [
                    {
                        title: 'Client name',
                        field: 'title',
                        sortable: true
                    },
                    {
                        title: 'Created',
                        field: 'at',
                        sortable: true
                    },
                    {
                        title: 'Updates',
                        field: '',
                        sortable: true
                    },
                    {
                        title: '',
                        field: ''
                    }
                ];
            }
            /// return purchases table headers in their route
            return [];
        },
        tableItems() {
            if (this.$route.name === 'Searches') {
                // TODO: return searches for display by filterby
                return this.loggedInUser.searches;
            }
            return this.loggedInUser.searches;// purchases
        },
        pageCount() {
            const { loggedInUser, filterBy } = this;
            if (!loggedInUser) return 0;
            // later on add another param (or by $route.name) from which array to delete...
            return Math.ceil(loggedInUser.searches.length / filterBy.itemsPerPage);
        }
    },
    methods: {
        removeItem(itemIdx) {
            // later on add another param (or by $route.name) from which array to delete...
            const user = JSON.parse(JSON.stringify(this.loggedInUser));
            user.searches.splice(itemIdx, 1);
            this.$store.dispatch({ type: 'updateLoggedInUser', user });
        },
        getDaysAgo(days) {
            const today = new Date();
            today.setDate(today.getDate() - days);
            today.setHours(0, 0, 0, 0);
            return today.getTime();
        }
    },
    components: {
        CustomSelect,
        UserDataTable,
        ListPagination,
        PageFirstIcon,
        PageLastIcon
    }
}
</script>
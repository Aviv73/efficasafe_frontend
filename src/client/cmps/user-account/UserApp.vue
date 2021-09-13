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
                    Showing {{ `${tableItems.length}/${totalItems}` }} searches
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
                @header-clicked="onSort"
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

import { userService } from '@/cms/services/user.service';

export default {
    data() {
        return {
            filterBy: {
                name: '',
                page: 1,
                itemsPerPage: 20,
                createdAt: 0
            },
            sortBy: {
                field: '',
                isDesc: false
            },
            filterOptions: {
                createdAt: [
                    { title: 'All', value: 0 },
                    { title: 'Last 3 days', value: this.getDaysAgo(3) },
                    { title: 'Last 2 weeks', value: this.getDaysAgo(14) },
                    { title: 'Last month', value: this.getDaysAgo(30) },
                    { title: 'Last year', value: this.getDaysAgo(365) }
                ],
                limit: [
                    { title: 'Show 20', value: 20 },
                    { title: 'Show 50', value: 50 },
                    { title: 'Show 100', value: 100 }
                ]
            },
            userSearches: []
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
                        title: this.isScreenNarrow ? 'Name' : 'Client name',
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
            const { filterBy } = this;
            if (this.$route.name === 'Searches') {
                const from = (filterBy.page - 1) * filterBy.itemsPerPage;
                return this.userSearches
                .filter(({ title, at }) => {
                    return title.toLowerCase().includes(filterBy.name.toLowerCase())
                    && at > filterBy.createdAt;
                })
                .sort((a, b) => {
                    const { field, isDesc } = this.sortBy;
                    const sortOrder = isDesc ? 1 : -1;
                    return (a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0) * sortOrder;
                })
                .slice(from, from + filterBy.itemsPerPage);
                // return this.loggedInUser.searches
                // .filter(({ title, at }) => {
                //     return title.toLowerCase().includes(filterBy.name.toLowerCase())
                //     && at > filterBy.createdAt;
                // })
                // .sort((a, b) => {
                //     const { field, isDesc } = this.sortBy;
                //     const sortOrder = isDesc ? 1 : -1;
                //     return (a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0) * sortOrder;
                // })
                // .slice(from, from + filterBy.itemsPerPage);
            }
            /// return purchases table headers in their route
            return [];
        },
        pageCount() {
            const { totalItems, filterBy } = this;
            return Math.ceil(totalItems / filterBy.itemsPerPage);
        },
        totalItems() {
            const { loggedInUser } = this;
            if (!loggedInUser || this.$route.name !== 'Searches') return 0;
            // const items = (this.$route.name === 'Searches') ? 'searches' : 'purchases';
            // const items = 'searches';
            // return loggedInUser[items].length;
            return this.userSearches.length;
        },
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        }
    },
    methods: {
        onSort(sortBy, isDesc) {
            this.sortBy.field = sortBy.field || sortBy.title;
            this.sortBy.isDesc = isDesc;
        },
        removeItem(itemIdx) {
            if (this.$route.name !== 'Searches') return;
            // const items = (this.$route.name === 'Searches') ? 'searches' : 'purchases';
            const user = JSON.parse(JSON.stringify(this.loggedInUser));
            user.searches.splice(itemIdx, 1);
            this.userSearches.splice(itemIdx, 1)
            this.$store.dispatch({ type: 'updateLoggedInUser', user });
        },
        getDaysAgo(days) {
            const today = new Date();
            today.setDate(today.getDate() - days);
            today.setHours(0, 0, 0, 0);
            return today.getTime();
        }
    },
    async created(){
        this.userSearches = await userService.getUserSearches(this.loggedInUser._id)
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
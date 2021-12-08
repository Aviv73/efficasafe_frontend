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
                @remove-update="removeUpdate"
                @end-subscription="openEndSubscriptionModal"
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
        <modal-wrap
            v-if="isEndSubscriptionModal"
            :isActive="isEndSubscriptionModal"
            @close-modal="closeEndSubscriptionModal"
            >
            <end-subscription-modal :HKId="HKIdToEnd" @close-modal="closeEndSubscriptionModal" @update-user="updateEndSubscriptionUser"/>
        </modal-wrap>
    </section>
</template>

<script>
import CustomSelect from '@/client/cmps/common/CustomSelect';
import UserDataTable from '@/client/cmps/user-account/UserDataTable';
import ListPagination from '@/client/cmps/common/ListPagination';
import ModalWrap from '@/client/cmps/common/ModalWrap';
import EndSubscriptionModal from '@/client/cmps/shared/modals/EndSubscriptionModal';

import PageFirstIcon from 'vue-material-design-icons/PageFirst';
import PageLastIcon from 'vue-material-design-icons/PageLast';

import { userService } from '@/cms/services/user.service';

export default {
    data() {
        return {
            isEndSubscriptionModal: false,
            HKIdToEnd: null,
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
                        title: this.isScreenNarrow ? 'Name' : 'Patient name',
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
                        field: ''
                    },
                    {
                        title: '',
                        field: ''
                    }
                ];
            }
            return [
                {
                    title: 'Purchase Date',
                    field: 'at',
                    sortable: true
                },
                {
                    title: 'Price',
                    field: 'price',
                    sortable: true
                },
                {
                    title: 'Plan',
                    field: 'plan',
                },
                {
                    title: 'Valid until',
                    field: 'until'
                },
                {
                    title: ''
                }
            ];
        },
        tableItems() {
            const { filterBy } = this;
            const from = (filterBy.page - 1) * filterBy.itemsPerPage;
            if (this.$route.name === 'Searches') {
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
            }
            let purchasesCopy = JSON.parse(JSON.stringify(this.purchases))
            return purchasesCopy
                    .sort((a, b) => {
                        const { field, isDesc } = this.sortBy;
                        const sortOrder = isDesc ? 1 : -1;
                        return (a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0) * sortOrder;
                })
                .slice(from, from + filterBy.itemsPerPage);
            
        },
        pageCount() {
            const { totalItems, filterBy } = this;
            return Math.ceil(totalItems / filterBy.itemsPerPage);
        },
        totalItems() {
            const { loggedInUser } = this;
            const items = (this.$route.name === 'Searches') ? 'searches' : 'purchases';
            return loggedInUser[items].length;
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
        },
        openEndSubscriptionModal(item){
            this.HKIdToEnd = item.HKId
            this.isEndSubscriptionModal = true
        },
        closeEndSubscriptionModal(){
            this.HKIdToEnd = null
            this.isEndSubscriptionModal = false
        },
        async updateEndSubscriptionUser(){
            const user = JSON.parse(JSON.stringify(this.loggedInUser))
            const updatedUser = this.calcEndSubscription(user)
            const updattedUser = await this.$store.dispatch({ type: 'updateLoggedInUser', user: updatedUser })
            this.purchases = JSON.parse(JSON.stringify(updattedUser.purchases))
            this.closeEndSubscriptionModal()
            location.reload();
        },
        calcEndSubscription(user){
            const purchase = user.purchases[0]
            const newUntil = this.checkIfDatePassed(purchase.at, purchase.duration)
            user.purchases[0].until = newUntil
            return user
        },
        checkIfDatePassed(startTime, numOfMonth){
            const timeToAdd = 1000 * 60 * 60 * 24 * 30 * numOfMonth
            const newTime = startTime + timeToAdd
            const currDate = Date.now()
            if(newTime < currDate){
                return this.checkIfDatePassed(newTime, numOfMonth)
            }
            return newTime
        },
        async removeUpdate(idx){
            const user = JSON.parse(JSON.stringify(this.loggedInUser))
            user.searches[idx].updates = []
            await this.$store.dispatch({ type: 'updateLoggedInUser', user })
        }
    },
    async created(){
        if(this.$route.name === 'Searches') this.userSearches = await userService.getUserSearches(this.loggedInUser._id)
        else this.purchases = JSON.parse(JSON.stringify(this.loggedInUser.purchases))
    },
    async destroyed(){
        await this.$store.dispatch('getUserInfo');
    },
    components: {
        CustomSelect,
        UserDataTable,
        ListPagination,
        PageFirstIcon,
        PageLastIcon,
        ModalWrap,
        EndSubscriptionModal
    }
}
</script>
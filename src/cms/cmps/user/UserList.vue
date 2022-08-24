<template>
    <section class="user-list">
        <div class="btn-container">
            <v-btn color="primary" class="mr-6" @click="selectAll">Select all</v-btn>
            <v-btn color="error" @click="selected = []">Clear all</v-btn>
        </div>
        <v-data-table
            :headers="headers"
            :items="users"
            :server-items-length="totalItems"
            :options.sync="options"
            :loading="loading"
            disable-sort
            :items-per-page="50"
            :footer-props="{
                'items-per-page-options': [ 50, 100, -1 ],
            }"
        >
            <template v-slot:[`header.username`]="{ header }">
                <label class="list-header">
                    <input
                        type="checkbox"
                        hidden
                        @change="onSort(header.value, $event.target.checked)"
                    />
                    {{ header.text }}
                    <v-icon
                        class="icon"
                        :class="{ 'icon-active': isSortedBy(header.value) }"
                        >mdi-arrow-down</v-icon
                    >
                </label>
            </template>
            <template v-slot:[`header.role`]="{ header }">
                <label class="list-header">
                    <input
                        type="checkbox"
                        hidden
                        @change="onSort(header.value, $event.target.checked)"
                    />
                    {{ header.text }}
                    <v-icon
                        class="icon"
                        :class="{ 'icon-active': isSortedBy(header.value) }"
                        >mdi-arrow-down</v-icon
                    >
                </label>
            </template>
            <template v-slot:[`header.email`]="{ header }">
                <label class="list-header">
                    <input
                        type="checkbox"
                        hidden
                        @change="onSort(header.value, $event.target.checked)"
                    />
                    {{ header.text }}
                    <v-icon
                        class="icon"
                        :class="{ 'icon-active': isSortedBy(header.value) }"
                        >mdi-arrow-down</v-icon
                    >
                </label>
            </template>
            <template v-slot:[`header.country`]="{ header }">
                <label class="list-header">
                    <input
                        type="checkbox"
                        hidden
                        @change="onSort(header.value, $event.target.checked)"
                    />
                    {{ header.text }}
                    <v-icon
                        class="icon"
                        :class="{ 'icon-active': isSortedBy(header.value) }"
                        >mdi-arrow-down</v-icon
                    >
                </label>
            </template>
            <template v-slot:[`header.registeredTime`]="{ header }">
                <label class="list-header">
                    <input
                        type="checkbox"
                        hidden
                        @change="onSort(header.value, !$event.target.checked)"
                    />
                    {{ header.text }}
                    <v-icon
                        class="icon"
                        :class="{ 'icon-active': isSortedBy(header.value) }"
                        >mdi-arrow-down</v-icon
                    >
                </label>
            </template>
            <template v-slot:[`header.type`]="{ header }">
                <label class="list-header">
                    <input
                        type="checkbox"
                        hidden
                        @change="onSort(header.value, $event.target.checked)"
                    />
                    {{ header.text }}
                    <v-icon
                        class="icon"
                        :class="{ 'icon-active': isSortedBy(header.value) }"
                        >mdi-arrow-down</v-icon
                    >
                </label>
            </template>
            <template v-slot:[`header.trialTime`]="{ header }">
                <label class="list-header">
                    <input
                        type="checkbox"
                        hidden
                        @change="onSort(header.value, $event.target.checked)"
                    />
                    {{ header.text }}
                    <v-icon
                        class="icon"
                        :class="{ 'icon-active': isSortedBy(header.value) }"
                        >mdi-arrow-down</v-icon
                    >
                </label>
            </template>
            <template v-slot:body="{ items }">
                <tbody>
                    <tr class="tr-label" v-for="item in items" :key="item._id">
                        <td class="td-name-img">
                            <div style="color: rgb(47, 131, 214); cursor: pointer;" @click="onUserClicked(item._id)">
                                <span class="text-capitalize">{{
                                    item.username
                                }}</span>
                            </div>
                        </td>
                        <td class="centered text-center">
                            {{ item.role }}
                        </td>

                        <td class="centered text-center">
                            {{ item.email }}
                        </td>
                        <td class="centered text-center">
                            {{ item.country }}
                        </td>
                        <td class="centered text-center">
                            {{
                                dateToShow(item.registeredTime)
                            }}
                        </td>
                        <td class="centered text-center">
                            {{ item.type ? typeToShow(item) : 'T' }}
                        </td>
                        <td class="centered text-center" :class="{'red-txt': item.trialTime < Date.now()}">
                            {{
                                dateToShow(item.trialTime)
                            }}
                        </td>
                        <td class="tcentered text-center" style="height: 100%" align="center">
                            <v-checkbox
                                v-model="selected"
                                :value="item._id"
                            />
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-data-table>
        <v-fab-transition>
            <v-btn v-if="selected.length" class="download-btn" title="Download list" color="success">
                <download-excel
                    :data="userToExcel"
                    :escapeCsv="false"
                    type="csv"
                    name="User List.xls"
                    >
                    <v-icon>mdi-download</v-icon>
                </download-excel>
            </v-btn>
        </v-fab-transition>
        <v-fab-transition>
            <v-btn
                class="edit-btn"
                v-if="isAdmin && selected.length"
                @click="$emit('openEdit', [...selected])"
                :title="`Edit ${selected.length} users`"
                color="primary"
                fab
                fixed
                bottom
            >
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </v-fab-transition>
    </section>
</template>

<script>

import { eventBus } from '@/cms/services/eventBus.service';

export default {
    props: {
        users: {
            type: Array,
            required: true,
        },
        loading: {
            type: Boolean,
            required: true,
        },
        totalItems: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            selected: [],
            confirmDialog: false,
            isMounted: false,
            options: {},
            isDesc: true,
            headers: [
                {
                    text: 'Username',
                    value: 'username',
                },
                {
                    text: 'Role',
                    value: 'role',
                    align: 'center',
                    sortable: false,
                },
                {
                    text: 'Email',
                    value: 'email',
                    align: 'center',
                    sortable: false,
                },
                {
                    text: 'Country',
                    value: 'country',
                    align: 'center',
                    sortable: false,
                },
                {
                    text: 'Registered',
                    value: 'registeredTime',
                    align: 'center',
                },
                {
                    text: 'Type',
                    value: 'type',
                    align: 'center',
                },
                {
                    text: 'End Trial',
                    value: 'trialTime',
                    align: 'center',
                },
                {
                    text: 'Edit',
                },
            ],
        };
    },
    watch: {
        options() {
            if (this.isMounted) {
                let { itemsPerPage, page } = this.options;
                const filterBy = {
                    limit: itemsPerPage < 0 ? 0 : itemsPerPage,
                    page: --page,
                };
                this.$emit(
                    'options-updated',
                    JSON.parse(JSON.stringify(filterBy))
                );
            } else {
                this.isMounted = true;
            }
        },
    },
    methods: {
        onSort(sortBy, isDesc) {
            this.$emit('header-clicked', { sortBy, isDesc });
        },
        isSortedBy(property) {
            return this.$route.query.sortBy === property;
        },
        confirmDelete() {
            this.$emit('delete-many-users', [...this.selected]);
            this.selected = [];
            this.confirmDialog = false;
        },
        dateToShow(originalDate){
            if(!originalDate) return '---'
            let date = new Date(originalDate).toISOString().substr(0, 10)
            return date.split('-').reverse().join('-')
        },
        onUserClicked(userId){
            this.$store.commit ({type: 'setUserPageHeight', height: window.pageYOffset})
            this.$router.push(`user/edit/${userId}`)
        },
        selectAll(){
            this.selected = this.users.map(user => user._id)
        },
        typeToShow(item){
            if(item.type === 'subscribed' && item.purchases.length){
                return item.purchases[0].duration === '1' ? `${item.type}-M` : `${item.type}-Y`
            }

            return item.type
        }
    },
    computed:{
        userToExcel(){
            const users = JSON.parse(JSON.stringify(this.users))
            const convertedUsers =  this.selected.map(id => {
                const user = users.find( user => user._id === id)
                user.registeredTime = new Date(user.registeredTime).toLocaleDateString("he-IL")
                user.trialTime = new Date(user.trialTime).toLocaleDateString("he-IL")
                user.subType = (user.type === 'subscribed' && user.purchases.length) ? user.purchases[0].duration === '1' ? 'Monthly' : 'Yearly' : ''
                user.country = user.country || ''
                user.latestCoupon = user.purchases.length ? user.purchases[0].coupon : ''
                user.trialCoupon = user.trialCoupon ? user.trialCoupon : '' 
                delete user._id
                delete user.password
                delete user.isSubscribe
                delete user.purchases
                delete user.searches
                return user
            })
            return convertedUsers
        },
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        isAdmin(){
            return this.loggedInUser.role === 'admin'
        }
    },
    created(){
        eventBus.$on('clear-selected-users', () => {
            this.selected = []
        })
    }
};
</script>
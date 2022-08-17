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
                    v-if="!isUpdatingUsers"
                    :users="users"
                    :loading="isLoading"
                    :totalItems="totalItems"
                    @header-clicked="setFilter"
                    @options-updated="setFilter"
                    @delete-many-users="removeMany"
                    @openEdit="openEdit"
                />
                <loader style="margin-left: 50%" v-else />
            </v-card>
        </div>
        <v-btn
            class="payment-check-btn"
            title="User subscription check"
            color="primary"
            fab
            fixed
            bottom
            @click="isCheckPayment = true"
        >
            <v-icon>mdi-account-check</v-icon>
        </v-btn>

        <v-card v-if="isCheckPayment" class="edit-card payment-check">
            <v-card-title class="title"
                ><v-icon color="white">mdi-account-check</v-icon> User subscription check </v-card-title
            >
            <div class="container">
                <p class="mb-1">To start the checking process, got to CardCom -> <span>דוחות מסמכים -></span></p>
                <p class=" mb-1">דוח מסמכים</p>
                <p style="color: red; font-weight: bold;">*Then remove the first row of the file*</p>
                <input class="ml-4 mb-4" type="file" @change="onUpload"/>

                <loader class="checkLoader" v-if="isLoadingCheck"/>
                <div class="mb-4" v-else-if="checkPaymentErrors">
                    <p v-if="!checkPaymentErrors.length" class="success">No errors were found!</p>
                    <ul class="error" v-else>
                        <li class="mb-2" v-for="(error, idx) in checkPaymentErrors" :key="idx" v-html="error">
                        </li>
                    </ul>
                </div>

                <v-btn class="cancel-btn mt-4 mb-0" @click="isCheckPayment = false; checkPaymentErrors = null">Close</v-btn>
            </div>
        </v-card>

        <v-card v-if="selectedUsersIds.length" class="edit-card">
            <v-card-title class="title"
                ><v-icon color="white">mdi-pencil</v-icon> Edit selected
                users</v-card-title
            >
            <div class="select-field-container">
                <h3 class="ml-8 font-weight-medium">Field to edit:</h3>
                <v-select
                    class="small-search mr-2 ml-8"
                    :items="fieldOptions"
                    v-model="filedToUpdate"
                ></v-select>
            </div>
            <div
                class="edit-action-container edit-type"
                v-if="filedToUpdate === 'Type'"
            >
                <v-select
                    class="small-search mr-2 ml-8"
                    label="Select a user type"
                    :items="typeOptions"
                    v-model="selectedType"
                ></v-select>
                <v-btn color="success" @click="updateUsersType">Update</v-btn>
            </div>
            <div
                class="edit-action-container"
                v-if="filedToUpdate === 'End trial'"
            >
                <v-date-picker v-model="trialDateToUpdate" no-title scrollable>
                </v-date-picker>
                <v-btn color="success" @click="updateUsersTrialTime"
                    >Update</v-btn
                >
            </div>
            <v-btn class="cancel-btn" @click="selectedUsersIds = []"
                >Cancel</v-btn
            >
        </v-card>
    </section>
</template>

<script>
import UserList from '@/cms/cmps/user/UserList';
import UserFilter from '@/cms/cmps/user/UserFilter';

import { eventBus } from '@/cms/services/eventBus.service';
import readXlsxFile from 'read-excel-file'
import { userService } from '@/cms/services/user.service';

import Loader from '@/client/cmps/common/icons/Loader';

export default {
    data() {
        return {
            isLoading: false,
            isUpdatingUsers: false,
            selectedUsersIds: [],
            fieldOptions: ['Type', 'End trial'],
            typeOptions: ['trial', 'subscribed', 'registered'],
            selectedType: 'trial',
            trialDateToUpdate: null,
            filedToUpdate: 'Type',
            isCheckPayment: false,
            isLoadingCheck: false,
            checkPaymentErrors: null
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
        height() {
            return this.$store.getters.getUserPageHeight;
        },
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
            eventBus.$emit('clear-selected-users');
            const criteria = {
                ...this.$route.query,
                ...filterBy,
            };
            const queryStr = '?' + new URLSearchParams(criteria).toString();
            this.$router.push(queryStr);
        },
        openEdit(ids) {
            if (this.selectedUsersIds.length) this.selectedUsersIds = [];
            else this.selectedUsersIds = [...ids];
        },
        async updateUsersType() {
            const data = {
                field: 'type',
                ids: [...this.selectedUsersIds],
                newValue: this.selectedType,
            };
            await this.$store.dispatch({ type: 'updatedManyUsers', data });
            this.selectedUsersIds = [];
            this.loadUsers();
        },
        async updateUsersTrialTime() {
            const dateAsTimestamp = new Date(this.trialDateToUpdate).getTime();
            const data = {
                field: 'trialTime',
                ids: [...this.selectedUsersIds],
                newValue: dateAsTimestamp,
            };
            this.isUpdatingUsers = true;
            await this.$store.dispatch({ type: 'updatedManyUsers', data });
            this.isUpdatingUsers = false;
            this.selectedUsersIds = [];
            this.loadUsers();
        },
        async removeMany(ids) {
            await this.$store.dispatch({ type: 'removeUsers', ids });
        },
        async onUpload(ev){
            this.isLoadingCheck = true
            try{
                const rows = await readXlsxFile(ev.target.files[0], { trim: false })
                const filteredRows = rows.filter(row => {
                    return row[12] && row[3] === 'חשבונית מס קבלה'
                })
                const costumers = filteredRows.map(row => {
                    return  {
                        email: row[12],
                        invoiceId: row[2] + ''
                    }
                })

                this.checkPaymentErrors = await userService.checkFailedPayments(costumers)
            }catch(err){
                console.log('There was a problem: ', err);
            }finally{
                this.isLoadingCheck = false
            }
        }
    },
    mounted() {
        if (this.height) {
            window.scrollTo(0, this.height);
        }
    },
    components: {
        UserList,
        UserFilter,
        Loader,
    },
};
</script>
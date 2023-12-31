<template>
    <section v-if="editedUser">
        <div class="container">
            <v-card class="user-edit pa-4">
                <div class="d-flex flex-row-reverse justify-space-between">
                    <v-btn
                        class="submit-btn"
                        @click="saveUser"
                        color="success"
                        :disabled="!valid"
                    >
                        Save User
                    </v-btn>

                    <h1>Signed up through: {{editedUser.provider | capitalize}}</h1>
                </div>

                <h3 class="mb-3">Saved searches: {{editedUser.searches.length}}</h3>
                <h3 v-if="editedUser.trialCoupon">Used trial coupon "{{editedUser.trialCoupon}}"</h3>
                <v-form
                    style="width: 70%;"
                    class="d-flex flex-column mx-auto"
                    v-model="valid"
                    @submit.prevent="saveUser"
                >
                    <v-text-field
                        type="text"
                        v-model="editedUser.username"
                        label="username*"
                        required
                        :rules="[
                            (v) => !!v || 'Label Name is required',
                        ]"
                    />
                    <v-text-field
                        type="text"
                        v-model="editedUser.email"
                        label="Email*"
                        required
                    />
                    <v-text-field
                        type="text"
                        v-model="editedUser.organization"
                        label="Organization"
                    />
                    <v-text-field
                        type="text"
                        v-model="editedUser.phone"
                        label="Phone"
                    />
                    <v-text-field
                        type="text"
                        v-model="editedUser.country"
                        label="Country"
                    />

                    <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="date"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="date"
                                label="End of trial"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="date"
                            no-title
                            scrollable
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="menu = false"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="saveDate"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>

                    <div class="d-flex align-center justify-space-between">
                        <v-select
                            :items="types"
                            label="Type"
                            dense
                            v-model="editedUser.type"
                        ></v-select>
                        <v-text-field
                            class="pt-0 pl-3 mt-1"
                            type="text"
                            :value="
                                new Date(editedUser.registeredTime)
                                    .toISOString()
                                    .substr(0, 10)
                            "
                            label="Registered*"
                            :disabled="true"
                        />
                    </div>

                    <v-select
                        :items="roles"
                        label="Role"
                        dense
                        v-model="editedUser.role"
                    />

                    <v-textarea
                        class="d-flex align-center justify-center mt-4"
                        outlined
                        name="input-7-4"
                        label="Admin Notes"
                        v-model="editedUser.note"
                    ></v-textarea>
                    <div
                        class="d-flex align-center justify-center"
                    >
                        <h3 class="mr-6">Email verified?</h3>
                        <v-switch
                            v-model="editedUser.email_verified"
                            inset
                            :label="`${editedUser.email_verified}`"
                        ></v-switch>
                    </div>
                    <div
                        class="d-flex align-center justify-center"
                    >
                        <h3 class="mr-6">Allowed to select text</h3>
                        <v-switch
                            v-model="editedUser.isAllowedToSelectTxt"
                            inset
                            :label="`${editedUser.isAllowedToSelectTxt}`"
                        ></v-switch>
                    </div>
                </v-form>

                <v-divider class="my-4" />
                <div
                    class="form-actions d-flex align-center justify-space-between"
                >
                    <v-btn
                        to="/user"
                        color="normal"
                    >
                        cancel
                    </v-btn>

                    <v-btn
                        v-if="loggedInUser && (loggedInUser.role === 'admin' || loggedInUser.role === 'sales')"
                        color="error"
                        @click="isWarning = true"
                    >
                        delete user
                    </v-btn>

                    <v-btn
                        v-if="loggedInUser && loggedInUser.role === 'admin' && editedUser.purchases.length && editedUser.purchases[0].price === 0 && editedUser.purchases[0].until !== 'terminated'"
                        color="error"
                        @click="endFreeSubscription"
                    >
                        end free subscription
                    </v-btn>

                    <v-btn
                        class="submit-btn"
                        @click="saveUser"
                        color="success"
                        :disabled="!valid"
                        >Save User</v-btn
                    >
                </div>
            </v-card>
        </div>
        <v-alert 
            class="cms-alert" 
            v-if="response.msg"
            :type="response.type"
            dismissible
        >
            {{response.msg}}
        </v-alert>
        <div class="container">
            <v-card class="py-2 px-4 text-center">
                <p>user purchase history</p>
                <v-data-table
                    :headers="purchaseHeaders"
                    :items="tableItems"
                    :items-per-page="5"
                    class="elevation-1"
                >
                    <template v-slot:[`item.at`]="{ item }">
                        <span v-if="item.at">{{ new Date(item.at) | timeFilter('DD/MM/YYYY') }}</span>
                    </template>
                    <template v-slot:[`item.until`]="{ item }">
                        <span v-if="item.until">{{ new Date(item.until) | timeFilter('DD/MM/YYYY') }}</span>
                    </template>
                    <template v-slot:[`item.price`]="{ item }">
                        <span>{{item.coin}}{{item.price}}</span>
                    </template>
                    <template v-slot:[`item.btn`]="{ item }">
                        <span><v-btn @click="setItemToRefund(item)">refunded</v-btn></span>
                    </template>
                </v-data-table>
            </v-card>
        </div>
        <div v-if="isWarning" class="warning-container">
            <v-alert
            prominent
            type="error"
            class="alert"
            >
                <v-row align="center" class="row">
                    <v-col >
                        <p>{{warningTxt}}</p>
                        <v-btn @click="onDeleteUser">Delete</v-btn>
                        <v-btn class="ml-2" color="primary" @click="isWarning = false">cancel</v-btn>
                    </v-col>
                </v-row>
            </v-alert>
        </div>
        <div v-if="itemToRefund" class="warning-container">
            <v-alert
            prominent
            type="error"
            class="alert"
            >
                <v-row align="center" class="row">
                    <v-col v-if="!isLoadingRefund">
                        <p>Please make sure that the money is returned to the user and change the type to trial.</p>
                        <v-btn @click="setAsRefunded">Refund</v-btn>
                        <v-btn class="ml-2" color="primary" @click="setItemToRefund(null)">cancel</v-btn>
                    </v-col>
                    <v-col v-else>
                        <p>marking as refunded....</p>
                    </v-col>
                </v-row>
            </v-alert>
        </div>
    </section>
</template>

<script>
import { userService } from '@/cms/services/user.service';

export default {
    data() {
        return {
            editedUser: null,
            valid: true,
            roles: ['admin', 'user', 'editor', 'sales', 'assistantEditor'],
            types: ['trial', 'subscribed', 'registered'],
            date: new Date().toISOString().substr(0, 10),
            menu: false,
            modal: false,
            menu2: false,
            response: {
                msg: null,
                type: null
            },
            isWarning: false,
            purchaseHeaders: [
                {text: 'Purchase Date', value: 'at'},
                {text: 'Invoice', value: 'invoiceId'},
                {text: 'Price', value: 'price'},
                {text: 'Plan', value: 'plan'},
                {text: 'Coupon', value: 'coupon'},
                {text: 'Valid Until', value: 'until'},
                {text: 'Mark as refunded', value: 'btn'},
            ],
            itemToRefund: null,
            isLoadingRefund: false
        };
    },
    methods: {
        saveDate() {
            this.$refs.menu.save(this.date);
            const dateFormat = new Date(this.date).getTime();
            this.editedUser.trialTime = dateFormat;
        },
        async loadUser() {
            const userId = this.$route.params.id;
            let user = null;
            if (userId) user = await this.$store.dispatch({ type: 'loadUser', userId });
            else user = userService.getEmptyUser();
            this.editedUser = JSON.parse(JSON.stringify(user));
            this.date = new Date(user.trialTime).toISOString().substr(0, 10);
        },
        async saveUser() {
            if (!this.editedUser.username) return;
            try{
                await this.$store.dispatch({ type: 'updateUser', user: this.editedUser });
                this.response.type = 'success'
                this.response.msg = `${this.editedUser.username} was updated`
            }catch(err){
                this.response.type = 'error'
                this.response.msg = `SOMETHING WENT WRONG`
            }
            setTimeout(() => {
                this.response.type = null
                this.response.msg = null
            },1500)
        },
        async onDeleteUser(){
            try{
                await this.$store.dispatch({ type: 'removeUsers', ids: [this.editedUser._id] });
                this.$router.push('/user').catch(()=>{})
            }catch(err){
                this.response.type = 'error'
                this.response.msg = `SOMETHING WENT WRONG`
                setTimeout(() => {
                    this.response.type = null
                    this.response.msg = null
                },1500)
            }
        },
        async endFreeSubscription(){
            this.editedUser.type = 'registered'
            this.editedUser.purchases[0].until = 'terminated'
            try{
                await this.$store.dispatch({ type: 'updateUser', user: this.editedUser });
                this.response.type = 'success'
                this.response.msg = `${this.editedUser.username} was updated`
            }catch(err){
                this.response.type = 'error'
                this.response.msg = `SOMETHING WENT WRONG`
            }
            setTimeout(() => {
                this.response.type = null
                this.response.msg = null
            },1500)
        },
        setItemToRefund(item){
            this.itemToRefund = item
        },
        async setAsRefunded(){
            const idx = this.editedUser.purchases.findIndex( p => p.at === this.itemToRefund.at)
            this.editedUser.purchases[idx].until = 'refunded'
            try{
                this.isLoadingRefund = true
                await this.$store.dispatch({ type: 'updateUser', user: this.editedUser });
                this.response.type = 'success'
                this.response.msg = `${this.editedUser.username} was updated`
            }catch(err){
                this.response.type = 'error'
                this.response.msg = `SOMETHING WENT WRONG`
            }finally{
                this.setItemToRefund(null)
                this.isLoadingRefund = false
            }
            setTimeout(() => {
                this.response.type = null
                this.response.msg = null
            },1500)
        }
    },
    computed:{
        warningTxt(){
            return `Are you sure you want to delete ${this.editedUser.username}?`
        },
        tableItems(){
            return this.editedUser.purchases
        },
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        }
    },
    created() {
        this.loadUser();
    },
};
</script>
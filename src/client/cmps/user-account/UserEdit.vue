<template>
    <section class="user-edit">
        <div class="user-edit-card">
            <validation-observer v-slot="{ handleSubmit, reset, invalid }">
                <form
                    class="user-edit-form"
                    @submit.prevent="handleSubmit(updateDetails)"
                    @reset="reset"
                    novalidate
                >
                    <h3>Fill in your personal details</h3>
                    <div class="form-input">
                        <label>
                            <input
                                type="email"
                                placeholder="Your Email"
                                v-model="loggedInUser.email"
                                readonly
                            />
                            <span class="label">Your Email</span>
                        </label>
                    </div>
                    <validation-provider
                        name="username"
                        rules="required"
                        v-slot="{ errors }"
                        :custom-messages="validationMessages"
                    >
                        <div class="form-input" :class="{ 'is-invalid': !!errors.length }">
                            <label>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    v-model="editedDetails.username"
                                />
                                <span class="label">Enter your username</span>
                            </label>
                        </div>
                        <div class="user-edit-error-msg font-bold" v-if="errors.length">
                            {{ errors[0] }}
                        </div>
                    </validation-provider>
                    <validation-provider
                        name="firstName"
                        rules="phone"
                        v-slot="{ errors }"
                        :custom-messages="validationMessages"
                    >
                        <div class="form-input" :class="{ 'is-invalid': !!errors.length }">
                            <label>
                                <input
                                    type="tel"
                                    ref="phoneInput"
                                    placeholder="Enter your mobile No."
                                    v-model="editedDetails.phone"
                                    @countrychange="setPhoneDialCode"
                                />
                                <span class="label">Enter your mobile No.</span>
                            </label>
                        </div>
                        <div class="user-edit-error-msg font-bold" v-if="errors.length">
                            {{ errors[0] }}
                        </div>
                    </validation-provider>
                    <button
                        type="submit"
                        class="user-edit-submit-btn btn"
                        :disabled="invalid || isFormPristine"
                    >
                        Save
                    </button>
                </form>
            </validation-observer>
        </div>
        <div class="user-edit-card">
            <h3>Update password or email</h3>
            <button
                class="user-edit-card-btn flex-align-center"
                @click="emailModalActive = true"
            >
                Update Email
                <chevron-right-icon title="" :size="16" />
            </button>
            <button
                class="user-edit-card-btn flex-align-center"
                @click="$router.push('/email-pass')"
            >
                Update Password
                <chevron-right-icon title="" :size="16" />
            </button>
        </div>
        <div class="user-edit-card">
            <h3>Manage Account</h3>
            <button
                class="user-edit-card-btn flex-align-center"
                @click="downloadPersonalInfo"
            >
                Download Your Personal Information
                <chevron-right-icon title="" :size="16" />
            </button>
            <button
                class="user-edit-card-btn flex-align-center"
                @click="deleteModalActive = true"
            >
                Delete Account
                <chevron-right-icon title="" :size="16" />
            </button>
        </div>
        <modal-wrap :isActive="emailModalActive" @close-modal="emailModalActive = false" persistent>
            <change-email-form @close-modal="emailModalActive = false" />
        </modal-wrap>
        <modal-wrap :isActive="deleteModalActive" @close-modal="deleteModalActive = false" persistent>
            <div v-if="!isLoading" class="delete-user-modal">
                <h3 class="delete-user-modal-title">Are you sure you want to delete your account?</h3>
                <p class="delete-user-modal-txt">This process is permanent, once you delete your account there is no way to retrieve it. If your are a subscribed user your subscription will be terminated.</p>
                <div class="delete-user-modal-btn-container">
                    <button @click="onDeleteAccount" class="red">Delete account</button>
                    <button class="green" @click="closeDeleteModal">Cancel</button>
                </div>
            </div>
            <div v-else class="delete-user-modal">
                <loader />
            </div>
        </modal-wrap>
    </section>
</template>

<script>
import { paymentService } from '@/cms/services/payment.service';
import { eventBus, EV_show_user_msg } from '@/cms/services/eventBus.service';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';
import ModalWrap from '@/client/cmps/common/ModalWrap';
import ChangeEmailForm from '@/client/cmps/shared/modals/ChangeEmailForm';
import Loader from '@/client/cmps/common/icons/Loader';

import ChevronRightIcon from 'vue-material-design-icons/ChevronRight';

export default {
    data() {
        const { phone, username } = this.$store.getters.loggedInUser;
        return {
            editedDetails: {
                username: username || '',
                phone: phone || ''
            },
            validationMessages: {
                phone: 'Number is not valid',
                required: 'Username is required'
            },
            iti: null,
            emailModalActive: false,
            deleteModalActive: false,
            isLoading: false
        }
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        isFormPristine() {
            return Object.values(this.editedDetails).every(val => !val);
        }
    },
    methods: {
        async updateDetails() {
            this.checkPhoneIntlValid();
            const user = JSON.parse(JSON.stringify(this.loggedInUser));
            Object.entries(this.editedDetails).forEach(([ key, val ]) => {
                user[key] = val || user[key] || '';
            });
            await Promise.all([
                this.$store.dispatch({ type: 'updateLoggedInUser', user }),
                this.$store.dispatch({ type: 'updateAutoPilotContact', user })
            ]);
            eventBus.$emit(EV_show_user_msg, 'Your account has been updated successfully.', 3000);
        },
        setPhoneDialCode() {
            this.editedDetails.phone = this.$refs.phoneInput.value;
        },
        checkPhoneIntlValid() {
            if (this.editedDetails.phone && !this.editedDetails.phone.startsWith('+')) {
                this.editedDetails.phone = `+1 ${this.editedDetails.phone}`;
            }
        },
        getUserToPrint(){
            const user = JSON.parse(JSON.stringify(this.loggedInUser))
            delete user._id
            delete user.password
            delete user.role
            delete user.type
            delete user.email_verified
            delete user.approvedUse
            delete user.trialTime
            delete user.isSubscribe
            user.searches.forEach(search => {
                delete search.at
                delete search.isEncrypted
                delete search.materials
                delete search.updates
            })
            return user

        },
        downloadPersonalInfo(){
            const user = this.getUserToPrint()
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user));
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href",     dataStr);
            downloadAnchorNode.setAttribute("download", "Efficasafe - Personal Information");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        },
        closeDeleteModal(){
            this.deleteModalActive = false
        },
        async onDeleteAccount(){
            if(!this.loggedInUser) return 
            const user = JSON.parse(JSON.stringify(this.loggedInUser))
            this.isLoading = true
            try{
                if(user.type === 'subscribed' && user.purchases.length && user.purchases[0].until === 'Ongoing'){
                    const recurringId = user.purchases[0].recurringId
                    const res = await paymentService.endSubscription(recurringId)
                    if(res.payload === false){
                        eventBus.$emit(EV_show_user_msg, 'Something went wrong, please try again or contact us', 5000, 'error')
                        this.isLoading = false
                        this.closeDeleteModal()
                        return
                    }
                }
                await this.$store.dispatch({ type: 'removeUsers', ids: [user._id] });
                this.isLoading = false
                this.closeDeleteModal()
                await this.$store.dispatch({ type: 'logout' });
                this.$router.push('/');
            }catch(err){
                eventBus.$emit(EV_show_user_msg, 'Something went wrong, please try again or contact us', 5000, 'error')
                this.isLoading = false
                this.closeDeleteModal()
            }
        }
    },
    mounted() {
        this.iti = intlTelInput(this.$refs.phoneInput, {
            nationalMode: false
        });
    },
    components: {
        ValidationObserver,
        ValidationProvider,
        ChevronRightIcon,
        ModalWrap,
        ChangeEmailForm,
        Loader
    }
}
</script>
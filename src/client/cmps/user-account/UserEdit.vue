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
                                    v-model="editedDetails.name"
                                />
                                <span class="label">Enter your username</span>
                            </label>
                        </div>
                        <div class="user-edit-error-msg font-bold" v-if="errors.length">
                            {{ errors[0] }}
                        </div>
                    </validation-provider>
                    <validation-provider name="firstName">
                        <div class="form-input">
                            <label>
                                <input
                                    type="text"
                                    placeholder="Enter your first name"
                                    v-model="editedDetails.given_name"
                                />
                                <span class="label">Enter your first name</span>
                            </label>
                        </div>
                    </validation-provider>
                    <validation-provider name="lastName">
                    <div class="form-input">
                        <label>
                            <input
                                type="text"
                                placeholder="Enter your last name"
                                v-model="editedDetails.family_name"
                            />
                            <span class="label">Enter your last name</span>
                        </label>
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
        <div class="user-edit-card" v-if="isEmailPasswordAuth">
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
        <modal-wrap :isActive="emailModalActive" @close-modal="emailModalActive = false" persistent>
            <change-email-form @close-modal="emailModalActive = false" />
        </modal-wrap>
    </section>
</template>

<script>
import { eventBus, EV_show_user_msg } from '@/cms/services/eventBus.service';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';
import ModalWrap from '@/client/cmps/common/ModalWrap';
import ChangeEmailForm from '@/client/cmps/shared/modals/ChangeEmailForm';

import ChevronRightIcon from 'vue-material-design-icons/ChevronRight';

export default {
    data() {
        const { given_name, family_name, phone, name } = this.$store.getters.loggedInUser;
        return {
            editedDetails: {
                given_name: given_name || '',
                family_name: family_name || '',
                name: name || '',
                phone: phone || ''
            },
            validationMessages: {
                phone: 'Number is not valid',
                required: 'Username is required'
            },
            iti: null,
            emailModalActive: false
        }
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        isEmailPasswordAuth() {
            return !!this.loggedInUser.sub.match(/.*auth0.*/);
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
        ChangeEmailForm
    }
}
</script>
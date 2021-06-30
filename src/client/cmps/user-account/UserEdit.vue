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
                                    placeholder="Enter your mobile No."
                                    v-model="editedDetails.phone"
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
            <h3>Change password or email</h3>
            <button
                class="user-edit-card-btn flex-align-center"
                @click="$router.push('/email-pass')"
            >
                Password
                <chevron-right-icon title="" :size="16" />
            </button>
            <button
                class="user-edit-card-btn flex-align-center"
                @click="updateEmail"
            >
                Email
                <chevron-right-icon title="" :size="16" />
            </button>
        </div>
    </section>
</template>

<script>
import { eventBus, EV_show_user_msg } from '@/cms/services/eventBus.service';
import { ValidationProvider, ValidationObserver } from 'vee-validate';

import ChevronRightIcon from 'vue-material-design-icons/ChevronRight';

export default {
    data() {
        const { given_name, family_name, phone } = this.$store.getters.loggedInUser;
        return {
            editedDetails: {
                given_name: given_name || '',
                family_name: family_name || '',
                phone: phone || ''
            },
            validationMessages: {
                phone: 'Number is not valid',
            }
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
            const user = JSON.parse(JSON.stringify(this.loggedInUser));
            Object.entries(this.editedDetails).forEach(([ key, val ]) => {
                user[key] = val || user[key] || '';
            });
            await this.$store.dispatch({ type: 'updateLoggedInUser', user });
            eventBus.$emit(EV_show_user_msg, 'Your account has been updated successfully.', 3000);
        },
        updateEmail() {
            alert('Feature in progress..');
        }
    },
    components: {
        ValidationObserver,
        ValidationProvider,
        ChevronRightIcon
    }
}
</script>
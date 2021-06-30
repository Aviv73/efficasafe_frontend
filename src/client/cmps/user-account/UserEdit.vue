<template>
    <section class="user-edit">
        <div class="user-edit-card">
            <validation-observer v-slot="{ handleSubmit, reset }">
                <form @submit.prevent="handleSubmit(updateDetails)" @reset="reset" novalidate>
                    <h3>Fill in your personal details</h3>
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
                                    v-model="editedDetails.mobile_num"
                                />
                                <span class="label">Enter your mobile No.</span>
                            </label>
                        </div>
                        <div class="user-edit-error-msg font-bold" v-if="errors.length">
                            {{ errors[0] }}
                        </div>
                        <button
                            type="submit"
                            class="user-edit-submit-btn btn"
                            :disabled="!!errors.length"
                        >
                            Save
                        </button>
                    </validation-provider>
                </form>
            </validation-observer>
        </div>
        <div class="user-edit-card" v-if="isEmailPasswordAuth">
            <h3>Change password or email</h3>
            <button
                class="user-edit-card-btn flex-align-center"
            >
                Password
                <chevron-right-icon title="" :size="16" />
            </button>
            <button
                class="user-edit-card-btn flex-align-center"
            >
                Email
                <chevron-right-icon title="" :size="16" />
            </button>
        </div>
    </section>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';

import ChevronRightIcon from 'vue-material-design-icons/ChevronRight';

export default {
    data() {
        return {
            editedDetails: {
                given_name: '',
                family_name: '',
                mobile_num: ''
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
        }
    },
    methods: {
        updateDetails() {
            console.log('submit..', JSON.parse(JSON.stringify(this.editedDetails)));
        }
    },
    components: {
        ValidationObserver,
        ValidationProvider,
        ChevronRightIcon
    }
}
</script>
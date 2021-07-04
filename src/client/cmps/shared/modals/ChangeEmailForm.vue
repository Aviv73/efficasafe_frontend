<template>
    <aside class="change-email-form">
        <button class="change-email-form-close-btn" @click="closeModal">
            <close-icon title="" :size="14" />
        </button>
        <img :src="require('@/client/assets/imgs/logo-vector.svg')" alt="Logo" />
        <h6 class="change-email-form-header">Email change</h6>
        <validation-observer v-slot="{ handleSubmit, reset }" ref="observer">
            <form @submit.prevent="handleSubmit(onSubmit)" @reset="reset" novalidate>
                <validation-provider
                    mode="eager"
                    name="changeEmail"
                    rules="required|email"
                    :custom-messages="validationMessages"
                    v-slot="{ errors }"
                >
                    <div class="form-input" :class="{ 'is-invalid': !!errors.length }">
                        <label>
                            <input
                                type="email"
                                placeholder="Enter your new email"
                                v-model="email"
                            />
                            <span class="label">Enter your new email</span>
                        </label>
                    </div>
                    <p class="change-email-form-user-msg font-bold" v-if="errors.length">
                        {{ errors[0] }}
                    </p>
                </validation-provider>
                <validation-provider
                    mode="eager"
                    name="changeEmailConfirm"
                    :rules="`required|confirm:${email}`"
                    :custom-messages="validationMessages"
                    v-slot="{ errors }"
                >
                    <div class="form-input" :class="{ 'is-invalid': !!errors.length }">
                        <label>
                            <input
                                type="text"
                                placeholder="Enter your new email again"
                                v-model="emailConfirm"
                            />
                            <span class="label">Enter your new email again</span>
                        </label>
                    </div>
                    <p class="change-email-form-user-msg font-bold" v-if="errors.length">
                        {{ errors[0] }}
                    </p>
                </validation-provider>
                <button type="submit" class="change-email-form-submit-btn font-bold">
                    Update email
                </button>
            </form>
        </validation-observer>
    </aside>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';

import CloseIcon from 'vue-material-design-icons/Close';

export default {
    data() {
        return {
            email: '',
            emailConfirm: '',
            validationMessages: {
                required: 'Email is required.',
                email: 'Email is not valid.',
                confirm: 'Email confirmation does not match.'
            }
        }
    },
    methods: {
        onSubmit() {
            // update loggedInUser.email in AutoPilot & Auth0 API's -> update in DB
            console.log(this.email === this.emailConfirm);
            console.log(this.emailConfirm);
        },
        closeModal() {
            this.email = '';
            this.emailConfirm = '';
            this.$refs.observer.reset();
            this.$emit('close-modal');
        }
    },
    components: {
        ValidationObserver,
        ValidationProvider,
        CloseIcon
    }
}
</script>
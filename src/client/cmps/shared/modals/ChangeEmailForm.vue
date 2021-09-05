<template>
    <aside class="change-email-form">
        <button class="change-email-form-close-btn" @click="reset">
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
import { eventBus, EV_show_user_msg } from '@/cms/services/eventBus.service';
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
        async onSubmit() {
            const user = JSON.parse(JSON.stringify(this.$store.getters.loggedInUser));
            user.newEmail = this.email;
            await Promise.all([
                this.$store.dispatch({ type: 'updateAutoPilotContact', user }),
            ]);
            user.email = user.newEmail;
            delete user.newEmail;
            await this.$store.dispatch({ type: 'updateLoggedInUser', user });
            this.reset();
            eventBus.$emit(EV_show_user_msg, 'Your Email has been updated successfully.', 3000);
        },
        reset() {
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
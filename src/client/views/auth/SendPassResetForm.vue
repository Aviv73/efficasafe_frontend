<template>
    <div class="auth-modal">
        <div class="auth-modal-cover" @click.stop="$router.go(-1)"></div>
        <div>
            <div class="auth-modal-content txt-center">
                <button @click="$router.go(-1)" class="close-modal-btn">
                    <close-icon :size="14" />
                </button>
                <img src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
                <div class="auth-modal-small-title font-medium">
                    <p>Enter your Email</p>
                </div>

                <validation-observer v-slot="{ handleSubmit, reset }" ref="observer">
                    <form
                        @submit.prevent="handleSubmit(sendEmail)"
                        @reset="reset"
                        novalidate
                    >
                            <validation-provider
                                mode="eager"
                                name="email"
                                rules="required|email"
                                :custom-messages="validationMessages"
                                v-slot="{ errors }"
                            >
                                <div class="auth-modal-field">
                                    <input
                                        :class="{ 'is-invalid': !!errors.length }"
                                        v-model="email"
                                        type="email"
                                        placeholder="yours@example.com"
                                    />
                                </div>
                                <p v-if="emailSent" class="auth-modal-user-msg font-bold">
                                    WE'VE JUST SENT YOU AN EMAIL TO RESET YOUR PASSWORD.
                                </p>
                                <p v-if="errors.length" class="auth-modal-user-msg font-bold is-error">
                                    {{ errors[0] }}
                                </p>
                                <p v-if="failMsg" class="auth-modal-user-msg font-bold is-error">
                                    {{ failMsg }}
                                </p>
                            </validation-provider>
                        <button type="submit" class="btn">Send Email</button>
                    </form>
                </validation-observer>
            </div>
        </div>
    </div>
</template>

<script>
import { userService } from '@/cms/services/user.service';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import CloseIcon from 'vue-material-design-icons/Close';

export default {
    data() {
        return {
            email: '',
            emailSent: false,
            failMsg: '',
            validationMessages: {
                required: 'Email is required',
                email: 'Email is not valid'
            }
        };
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        }
    },
    methods: {
        async sendEmail() {
            try {
                const res = await userService.sendResetPass(this.email);
                if (res.success) {
                    this.$refs.observer.reset();
                    this.failMsg = '';
                    this.emailSent = true;
                    this.email = '';
                } else {
                    this.failMsg = 'Email does not exists!';
                    this.emailSent = false;
                }
            } catch (err) {
                this.failMsg = 'Something went wrong. Try again';
            }
        },
    },
    created() {
        if (this.loggedInUser) {
            this.email = this.loggedInUser.email;
        }
    },
    components: {
        ValidationProvider,
        ValidationObserver,
        CloseIcon
    }
};
</script>


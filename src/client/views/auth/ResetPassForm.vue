<template>
    <div class="auth-modal">
        <div class="auth-modal-cover"></div>
        <div>
            <div class="auth-modal-content txt-center">
                <img class="logo" src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
                <div class="auth-modal-small-title font-medium">
                    <p>Enter a new password</p>
                </div>
                
                <validation-observer v-slot="{ handleSubmit, reset }">
                    <form @submit.prevent="handleSubmit(onResetPass)" @reset="reset" novalidate>
                        <validation-provider
                            ref="validator1"
                            mode="eager"
                            name="password"
                            rules="required|password"
                            v-slot="{ errors }"
                            :custom-messages="validationMessages"
                        >
                            <div class="auth-modal-field">
                                <input
                                    :class="{ 'is-invalid': !!errors.length }"
                                    v-model="newPass"
                                    :type="inputType"
                                    placeholder="Enter new Password"
                                />
                                <button
                                    type="button"
                                    tabindex="-1"
                                    class="auth-modal-field-pass-toggle reset-pass-toggle"
                                    @click="toggleInputType()"
                                >
                                    <eye-icon v-if="inputType === 'password'" class="eye-icon" title="" :size="16" />
                                    <eye-off-icon v-else class="eye-icon" title="" :size="16" />
                                </button>
                            </div>
                            <p class="auth-modal-user-msg font-bold is-error" v-if="errors.length">
                                {{ errors[0] }}
                            </p>
                        </validation-provider>
                        <validation-provider
                            mode="eager"
                            name="password"
                            :rules="`required|confirm:${newPass}`"
                            v-slot="{ errors }"
                            :custom-messages="validationMessages"
                        >
                            <div class="auth-modal-field">
                                <input
                                    :class="{ 'is-invalid': !!errors.length }"
                                    v-model="checkPass"
                                    :type="inputType2"
                                    placeholder="Repeat Password"
                                />
                                <button
                                    type="button"
                                    tabindex="-1"
                                    class="auth-modal-field-pass-toggle reset-pass-toggle"
                                    @click="toggleInputType2()"
                                >
                                    <eye-icon v-if="inputType2 === 'password'" class="eye-icon" title="" :size="16" />
                                    <eye-off-icon v-else class="eye-icon" title="" :size="16" />
                                </button>
                            </div>
                            <p class="auth-modal-user-msg font-bold is-error" v-if="errors.length">
                                {{ errors[0] }}
                            </p>
                            <p class="auth-modal-user-msg font-bold is-error" v-if="failMsg">
                                {{ failMsg }}
                            </p>
                        </validation-provider>
                        <button type="submit" class="btn" id="changePassBtn">
                            Change Password
                        </button>
                    </form>
                </validation-observer>
            </div>
        </div>
    </div>
</template>

<script>
import { userService } from '@/cms/services/user.service';
import { ValidationProvider, ValidationObserver } from 'vee-validate';

import EyeIcon from 'vue-material-design-icons/Eye';
import EyeOffIcon from 'vue-material-design-icons/EyeOff';

export default {
    data() {
        return {
            inputType: 'password',
            inputType2: 'password',
            newPass: '',
            checkPass: '',
            failMsg: '',
            validationMessages: {
                required: 'Password is required',
                password: 'Password must be at least 8 characters and contain a digit, lowercase and uppercase letters',
                confirm: 'The password confirmation does not match.'
            }
        };
    },
    methods: {
        async onResetPass() {
            try {
                const res = await userService.resetPassword(
                    this.newPass,
                    this.$route.params.token
                );
                if (res.err) {
                    this.failMsg = 'Something went wrong. Try again';
                    return;
                }
                this.$router.push('/?passwordreset=1');
            } catch (err) {
                this.failMsg = 'Something went wrong. Try again';
            }
        },
        toggleInputType() {
            this.inputType = (this.inputType === 'password') ? 'text' : 'password';
        },
        toggleInputType2() {
            this.inputType2 = (this.inputType2 === 'password') ? 'text' : 'password';
        }
    },
    components: {
        ValidationObserver,
        ValidationProvider,
        EyeIcon,
        EyeOffIcon
    }
};
</script>



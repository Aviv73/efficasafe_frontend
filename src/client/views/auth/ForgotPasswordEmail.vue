<template>
    <div class="sign-up-modal">
        <div class="black-screen" @click.stop="$router.push('/')"></div>
        <div>
            <div class="inside-modal center">
                <img src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
                <div class="con-title">
                    <p>Enter your Email</p>
                </div>

                <div class="email-input">
                    <validation-provider name="email" rules="required|email">
                        <div slot-scope="{ errors }">
                        <input
                            v-model="email"
                            type="email"
                            placeholder="yours@example.com"
                        />
                        <p class="error">{{ errors[0] }}</p>
                        </div>
                    </validation-provider>
                </div>

                <button @click="sendEmail" class="btn">Send Email</button>
                <p v-if="emailSent" class="send-verification">
                    WE'VE JUST SENT YOU AN EMAIL TO RESET YOUR PASSWORD.
                </p>
                <p v-if="wrongEmail" class="send-verification red-bgc">
                    {{ wrongEmail }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { userService } from '@/cms/services/user.service';
import { ValidationProvider } from 'vee-validate';
import { extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

extend('required', {
    ...required,
    message: 'Email is required'
});
extend('email', {
    ...email,
    message: 'Email is not valid'
});

export default {
    data() {
        return {
            email: '',
            emailSent: false,
            wrongEmail: false,
        };
    },
    methods: {
        async sendEmail() {
            try {
                const res = await userService.sendResetPass(this.email);
                if (res === 'Invalid Username or Email!') {
                    this.wrongEmail = 'Invalid Email!';
                    this.emailSent = false;
                } else {
                    this.wrongEmail = false;
                    this.emailSent = true;
                    this.email = '';
                }
            } catch (err) {
                console.error(err);
                this.wrongEmail = 'Something went wrong. Try again';
            }
        },
    },
    components: {
        ValidationProvider
    }
};
</script>


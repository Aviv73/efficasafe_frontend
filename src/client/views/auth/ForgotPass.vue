<template>
    <div class="sign-up-modal">
        <div class="black-screen"></div>
        <div>
            <div class="inside-modal center">
                <img src="../../assets/imgs/flat-logo.png" alt="" />
                <div class="con-title">
                    <p>Enter a new password</p>
                </div>

                <div class="email-input">
                    <input
                        v-model="newPass"
                        type="password"
                        placeholder="Enter new Password"
                    />
                </div>
                <div class="email-input">
                    <input
                        v-model="checkPass"
                        type="password"
                        placeholder="Repeat Password"
                    />
                </div>
                <p class="send-verification red-bgc" v-if="errorMsg">
                    {{ errorMsg }}
                </p>

                <button @click="onResetPass" class="btn" id="changePassBtn">
                    Change Password
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { userService } from '@/cms/services/user.service';

export default {
    data() {
        return {
            newPass: '',
            checkPass: '',
            token: '',
            errorMsg: '',
        };
    },
    methods: {
        async onResetPass() {
            if (this.newPass !== this.checkPass) {
                this.errorMsg = 'The password confirmation does not match.';
                return;
            }

            if (!this.checkPassword(this.newPass)) {
                this.errorMsg =
                    'Password must contain at list 1 digit , Uppercase letter , Lowercase letter and minimum 8 digits';
                return;
            }
            const res = await userService.resetPassword(
                this.newPass,
                this.token
            );
            if (res) this.$router.push('/?passwordreset=1');
        },
        checkPassword(str) {
            const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            return re.test(str);
        },
    },
    created() {
        this.token = this.$route.params.token;
    },
};
</script>



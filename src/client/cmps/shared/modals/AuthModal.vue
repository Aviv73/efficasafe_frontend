<template>
    <div class="sign-up-modal">
        <div class="black-screen" @click.stop="closeModal"></div>
        <div id="effica-modal"></div>
        <div v-if="signUpModal">
            <div class="inside-modal center">
                <img src="../../../assets/imgs/flat-logo.png" alt="" />
                <p class="title">Please confirm your email address</p>

                <p class="sub-title">
                    In order to complete registration process, please go to your
                    mail and click the confirmation link.
                </p>

                <p class="desc">
                    If you did not receive a confirmation email, please check
                    your spam folder. Also, please verify that you entered a
                    valid email address in our sign-up form.
                </p>

                <p class="assistance">
                    If you need assistance, please contact us.
                </p>
                <button
                    class="resend-email"
                    :disabled="isLoading"
                    @click="onResendEmail"
                >
                    Resend email verification
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Auth0Lock from 'auth0-lock';
import config from '@/client/config';
import { userService } from '../../../../cms/services/user.service';

export default {
    props: {
        allowLogin: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            lock: null,
            signUpModal: false,
            isLoading: false
        };
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
    },
    methods: {
        closeModal() {
            this.$emit('closeModal');
        },
        async onResendEmail() {
            if (!this.loggedInUser) return;
            this.isLoading = true;
            await userService.resnedVerifcationMail(this.loggedInUser);
            this.isLoading = false;
        },
        handleError(err) {
            console.log('ERROR:', err);
        },
        async onAuthenticated(authResult) {
            let { accessToken, tokenType } = authResult;
            this.$store.commit({
                type: 'setToken',
                token: `${tokenType} ${accessToken}`,
            });
            await this.$store.dispatch({ type: 'getUserInfo' });
            const { loggedInUser } = this;

            const user = await this.$store.dispatch({
                type: 'loadUser',
                userId: loggedInUser._id,
            });
            if (
                (user && user.email_verified) ||
                (user && !user.sub.startsWith('auth0'))
            ) {
                this.$store.dispatch({ type: 'getUserInfo' });
                setTimeout(() => {
                    this.lock.hide();
                    this.closeModal();
                }, 1200);
            } else {
                this.$store.dispatch({ type: 'getUserInfo' });
                this.lock.hide();
                this.signUpModal = true;
            }
            if (user) {
                window.dataLayer.push({ authenticatedSuccessfully: user.sub.split('|')[0] });
            }
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.lock.show({
                allowLogin: this.allowLogin,
                allowSignUp: !this.allowLogin,
            });
        });
    },
    created() {
        const options = {
            languageDictionary: {
                title: 'Efficasafe',
            },
            container: 'effica-modal',
            auth: {
                redirect: false,
            },
            theme: {
                labeledSubmitButton: true,
                logo: `${window.location.origin}/img/logo-symbol.png`,
                primaryColor: '#4FB891',
            },
            autoclose: true,
            avatar: null,
            forgotPasswordLink: `${window.location.origin}/emailPassword`,
            additionalSignUpFields: [
                {
                    name: 'name',
                    placeholder: 'Your username',
                    icon: `${window.location.origin}/img/icons/account-outline.svg`,
                    storage: 'root',
                    validator: (val) => ({
                        valid: val.length > 0,
                        hint: 'Username can\'t be blank'
                    })
                },
            ],
        };
        this.lock = new Auth0Lock(
            config.auth0ClientId,
            config.auth0BaseURL,
            options
        );
        this.lock.on('authenticated', this.onAuthenticated);
        this.lock.on('signup error', this.handleError);
    },
    beforeDestroy() {
        this.lock.off('authenticated', this.onAuthenticated);
        this.lock.off('signup error', this.handleError);
    },
};
</script>


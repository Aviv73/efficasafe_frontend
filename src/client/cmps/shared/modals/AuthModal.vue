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
            </div>
        </div>
    </div>
</template>




<script>
import Auth0Lock from 'auth0-lock';
import config from '@/client/config';

export default {
    props: {
        allowLogin: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            lock: null,
            signUpModal: false,
        };
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        }
    },
    methods: {
        closeModal() {
            if (this.signUpModal) return;
            this.$emit('closeModal');
        },
        handleError(err) {
            console.log(err);
        },
        async onAuthenticated(authResult) {
            let { accessToken, tokenType } = authResult;
            this.$store.commit({
                type: 'setToken',
                token: `${tokenType} ${accessToken}`,
            });

            await this.$store.dispatch({ type: 'getUserInfo' });
            const { loggedInUser } = this;
            if (loggedInUser && loggedInUser.email_verified) {
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
        },
    },
    mounted() {
        if (this.loggedInUser && !this.loggedInUser.email_verified) this.signUpModal = true;
        else {
            this.lock.show({
                allowLogin: this.allowLogin,
                allowSignUp: !this.allowLogin,
            });
        }
    },
    created() {
        const clientId = 'ECULxkc4xSBK8omj6EXcnPbyKuTvJ3Nr';
        const domain = 'dev-385wz0kc.us.auth0.com';
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
                logo: 'https://i.ibb.co/ZHXvGqx/logo-symbol.png',
                primaryColor: '#4FB891',
            },
            autoclose: true,
            avatar: null,
            forgotPasswordLink: `${config.dbURL}/emailPassword`,
        };
        this.lock = new Auth0Lock(clientId, domain, options);
        this.lock.on('authenticated', this.onAuthenticated);
        this.lock.on('signup error', this.handleError);
    },
    beforeDestroy() {
        this.lock.off('authenticated', this.onAuthenticated);
        this.lock.off('signup error', this.handleError);
    },
};
</script>


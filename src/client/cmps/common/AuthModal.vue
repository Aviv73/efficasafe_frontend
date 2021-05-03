<template>
    <div class="sign-up-modal">
        <div class="black-screen" @click.stop="closeModal('black')"></div>
        <div id="effica-modal"></div>
        <div v-if="signUpModal">
            <div class="inside-modal center">
                <img src="../../assets/imgs/flat-logo.png" alt="" />
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

export default {
    data() {
        return {
            lock: null,
            signUpModal: false,
        };
    },
    props: {
        allowLogin: Boolean,
    },
    methods: {
        closeModal(x = 'no') {
            console.log(x);
            this.$emit('closeModal');
        },

        handleError(err) {
            console.log(err);
        },

        async onAuthenticated(authResult) {
            console.log('from login', authResult);
            let { accessToken, tokenType } = authResult;
            this.$store.commit({
                type: 'setToken',
                token: `${tokenType} ${accessToken}`,
            });

            await this.$store.dispatch({ type: 'getUserInfo' });
            const loggedInUser = this.$store.getters.loggedInUser;
            if (loggedInUser.email_verified) {
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
        this.lock.show({
            allowLogin: this.allowLogin,
            allowSignUp: !this.allowLogin,
        });
        console.log('doing things');
        // setTimeout(() => {
        //     document.querySelector('.auth0-lock-alternative').innerHTML =
        //         '<h2 href="https://localhost:300/api/account/resetPassword>Reset Password</h2>';
        // }, 2000);
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
        };
        this.lock = new Auth0Lock(clientId, domain, options);
        this.lock.on('authenticated', this.onAuthenticated);
        this.lock.on('signup error', this.handleError);
    },
    destroyed() {
        this.lock.off('authenticated', this.onAuthenticated);
        this.lock.off('signup error', this.handleError);
    },
};
</script>

<style lang="scss" scoped>
</style>
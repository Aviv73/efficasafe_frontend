<template>
    <div id="app">
        <navbar @login="onLogin" @signup="onSignUp" />

        <main>
            <router-view />
        </main>
        <main-footer />
        <auth-modal
            v-if="authModal"
            @closeModal="authModal = false"
            :allowLogin="allowLogin"
        />
    </div>
</template>

<script>
import Navbar from '@/client/cmps/Navbar';
import MainFooter from '@/client/cmps/MainFooter';
import AuthModal from '@/client/cmps/shared/modals/AuthModal';

export default {
    name: 'App',
    data() {
        return {
            authModal: false,
            allowLogin: false,
        };
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        }
    },
    methods: {
        onLogin() {
            this.allowLogin = true;
            this.authModal = true;
        },
        onSignUp() {
            this.allowLogin = false;
            this.authModal = true;
        },
    },
    created() {
        if (this.loggedInUser && !this.loggedInUser.email_verified) {
            this.authModal = true;
        }
    },
    components: {
        Navbar,
        MainFooter,
        AuthModal,
    }
};
</script>
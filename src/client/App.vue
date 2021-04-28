<template>
    <div id="app">
        <navbar @login="onLogin" @signup="onSignUp" />

        <main>
            <router-view />
        </main>
        <main-footer />
        <auth-modal
            @closeModal="AuthModal = false"
            v-if="AuthModal"
            :allowLogin="allowLogin"
        />
    </div>
</template>

<script>
import Navbar from '@/client/cmps/Navbar';
import MainFooter from '@/client/cmps/MainFooter';
import AuthModal from '@/client/cmps/common/AuthModal';

export default {
    name: 'App',
    data() {
        return {
            AuthModal: false,
            allowLogin: false,
        };
    },
    methods: {
        onLogin() {
            console.log('changing state');
            this.allowLogin = true;
            this.AuthModal = true;
        },
        onSignUp() {
            this.allowLogin = false;
            this.AuthModal = true;
        },
    },
    components: {
        Navbar,
        MainFooter,
        AuthModal,
    },
};
</script>
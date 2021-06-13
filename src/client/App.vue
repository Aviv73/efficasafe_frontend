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
        <user-msg />
    </div>
</template>

<script>
import { eventBus, EV_show_cookie_notice } from '@/cms/services/eventBus.service';
import { storageService } from '@/cms/services/storage.service';

import Navbar from '@/client/cmps/Navbar';
import MainFooter from '@/client/cmps/MainFooter';
import AuthModal from '@/client/cmps/shared/modals/AuthModal';
import UserMsg from '@/client/cmps/UserMsg.vue';

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
        },
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
    mounted() {
        const hasConsent = storageService.load('cookie-consent');
        if (!hasConsent) {
            eventBus.$emit(EV_show_cookie_notice);
        }
    },
    components: {
        Navbar,
        MainFooter,
        AuthModal,
        UserMsg
    },
};
</script>
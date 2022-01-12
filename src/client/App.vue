<template>
    <div id="app">
        <navbar @login="onLogin" @signup="onSignUp" />
        <main>
            <router-view @signup="onSignUp" @showAuth="onShowAuth" @showValidate="onShowValidate"/>
        </main>
        <main-footer />
        <auth-modal
            v-if="authModal"
            @closeModal="authModal = false, showFreeSearchesMsg = false, showValidateMsg = false"
            :showFreeSearchesMsg = showFreeSearchesMsg
            :showValidateMsg = showValidateMsg
        />
        <login-modal
            v-if="loginModal"
            @closeModal="loginModal = false, showFreeSearchesMsg = false"
            @openAuthModal="switchModals"
        />
        <user-msg />
    </div>
</template>

<script>
import { eventBus, EV_show_cookie_notice, EV_open_singup, EV_open_login, EV_show_other_login } from '@/cms/services/eventBus.service';
import { storageService } from '@/cms/services/storage.service';

import Navbar from '@/client/cmps/Navbar';
import MainFooter from '@/client/cmps/MainFooter';
import AuthModal from '@/client/cmps/shared/modals/AuthModal';
import loginModal from '@/client/cmps/shared/modals/LoginModal';
import UserMsg from '@/client/cmps/UserMsg.vue';

export default {
    name: 'App',
    data() {
        return {
            authModal: false,
            loginModal: false,
            showFreeSearchesMsg: false,
            showValidateMsg: false
        };
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
    },
    methods: {
        onLogin() {
            this.loginModal = true;
        },
        onSignUp() {
            this.authModal = true;
        },
        onShowAuth(){
            this.showFreeSearchesMsg = true
            this.authModal = true;
        },
        onShowValidate(){
            this.showValidateMsg = true
            this.authModal = true;
        },
        switchModals(){
            this.loginModal = false;
            this.authModal = true;
        }
    },
    mounted() {
        const hasConsent = storageService.load('cookie-consent');
        if (!hasConsent) {
            eventBus.$emit(EV_show_cookie_notice);
        }
    },
    async created(){
        const BASE_URL = (process.env.NODE_ENV === 'development') ? '//localhost:3000' : '';
        const events = new EventSource(`${BASE_URL}/events`, { withCredentials: true });

        events.onmessage = () => {
            storageService.store('show-other-login', true);
            location.reload()
        };

        if(storageService.load('show-other-login')){
            await this.$store.dispatch('logout')
            eventBus.$emit(EV_show_other_login);
            storageService.remove('show-other-login')
        }

        eventBus.$on(EV_open_singup, this.onSignUp);
        eventBus.$on(EV_open_login, this.onLogin);
        eventBus.$on('app-updated', () => {
            console.log('app component got the update msg');
        });
        await this.$store.dispatch('pullManagementData')
        this.$store.commit('setFreeSearchesCount');
        this.$store.commit('initialLoadingDone')
    },
    components: {
        Navbar,
        MainFooter,
        AuthModal,
        loginModal,
        UserMsg
    },
};
</script>
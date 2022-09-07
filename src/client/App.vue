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
            @closeModal="loginModal = false, showFreeSearchesMsg = false, showNotSameProviderMsg = false"
            @openAuthModal="switchModals"
            :showNotSameProviderMsg="showNotSameProviderMsg"
        />
        <video-modal v-if="videoModal" @closeVideo="videoModal = false"/>
        <user-msg />
        <update-msg />
    </div>
</template>

<script>
import { eventBus, EV_show_cookie_notice, EV_open_signup, EV_open_login, EV_show_other_login } from '@/cms/services/eventBus.service';
import { storageService } from '@/cms/services/storage.service';

import Navbar from '@/client/cmps/Navbar';
import MainFooter from '@/client/cmps/MainFooter';
import AuthModal from '@/client/cmps/shared/modals/AuthModal';
import loginModal from '@/client/cmps/shared/modals/LoginModal';
import videoModal from '@/client/cmps/shared/modals/VideoModal';
import UserMsg from '@/client/cmps/UserMsg.vue';
import UpdateMsg from '@/client/cmps/UpdateMsg.vue';

export default {
    name: 'App',
    data() {
        return {
            authModal: false,
            loginModal: false,
            showFreeSearchesMsg: false,
            showValidateMsg: false,
            showNotSameProviderMsg: false,
            videoModal: false
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
        onLoginNotSameProvider() {
            this.loginModal = true;
            this.showNotSameProviderMsg = true
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
        },
        async connectUser(){
            await this.$store.dispatch('getUserInfo');
            await this.$store.dispatch('getUserSearches');
            if(this.$store.getters.loggedInUser && this.$store.getters.loggedInUser.type === 'subscribed'){
                const user = JSON.parse(JSON.stringify(this.$store.getters.loggedInUser))
                if(user.purchases.length && typeof user.purchases[0].until === 'number' && user.purchases[0].until < Date.now()){
                user.purchases[0].until = 'Done'
                user.type = 'registered'
                user.trialTime = null
                await this.$store.dispatch({ type: 'updateLoggedInUser', user });
                user.type = 'was subscribed'
                await this.$store.dispatch({ type: 'updateAutoPilotContact', user});
                }
            }
        },
        async removeServiceWorker(){
            const registrations = await navigator.serviceWorker.getRegistrations()
            if (registrations.length) {
                for (let registration of registrations) {
                    registration.unregister();
                }
            }
        }
    },
    mounted() {
        const hasConsent = storageService.load('cookie-consent');
        if (!hasConsent) {
            eventBus.$emit(EV_show_cookie_notice);
        }
    },
    async created(){
        await this.removeServiceWorker()

        await this.$store.dispatch('pullManagementData')
        const BASE_URL = (process.env.NODE_ENV === 'development') ? '//localhost:3000' : '';
        const events = new EventSource(`${BASE_URL}/events`, { withCredentials: true });

        events.onmessage = () => {
            storageService.store('show-other-login', true);
            location.reload()
        };

        await this.connectUser()

        setInterval(this.connectUser, 300000);

        if(storageService.load('show-other-login')){
            await this.$store.dispatch('logout')
            eventBus.$emit(EV_show_other_login);
            storageService.remove('show-other-login')
        }

        eventBus.$on(EV_open_signup, this.onSignUp);
        eventBus.$on(EV_open_login, this.onLogin);
        eventBus.$on('login-not-same-provider', this.onLoginNotSameProvider);
        eventBus.$on('open-video', () => {
            this.videoModal = true
        });
        this.$store.commit('setFreeSearchesCount');
        this.$store.commit('initialLoadingDone')
    },
    destroyed(){
        eventBus.$off(EV_open_signup, this.onSignUp);
        eventBus.$off(EV_open_login, this.onLogin);
        eventBus.$off('login-not-same-provider', this.onLoginNotSameProvider);
        eventBus.$off('open-video', () => {
            this.videoModal = true
        });
    },
    components: {
        Navbar,
        MainFooter,
        AuthModal,
        loginModal,
        UserMsg,
        UpdateMsg,
        videoModal
    },
};
</script>
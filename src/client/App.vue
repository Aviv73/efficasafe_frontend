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
import { eventBus, EV_show_cookie_notice, EV_open_singup, EV_open_login } from '@/cms/services/eventBus.service';
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
        // const BASE_URL = (process.env.NODE_ENV === 'development') ? '//localhost:3000' : '';
        // const events = new EventSource(`${BASE_URL}/events`);

        // events.onmessage = (event) => {
        //     console.log('parsedData', event.data);
        //     console.log('Event from server');
        // };

        eventBus.$on(EV_open_singup, this.onSignUp);
        eventBus.$on(EV_open_login, this.onLogin);
        await this.$store.dispatch('pullManagementData')
        if(!this.$store.getters.loggedInUser){
            try{
                await this.$store.dispatch('getUserInfo');
            }catch(err){
                console.log(err);
            }
        }
        if(this.$store.getters.loggedInUser){
            await this.$store.dispatch('checkIfSession')
        }
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
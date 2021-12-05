<template>
    <transition name="fade">
        <aside
            class="user-msg"
            v-if="isActive"
            :class="{
                'success': status === 'success',
                'error': status === 'error'
            }"
        >
            <div class="main-container">
                <div
                    v-if="isCookieNotice"
                    class="user-msg-cookie-notice"
                >
                    <span />
                    <p class="user-msg-cookie-notice-txt">
                        <span class="user-msg-cookie-notice-title">
                            This site uses cookies.
                        </span>
                        Some of them are essential while others are used
                        to ensure you get the best browsing experience.
                        <router-link
                            class="user-msg-cookie-notice-link"
                            to="/privacy-statement"
                        >
                            Learn more
                        </router-link>
                    </p>
                    <div>
                        <button
                            class="user-msg-cookie-notice-btn"
                            @click="acceptCookies"
                        >
                            Got it
                        </button>
                    </div>
                </div>
                <div v-else-if="isOtherLogin">
                    <p class="user-msg-other-login-txt">
                        <span class="user-msg-other-login-title">
                            A login attempt from another device has caused this device to be disconnected.
                        </span>
                        If it wasn’t you, please <span class="user-msg-other-login-link" @click="goToResetPass">reset your password</span>
                    </p>
                    <div>
                        <button
                            class="user-msg-other-login-btn"
                            @click="closeOtherLogin"
                        >
                            Got it
                        </button>
                    </div>
                </div>
                <div
                    v-else
                    class="flex-center p-relative"
                >
                    <p>
                        {{ msg }}
                    </p> 
                    <button class="user-msg-close-btn" @click="dismissMsg">
                        <close-icon :size="18" />
                    </button>
                </div>
            </div>
        </aside>
    </transition>
</template>

<script>
import { eventBus, EV_show_user_msg, EV_show_cookie_notice, EV_show_other_login } from '@/cms/services/eventBus.service';
import { storageService } from '@/cms/services/storage.service';
import { logService } from '@/cms/services/log.service';


import CloseIcon from 'vue-material-design-icons/Close';

export default {
    timeoutId: null,
    data() {
        return {
            isCookieNotice: false,
            isActive: false,
            isOtherLogin: false,
            msg: '',
            status: ''
        }
    },
    components: {
        CloseIcon
    },
    methods: {
        showMsg(msg, timeout = 3000, status = '') {
            this.status = status;
            this.msg = msg;
            this.isActive = true;

            if (timeout) {
                clearTimeout(this.$options.timeoutId);
                this.$options.timeoutId = setTimeout(() => {
                    this.isActive = false;
                    this.msg = '';
                    this.status = '';
                }, timeout);
            }
        },
        acceptCookies() {
            this.isActive = false;
            this.isCookieNotice = false;
            logService.add({action: 'Accepted cookies'})
            storageService.store('cookie-consent', true);
            this.showMobileMsg()
        },
        showMobileMsg(){
            if(this.$route.matched[0].path === '/search'){
                const didSeeMsg = storageService.load('desktop-recommendation')
                if(window.innerWidth <= 900 && !didSeeMsg){
                    this.showMsg('This application is mobile compatible, but the desktop version is recommended', null)
                    storageService.store('desktop-recommendation', true)
                }
            }
        },
        showCookieNotice() {
            this.isActive = true;
            this.isCookieNotice = true;
        },
        showOtherLoginNotice() {
            this.isActive = true;
            this.isOtherLogin = true;
        },
        closeOtherLogin(){
            this.isActive = false;
            this.isOtherLogin = false;
        },
        goToResetPass(){
            this.$router.push('/email-pass')
            this.closeOtherLogin()
        },
        dismissMsg() {
            clearTimeout(this.$options.timeoutId);
            this.isActive = false;
            this.isCookieNotice = false;
            this.msg = '';
            this.status = '';
        }
    },
    created() {
        eventBus.$on(EV_show_user_msg, this.showMsg);
        eventBus.$on(EV_show_cookie_notice, this.showCookieNotice);
        eventBus.$on(EV_show_other_login, this.showOtherLoginNotice);
    },
    beforeDestroy() {
        eventBus.$off(EV_show_user_msg, this.showMsg);
        eventBus.$off(EV_show_cookie_notice, this.showCookieNotice);
        eventBus.$off(EV_show_other_login, this.showOtherLoginNotice);
    }
}
</script>
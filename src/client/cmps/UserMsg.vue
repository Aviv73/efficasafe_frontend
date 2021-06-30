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
import { eventBus, EV_show_user_msg, EV_show_cookie_notice } from '@/cms/services/eventBus.service';
import { storageService } from '@/cms/services/storage.service';

import CloseIcon from 'vue-material-design-icons/Close';

export default {
    timeoutId: null,
    data() {
        return {
            isCookieNotice: false,
            isActive: false,
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
            storageService.store('cookie-consent', true);
        },
        showCookieNotice() {
            this.isActive = true;
            this.isCookieNotice = true;
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
    },
    beforeDestroy() {
        eventBus.$off(EV_show_user_msg, this.showMsg);
        eventBus.$off(EV_show_cookie_notice, this.showCookieNotice);
    }
}
</script>
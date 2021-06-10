<template>
    <transition name="fade">
        <aside class="user-msg" v-if="isActive">
            <div class="main-container">
                <div class="flex-center p-relative">
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
import { eventBus, EV_show_user_msg } from '@/cms/services/eventBus.service';

import CloseIcon from 'vue-material-design-icons/Close';

export default {
    timeoutId: null,
    data() {
        return {
            isActive: false,
            msg: ''
        }
    },
    components: {
        CloseIcon
    },
    methods: {
        showMsg(msg, timeout = 3000) {
            this.msg = msg;
            this.isActive = true;

            clearTimeout(this.$options.timeoutId);
            this.$options.timeoutId = setTimeout(() => {
                this.isActive = false;
                this.msg = '';
            }, timeout);
        },
        dismissMsg() {
            clearTimeout(this.$options.timeoutId);
            this.isActive = false;
            this.msg = '';
        }
    },
    created() {
        eventBus.$on(EV_show_user_msg, this.showMsg);
    },
    beforeDestroy() {
        eventBus.$off(EV_show_user_msg, this.showMsg);
    }
}
</script>
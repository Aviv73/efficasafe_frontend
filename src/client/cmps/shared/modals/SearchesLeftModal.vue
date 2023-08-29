<template>
    <aside class="searches-left-modal">
        <header class="searches-left-modal-header">
            <button class="close-btn" @click="reset">
                <close-icon :size="14" />
            </button>
        </header>
        <main class="searches-left-modal-content">
            <img src="@/client/assets/imgs/flat-logo.webp" alt="Logo" />
            <p class="searches-left-modal-content-txt font-medium">
                Only 5 free searches left
            </p>
            <button class="btn" @click="onOpenSignup">Register for free trial</button>
        </main>
        <footer class="searches-left-modal-footer">
            <button class="searches-left-modal-footer-btn" @click="reset">
                Not now
            </button>
        </footer>
    </aside>
</template>

<script>
import { userService } from '@/cms/services/user.service';
import { eventBus, EV_open_signup } from '@/cms/services/eventBus.service';

import CloseIcon from 'vue-material-design-icons/Close';

export default {
    data() {
        return {
            search: userService.getEmptySearch(),
            msg: '',
            showReplaceBtn: false
        }
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        }
    },
    methods: {
        reset() {
            this.$emit('close-modal');
        },
        onOpenSignup() {
            eventBus.$emit(EV_open_signup)
            this.$emit('close-modal');
        }
    },
    components: {
        CloseIcon
    }
}
</script>
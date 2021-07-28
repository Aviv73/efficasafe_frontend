<template>
    <aside class="save-search-modal">
        <header class="save-search-modal-header">
            <button
                class="close-btn"
                @click="reset"
            >
                <close-icon :size="14" />
            </button>
        </header>
        <main class="save-search-modal-content">
            <p class="save-search-modal-content-txt font-medium">
                Please provide a name for your search
            </p>
            <div class="save-search-modal-content-input">
                <input
                    type="text"
                    placeholder="Client name / Search title"
                    v-model="search.title"
                    @keypress.enter="onSaveSearch"
                    @input="msg = ''"
                />
            </div>
            <p class="save-search-modal-content-msg font-medium">
                {{ msg }}
            </p>
        </main>
        <footer class="save-search-modal-footer">
            <button
                class="save-search-modal-footer-btn"
                @click="reset"
            >
                Cancel
            </button>
            <button
               class="save-search-modal-footer-btn save-btn"
               :class="{ 'replace-btn': showReplaceBtn }"
               :disabled="!search.title"
               @click="onSaveSearch"
            >
                {{ showReplaceBtn ? 'Replace saved search' : 'Save' }}
            </button>
        </footer>
    </aside>
</template>

<script>
import { userService } from '@/cms/services/user.service';
import { eventBus, EV_show_user_msg } from '@/cms/services/eventBus.service';

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
        async onSaveSearch() {
            if (!this.search.title) {
                this.msg = 'Name / title is required';
                return;
            }
            this.search.url = `${window.location.origin}${this.$route.fullPath}`;
            this.search.at = Date.now();
            const search = JSON.parse(JSON.stringify(this.search));
            const user = JSON.parse(JSON.stringify(this.loggedInUser));
            
            const searchIdx = user.searches.findIndex(search => search.title === this.search.title);
            
            if (searchIdx === -1) {
                user.searches.push(search);
                await this.saveAccount(user);
            } else {
                if (this.showReplaceBtn) {
                    user.searches.splice(searchIdx, 1, search);
                    await this.saveAccount(user);
                    return;
                }
                this.msg = `Search '${this.search.title}' allready exists...`;
                this.showReplaceBtn = true;
            }
        },
        async saveAccount(user) {
            await this.$store.dispatch({ type: 'updateLoggedInUser', user });
            eventBus.$emit(EV_show_user_msg, 'Your search has been saved. You can find it at your account page', 5000);
            this.reset();
        },
        reset() {
            this.search = userService.getEmptySearch();
            this.msg = '';
            this.showReplaceBtn = false;
            this.$emit('close-modal');
        }
    },
    components: {
        CloseIcon
    }
}
</script>
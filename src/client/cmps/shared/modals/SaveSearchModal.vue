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
                    @keypress.enter="saveSearch"
                />
            </div>
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
               :disabled="!search.title"
               @click="saveSearch"
            >
                Save
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
            search: userService.getEmptySearch()
        }
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        }
    },
    methods: {
        async saveSearch() {
            if (!this.search.title) return;
            this.search.url = `${window.location.origin}${this.$route.fullPath}`;
            this.search.at = Date.now();
            const search = JSON.parse(JSON.stringify(this.search));
            const user = JSON.parse(JSON.stringify(this.loggedInUser));
            
            user.searches.push(search);
            await this.$store.dispatch({ type: 'updateLoggedInUser', user });
            eventBus.$emit(EV_show_user_msg, 'Your search has been saved. You can find it at your account page', 5000);
            this.reset();
        },
        reset() {
            this.search = userService.getEmptySearch();
            this.$emit('close-modal');
        }
    },
    components: {
        CloseIcon
    }
}
</script>
<template>
    <section>
        <aside v-if="isLoading" class="loader-container">
            <loader />
            <p class="loader-txt">Saving & encrypting can take a few seconds, please be patient</p>
        </aside>
        <aside v-else class="save-search-modal">
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
                <div class="save-search-modal-content-input mid">
                    <input
                        type="text"
                        placeholder="Patient name / Search title"
                        v-model="search.title"
                        @keypress.enter="onSaveSearch"
                        @input="msg = '';showReplaceBtn = false;"
                    />
                </div>
                <p class="save-search-modal-content-txt font-medium mid">or</p>
                <div class="save-search-modal-content-input">
                    <select class="gray" name="" id="" @change="updateSearchTitle">
                        <option class="gray" value="" disabled selected hidden>Select an existing search</option>
                        <option style="color: black;" v-for="name in userSearchesNames" :key="name" :value="name">{{name}}</option>
                    </select>
                </div>
                <p class="save-search-modal-content-msg font-medium padding-lr">
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
    </section>
</template>

<script>
import { userService } from '@/cms/services/user.service';
import { eventBus, EV_show_user_msg } from '@/cms/services/eventBus.service';

import Loader from '@/client/cmps/common/icons/Loader';
import CloseIcon from 'vue-material-design-icons/Close';

export default {
    data() {
        return {
            search: userService.getEmptySearch(),
            msg: '',
            showReplaceBtn: false,
            isLoading: false
        }
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        userSearches() {
            return this.$store.getters.userSearches;
        },
        userSearchesNames(){
            return this.userSearches.map(s => s.title)
        }
    },
    methods: {
        async onSaveSearch() {
            if (!this.search.title) {
                this.msg = 'Name / title is required';
                return;
            }
            
            let endpoint
            let strings = this.$route.fullPath.split('/')
            if(this.$route.fullPath.includes('positive-boosters')){
                strings[2] = strings[2].slice(17,strings[2].length)
                endpoint = strings.join('/')
            }else if(this.$route.fullPath.includes('what-to-monitor')){
                strings[2] = strings[2].slice(15,strings[2].length)
                endpoint = strings.join('/')
            }else endpoint = this.$route.fullPath

            const filteredEndpoint = endpoint.split('&').filter(str => {
                return !str.includes('isImported') && !str.includes('nonExisting')
            }).join('&')

            this.search.url = `${window.location.origin}${filteredEndpoint}`;
            this.search.at = Date.now();
            this.search.materials = this.$store.getters.materials
            const search = JSON.parse(JSON.stringify(this.search));
            const user = JSON.parse(JSON.stringify(this.loggedInUser));
            
            const searchIdx = this.userSearches.findIndex(search => search.title === this.search.title);
            
            if (searchIdx === -1) {
                await this.saveToAccount(user._id, search, searchIdx);
            } 
            else {
                if (this.showReplaceBtn) {
                    await this.saveToAccount(user._id, search, searchIdx);
                    return;
                }
                this.msg = `Search '${this.search.title}' already exists, sure you want to replace it?`;
                this.showReplaceBtn = true;
            }
        },
        async saveToAccount(userId, newSearch, searchIdx) {
            this.isLoading = true
            try{
                const data = { userId , newSearch, searchIdx}
                await this.$store.dispatch({ type: 'saveNewSearch', data });
                this.reset();
                await this.$store.dispatch('getUserSearches');
                eventBus.$emit(EV_show_user_msg, 'Your search has been saved. You can find it at your account page', 5000);
            }catch(err){
                eventBus.$emit(EV_show_user_msg, 'Something went wrong, please try again', 5000, 'error');
                this.reset();
            }
        },
        updateSearchTitle(ev){
            this.search.title = ev.target.value
        },
        reset() {
            this.search = userService.getEmptySearch();
            this.msg = '';
            this.showReplaceBtn = false;
            this.isLoading = false
            this.$emit('close-modal');
        }
    },
    components: {
        Loader,
        CloseIcon
    }
}
</script>
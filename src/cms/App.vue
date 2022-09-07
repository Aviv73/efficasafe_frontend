<template>
    <v-app>
        <nav-bar />
        <v-main class="app-main-container">
            <app-messages />
            <router-view class="app-main-view" />
        </v-main>
    </v-app>
</template>

<script>
import navBar from '@/cms/cmps/NavBar';
import appMessages from '@/cms/cmps/general/AppMessages';

export default {
    name: 'App',

    components: {
        navBar,
        appMessages,
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
    },
    methods: {
        loadData() {
            const filterBy = {};
            this.$store.dispatch({ type: 'loadLabels', filterBy });
        },
        async removeServiceWorker() {
            const registrations = await navigator.serviceWorker.getRegistrations();
            if (registrations.length) {
                for (let registration of registrations) {
                    registration.unregister();
                }
            }
        },
    },
    async created() {
        // await this.removeServiceWorker();
        await this.$store.dispatch('pullManagementData')
        if (this.loggedInUser) this.loadData();
    },
};
</script>

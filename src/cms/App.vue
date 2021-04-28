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
    },

    created() {
        if (this.loggedInUser) this.loadData();
    },
};
</script>

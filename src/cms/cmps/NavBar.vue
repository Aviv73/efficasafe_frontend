<template>
    <section class="nav-bar">
        <v-app-bar class="nav-app" color="info" app dark>
            <v-btn class="nav-link" text tile to="/">
                <div class="logo-container">
                    <span color="white">Efficasafe</span>
                    <img
                        alt="Avatar"
                        :src="require(`@/cms/assets/icons/herb.svg`)"
                    />
                </div>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn class="nav-link" tile color="white" text to="/search" v-if="isAdmin || isEditor">Search-Engine</v-btn>
            <v-btn class="nav-link" :class="{ 'error': hasFailedTasks }" tile color="white" text to="/data-integrity" v-if="isAdmin || isEditor">
                Alerts
            </v-btn>
            <v-btn class="nav-link" tile color="white" text to="/material" v-if="isAdmin || isEditor">Materials</v-btn>
            <v-btn class="nav-link" tile color="white" text to="/label" v-if="isAdmin || isEditor || isAssistantEditor">Labels</v-btn>
            <v-btn
                class="nav-link"
                tile
                color="white"
                text
                to="/featured-interaction"
                v-if="isAdmin || isEditor || isAssistantEditor"
                >
                Workshop
            </v-btn>
            <v-btn class="nav-link" tile color="white" text to="/interaction" v-if="isAdmin || isEditor">Interactions</v-btn>
            <v-btn
                class="nav-link"
                tile
                color="white"
                text
                to="/archive"
                v-if="isAdmin"
            >
                Archive
            </v-btn>
            <v-btn
                class="nav-link"
                tile
                color="white"
                text
                to="/user"
                v-if="isAdmin || isSales"
            >
                Users
            </v-btn>
            <v-btn
                class="nav-link"
                tile
                color="white"
                text
                to="/management"
                v-if="isAdmin"
            >
                management
            </v-btn>
            <v-btn
                class="nav-link"
                tile
                color="white"
                text
                to="/upload-data"
                v-if="isAdmin || isEditor"
            >
                Upload Data
            </v-btn>
            <v-btn
                class="nav-link"
                tile
                color="white"
                text
                v-if="loggedInUser"
                @click="logout"
            >
                <v-icon left>mdi-logout</v-icon>Logout
            </v-btn>
        </v-app-bar>
    </section>
</template>

<script>
import { eventBus, EV_has_failed_tasks } from '@/cms/services/eventBus.service';

export default {
    name: 'NavBar',
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        isAdmin() {
            return this.loggedInUser ? this.loggedInUser.role === 'admin' : false;
        },
        isEditor() {
            return this.loggedInUser ? this.loggedInUser.role === 'editor' : false;
        },
        isSales() {
            return this.loggedInUser ? this.loggedInUser.role === 'sales' : false;
        },
        isAssistantEditor() {
            return this.loggedInUser ? this.loggedInUser.role === 'assistantEditor' : false;
        },
        hasFailedTasks() {
          return this.$store.getters.hasFailedTasks;
        }
    },
    methods: {
        logout() {
            this.$store.commit({ type: 'logout' });
            window.location.replace(window.location.origin);
        },
        setNotf() {
            this.$store.commit({
              type: 'setHasFailedTasks',
              hasTasks: true
            });
        }
    },
    created() {
        eventBus.$on(EV_has_failed_tasks, this.setNotf);
    },
    beforeDestroy() {
        eventBus.$off(EV_has_failed_tasks, this.setNotf);
    },
};
</script>
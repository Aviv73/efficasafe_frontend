<template>
    <section class="nav-bar">
        <div class="nav-bar-cms">
            <v-btn class="nav-link" text tile to="/">
                <div class="logo-container">
                    <span>Efficasafe</span>
                    <img
                        alt="Avatar"
                        :src="require(`@/cms/assets/icons/herb.svg`)"
                    />
                </div>
            </v-btn>
            <v-btn
                class="nav-link"
                tile
                color="white"
                text
                to="/search"
                v-if="isAdmin || isEditor"
                >Search-Engine</v-btn
            >
            <v-btn
                class="nav-link"
                :class="{ error: hasFailedTasks || hasFailedLogs }"
                tile
                color="white"
                text
                to="/data-integrity"
                v-if="isAdmin || isEditor"
            >
                Alerts
            </v-btn>
            <v-btn
                class="nav-link"
                tile
                color="white"
                text
                to="/material"
                v-if="isAdmin || isEditor"
                >Materials</v-btn
            >
            <v-btn
                class="nav-link"
                tile
                color="white"
                text
                to="/label"
                v-if="isAdmin || isEditor || isAssistantEditor"
                >Labels</v-btn
            >
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
            <v-btn
                class="nav-link"
                tile
                color="white"
                text
                to="/interaction"
                v-if="isAdmin || isEditor"
                >Interactions</v-btn
            >
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
                to="/coupon"
                v-if="isAdmin"
            >
                coupons
            </v-btn>
            <v-btn
                class="nav-link"
                tile
                color="white"
                text
                to="/statistics"
                v-if="isAdmin"
            >
                statistics
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
                @click="backToSite"
            >
                <v-icon left>mdi-logout</v-icon>back to site
            </v-btn>
        </div>
    </section>
</template>

<script>
import { eventBus, EV_has_failed_tasks, EV_has_failed_logs } from '@/cms/services/eventBus.service';

export default {
    name: 'NavBar',
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        isAdmin() {
            return this.loggedInUser
                ? this.loggedInUser.role === 'admin'
                : false;
        },
        isEditor() {
            return this.loggedInUser
                ? this.loggedInUser.role === 'editor'
                : false;
        },
        isSales() {
            return this.loggedInUser
                ? this.loggedInUser.role === 'sales'
                : false;
        },
        isAssistantEditor() {
            return this.loggedInUser
                ? this.loggedInUser.role === 'assistantEditor'
                : false;
        },
        hasFailedTasks() {
            return this.$store.getters.hasFailedTasks;
        },
        hasFailedLogs() {
            return this.$store.getters.hasFailedLogs;
        },
    },
    methods: {
        backToSite() {
            window.location.replace(window.location.origin);
        },
        setNotf() {
            this.$store.commit({
                type: 'setHasFailedTasks',
                hasTasks: true,
            });
        },
        setFailedLogs(){
            this.$store.commit({
                type: 'setHasFailedLogs',
                hasLogs: true,
            });
        }
    },
    created() {
        eventBus.$on(EV_has_failed_tasks, this.setNotf);
        eventBus.$on(EV_has_failed_logs, this.setFailedLogs);
    },
    beforeDestroy() {
        eventBus.$off(EV_has_failed_tasks, this.setNotf);
        eventBus.$off(EV_has_failed_logs, this.setFailedLogs);
    },
};
</script>
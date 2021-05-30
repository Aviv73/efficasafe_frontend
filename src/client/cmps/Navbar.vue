<template>
    <nav class="navbar">
        <div class="main-container">
            <div class="flex-space-between">
                <div class="navbar-msgs flex-center">
                    <div
                        class="flex-center"
                        v-if="!loggedInUser"
                    >
                        {{ isScreenNarrow ? 'Get a Free trial' : '' }}
                        <chevron-right-icon
                            class="flex-center"
                            :size="20"
                            v-if="!isScreenNarrow && loggedInUser"
                        />
                    </div>

                    <div class="flex-center" v-else>
                        <div class="flex-center" v-if="!isScreenNarrow">
                            <img
                                class="nav-user-img"
                                v-if="loggedInUser.picture"
                                :src="loggedInUser.picture"
                                alt="User's picture"
                            />
                            <p>
                                {{ `Hi ${loggedInUser.nickname}` }}
                            </p>
                            <p class="seperator">|</p>
                        </div>
                        <div
                            class="flex-center"
                            v-if="!loggedInUser.isSubscribe"
                        >
                            <p v-if="freeTrialTime < 14 && freeTrialTime > 0">
                                {{
                                    isScreenNarrow
                                        ? `Free Trial -  ${freeTrialTime} days left`
                                        : `Free Trial - you have ${freeTrialTime} days left`
                                }}
                            </p>
                        </div>
                        <div class="flex-center" v-if="loggedInUser">
                            <chevron-right-icon
                                class="flex-center"
                                :size="20"
                                v-if="!isScreenNarrow"
                            />
                        </div>
                    </div>
                </div>
                <ul class="navbar-nav">
                    <li class="navbar-nav-item">
                        <button :class="{ highlight: !loggedInUser }">
                            Subscribe
                        </button>
                    </li>
                    <li class="navbar-nav-item">
                        <button
                            v-if="!loggedInUser"
                            class="login-btn"
                            @click="onLogin"
                        >
                            Login
                        </button>

                        <button v-else class="logout-btn" @click="onLogout">
                            Log Out
                        </button>
                    </li>
                    <li class="navbar-nav-item">
                        <button
                            v-if="!loggedInUser"
                            class="login-btn"
                            @click="onSignUp"
                        >
                            SignUp
                        </button>
                    </li>
                    <li class="navbar-nav-item link">
                        <router-link to="/search">Search</router-link>
                    </li>
                    <li class="navbar-nav-item link">
                        <router-link to="/about">About us</router-link>
                    </li>
                </ul>
                <button class="navbar-toggle" @click="toggleNavActive">
                    <dots-horizontal-icon v-if="isScreenNarrow" />
                    <span v-else>More...</span>
                </button>
                <div
                    class="navbar-overlay"
                    :class="{ active: isNavActive }"
                    @click.self="toggleNavActive"
                >
                    <ul
                        class="navbar-side-nav"
                        :class="{ active: isNavActive }"
                        v-hammer:swipe.right="toggleNavActive"
                    >
                        <button
                            class="navbar-side-nav-close-btn"
                            @click="toggleNavActive"
                        >
                            <close-icon />
                        </button>
                        <img
                            src="@/client/assets/imgs/logo-white.png"
                            alt="Efficasafe"
                            class="navbar-side-nav-logo"
                        />
                        <li class="navbar-side-nav-item">
                            <button class="subscribe-btn">Subscribe</button>
                        </li>
                        <li class="navbar-side-nav-item">
                            <button
                                v-if="!loggedInUser"
                                @click="onLogin"
                            >
                                Login
                            </button>
                            <button
                                v-else
                                @click="onLogout"
                            >
                                Logout
                            </button>
                        </li>

                        <li class="navbar-side-nav-item">
                            <router-link to="/search" @click.native="toggleNavActive">
                                Search
                            </router-link>
                        </li>
                        <li class="navbar-side-nav-item">
                            <router-link to="/about" @click.native="toggleNavActive">
                                About us
                            </router-link>
                        </li>
                        <li class="navbar-side-nav-item">
                            <router-link to="/contact" @click.native="toggleNavActive">
                                Contact us
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight';
import CloseIcon from 'vue-material-design-icons/Close';
import DotsHorizontalIcon from 'vue-material-design-icons/DotsHorizontal';
export default {
    name: 'Navbar',
    data: () => ({
        isNavActive: false,
    }),
    computed: {
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        },
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        freeTrialTime() {
            const {
                loggedInUser: { resgisteredTime, trialTime },
            } = this.$store.getters;

            const timeLeft = trialTime - resgisteredTime;
            const daysLeft = timeLeft / (1000 * 3600 * 24);
            return daysLeft > 1 ? Math.floor(daysLeft) : Math.ceil(daysLeft);
        },
    },
    methods: {
        toggleNavActive() {
            this.isNavActive = !this.isNavActive;
        },
        onLogin() {
            this.$emit('login');
        },
        onSignUp() {
            this.$emit('signup');
        },
        onLogout() {
            this.$store.dispatch({ type: 'logout' });
            if (this.$route.path !== '/') {
                this.$router.push('/');
            }
        },
    },
    components: {
        ChevronRightIcon,
        CloseIcon,
        DotsHorizontalIcon,
    },
};
</script>
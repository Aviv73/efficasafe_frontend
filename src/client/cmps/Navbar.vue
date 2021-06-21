<template>
    <nav
        class="navbar"
        :class="{ 'light': isNavIntersecting }"
        ref="navbar"
    >
        <div class="main-container">
            <div class="flex-space-between">
                <div class="navbar-msgs flex-center">
                    <div class="flex-center" v-if="loggedInUser">
                        <div class="flex-center" v-if="!isScreenNarrow">
                            <dropdown>
                                <template #activator>
                                    <img
                                        class="nav-user-img"
                                        v-if="loggedInUser.picture"
                                        :src="loggedInUser.picture"
                                        alt="User's picture"
                                    />
                                </template>
                                <template #content>
                                    <div class="navbar-user-dropdown">
                                        <div class="navbar-user-dropdown-links">
                                            <router-link
                                                to="account"
                                                class="navbar-user-dropdown-item"
                                            >
                                                Account
                                            </router-link>
                                            <router-link
                                                to="contact"
                                                class="navbar-user-dropdown-item"
                                            >
                                                Contact
                                            </router-link>
                                        </div>
                                        <button class="navbar-user-dropdown-item" @click="onLogout">
                                            Logout
                                        </button>
                                    </div>
                                </template>
                            </dropdown>
                            <p>
                                {{ `Hi ${loggedInUser.nickname}` }}
                            </p>
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
                    </div>
                </div>
                <ul class="navbar-nav">
                    <li class="navbar-nav-item">
                        <button :class="{ highlight: !loggedInUser || isNavIntersecting }">
                            Subscribe
                        </button>
                    </li>
                    <li class="navbar-nav-item">
                        <button
                            v-if="!loggedInUser"
                            class="login-btn"
                            id="loginBtn"
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
                            id="signupBtn"
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
                    <menu-icon title="" />
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
                            <close-icon title="" />
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
                        <li class="navbar-side-nav-item" v-if="loggedInUser">
                            <router-link to="/account" @click.native="toggleNavActive">
                                Account
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
import Dropdown from '@/client/cmps/common/Dropdown';

import CloseIcon from 'vue-material-design-icons/Close';
import MenuIcon from 'vue-material-design-icons/Menu';

export default {
    name: 'Navbar',
    data: () => ({
        isNavActive: false,
        isNavIntersecting: false
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
        setNavClassName() {
            if (this.$route.name !== 'Home') {
                this.isNavIntersecting = false;
                return;
            }
            const intersectingEl = document.querySelector('section.home-content');
            const elNav = this.$refs.navbar;
            this.isNavIntersecting = window.scrollY >= (intersectingEl.offsetTop - elNav.offsetHeight);
        }
    },
    mounted() {
        document.addEventListener('scroll', this.setNavClassName);
    },
    beforeDestroy() {
        document.removeEventListener('scroll', this.setNavClassName);
    },
    components: {
        CloseIcon,
        MenuIcon,
        Dropdown
    },
};
</script>
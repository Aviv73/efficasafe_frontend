<template>
    <nav
        class="navbar no-print"
        :class="{ 'light': isNavIntersecting }"
        ref="navbar"
    >
        <div class="main-container">
            <div class="flex-space-between">
                <div class="navbar-msgs flex-center">
                    <div class="flex-center">
                        <dropdown v-if="loggedInUser">
                            <template #activator>
                                <div class="flex-align-center">
                                    <span>
                                        {{ loggedInUser.username }} 
                                    </span>
                                    <menu-down-icon title="" class="dropdown--animate" />
                                </div>
                            </template>
                            <template #content>
                                <div class="navbar-user-dropdown">
                                    <div class="navbar-user-dropdown-links">
                                        <router-link
                                            to="/account"
                                            class="navbar-user-dropdown-item"
                                        >
                                            Account
                                        </router-link>
                                        <router-link
                                            to="/contact"
                                            class="navbar-user-dropdown-item"
                                        >
                                            Contact us
                                        </router-link>
                                    </div>
                                    <button class="navbar-user-dropdown-item" @click="onLogout">
                                        Logout
                                    </button>
                                </div>
                            </template>
                        </dropdown>
                        <div
                            class="flex-center"
                            v-if="loggedInUser && loggedInUser.type !== 'subscribed'"
                        >
                            <p v-if="!loggedInUser.email_verified">Verifiy your email for a free trial</p>
                            <p v-else-if="freeTrialTime > 0">
                                {{freeTrialMsg}}
                            </p>
                            <p v-else>| Your free trial has ended - Subscribe Now</p>
                        </div>
                        <button v-if="!isScreenNarrow && ($route.name === 'Results' || $route.name === 'Boosters' || $route.name === 'InteractionDetails' || $route.name === 'VinteractionDetails')" 
                        @click="activeReleventTour"
                        class="tour-btn">
                            Take a tour
                        </button>
                    </div>
                </div>
                <ul class="navbar-nav">
                    <li class="navbar-nav-item">
                        <router-link to="/" title="Home">
                            <home-icon title="" :size="20" />
                        </router-link>
                    </li>
                    <li v-if="!loggedInUser || loggedInUser.type !== 'subscribed'" class="navbar-nav-item">
                        <button
                            :class="{ highlight: !loggedInUser || isNavIntersecting }"
                            @click="onSubscribe"
                            title="Subscribe"
                        >
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
                    <li class="navbar-nav-item" v-if="!loggedInUser">
                        <button
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
                <button class="navbar-toggle" @click="toggleNavActive" title="Side menu">
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
                            <button
                                v-if="!loggedInUser || loggedInUser.type !== 'subscribed'"
                                class="subscribe-btn"
                                @click="onSubscribe"
                            >
                                Subscribe
                            </button>
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
                            <router-link to="/" @click.native="toggleNavActive">
                                Home
                            </router-link>
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
                            <router-link to="/principles-and-processes" @click.native="toggleNavActive">
                                Editorial principles
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

import { eventBus } from '@/cms/services/eventBus.service';

import Dropdown from '@/client/cmps/common/Dropdown';

import CloseIcon from 'vue-material-design-icons/Close';
import MenuIcon from 'vue-material-design-icons/Menu';
import MenuDownIcon from 'vue-material-design-icons/MenuDown';
import HomeIcon from 'vue-material-design-icons/Home';

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
            const {loggedInUser: { trialTime }} = this.$store.getters;
            const timeLeft = trialTime - Date.now();
            const daysLeft = timeLeft / (1000 * 3600 * 24);
            return  daysLeft > 0 ? Math.ceil(daysLeft) : 0
        },
        freeTrialMsg(){
            if(this.isScreenNarrow){
                if(this.freeTrialTime === 1) return `| Free Trial -  ${this.freeTrialTime} day left`
                return `| Free Trial -  ${this.freeTrialTime} days left`
            }
            if(this.freeTrialTime === 1) return `| Free Trial - you have ${this.freeTrialTime} day left`
            return `| Free Trial - you have ${this.freeTrialTime} days left`
        }
    },
    methods: {
        activeReleventTour(){
            if(this.$route.name === 'Results'){
                eventBus.$emit('start-tour')
            }
            if(this.$route.name === 'Boosters'){
                eventBus.$emit('start-boosters-tour')
            }
            if(this.$route.name === 'InteractionDetails' || this.$route.name === 'VinteractionDetails'){
                eventBus.$emit('start-interaction-tour')
            }
        },
        toggleNavActive() {
            this.isNavActive = !this.isNavActive;
        },
        onSubscribe() {
            // this.$router.push('/subscribe')
            alert('Subscription will be available soon. In the meantime your free trial will be extended')
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
        Dropdown,
        MenuDownIcon,
        HomeIcon
    },
};
</script>
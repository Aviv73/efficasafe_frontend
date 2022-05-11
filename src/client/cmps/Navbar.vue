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
                                    <span v-if="updatedCount" class="updated" title="Updated interactions">{{updatedCount}}</span>
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
                                            <span v-if="updatedCount" class="account-updated" title="Updated interactions">{{updatedCount}}</span>
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
                            <template v-if="loggedInUser.type === 'trial'">
                                <p v-if="freeTrialTime > 0">
                                    {{freeTrialMsg}}
                                </p>
                                <p v-else>| Your free trial has ended - Subscribe Now</p>
                            </template>
                            <p v-else-if="!loggedInUser.email_verified">Verify your email for a free trial</p>
                        </div>
                        <button v-if="!isScreenNarrow && ($route.name === 'Results' || $route.name === 'Boosters' || $route.name === 'InteractionDetails' || $route.name === 'VinteractionDetails')" 
                        @click="activeReleventTour"
                        :title="tourBtnTitle"
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
                    <li v-if="!loggedInUser || loggedInUser.type !== 'subscribed'" class="navbar-nav-item" >
                        <button
                            class="subscribe-btn"
                            @click="onSubscribe"
                            title="Subscribe"
                        >
                            Subscribe
                        </button>
                    </li>
                    <li v-if="!loggedInUser" class="navbar-nav-item">
                        <button
                            class="login-btn"
                            id="loginBtn"
                            @click="onLogin"
                        >
                            Login
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
                        <li v-if="!loggedInUser" class="navbar-side-nav-item">
                            <button
                                @click="onLogin"
                            >
                                Login
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

import { eventBus, EV_update_nav } from '@/cms/services/eventBus.service';

import Dropdown from '@/client/cmps/common/Dropdown';

import CloseIcon from 'vue-material-design-icons/Close';
import MenuIcon from 'vue-material-design-icons/Menu';
import MenuDownIcon from 'vue-material-design-icons/MenuDown';
import HomeIcon from 'vue-material-design-icons/Home';

export default {
    name: 'Navbar',
    data: () => ({
        isNavActive: false,
        isNavIntersecting: false,
        updatedUserSearches: null
    }),
    computed: {
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        },
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        userSearches() {
            return this.$store.getters.userSearches;
        },
        freeTrialTime() {
            const {loggedInUser: { trialTime }} = this.$store.getters;
            const timeLeft = trialTime - Date.now();
            const daysLeft = timeLeft / (1000 * 3600 * 24);
            return  daysLeft > 0 ? Math.ceil(daysLeft) : 0
        },
        tourBtnTitle(){
            if(this.$route.name === 'Results'){
                return 'Get to know our search features'
            }
            if(this.$route.name === 'Boosters'){
                return 'Get to know the Optimizers'
            }
            return 'Get to know the interaction structure'
        },
        freeTrialMsg(){
            if(this.isScreenNarrow){
                if(this.freeTrialTime === 1) return `| Free Trial -  ${this.freeTrialTime} day left`
                return `| Free Trial -  ${this.freeTrialTime} days left`
            }
            if(this.freeTrialTime === 1) return `| Free Trial - you have ${this.freeTrialTime} day left`
            return `| Free Trial - you have ${this.freeTrialTime} days left`
        },
        updatedCount(){
            let updatesMap = {}
            if(!this.updatedUserSearches && !this.userSearches) return 0
            const searches = this.updatedUserSearches || this.userSearches
            searches.forEach(search => {
                if(search.updates && search.updates.length){
                    search.updates.forEach(update => {
                        if(!updatesMap[update.interactionName]) updatesMap[update.interactionName] = true
                    })
                }
            });
            return Object.keys(updatesMap).length
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
            this.$router.push('/subscribe')
        },
        onLogin() {
            this.$emit('login');
        },
        onSignUp() {
            this.$emit('signup');
        },
        async onLogout() {
            await this.$store.dispatch({ type: 'logout' });
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
    created(){
        eventBus.$on(EV_update_nav, (searches) =>{
            this.updatedUserSearches = searches
        })
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
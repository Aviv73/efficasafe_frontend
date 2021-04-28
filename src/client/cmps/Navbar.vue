<template>
    <nav class="navbar">
        <div class="main-container">
            <div class="flex-space-between">
                <div class="navbar-msgs flex-center">
                    <div
                        class="un-logged user-trial flex-center"
                        v-if="!loggedInUser"
                    >
                        {{
                            isScreenNarrow
                                ? 'Get a Free trial'
                                : 'Try our onboarding wizard'
                        }}
                        <chevron-right-icon
                            class="flex-center"
                            :size="20"
                            v-if="!isScreenNarrow"
                        />
                    </div>

                    <div class="logged-in" v-else>
                        <div class="hi-user flex-center">
                            <img
                                v-if="loggedInUser.picture"
                                :src="loggedInUser.picture"
                                alt=""
                                class="nav-user-img"
                            />
                            <p class="user-name">
                                {{ `Hi ${loggedInUser.name.split(' ')[0]}` }}
                            </p>
                            <p class="seperator">|</p>
                        </div>
                        <div
                            class="free-trial flex-center"
                            v-if="!loggedInUser.isSubscribe"
                        >
                            <p v-if="freeTrialTime < 14 && freeTrialTime > 0">
                                {{
                                    `Free Trial - you have ${freeTrialTime} days left`
                                }}
                            </p>
                            <p class="seperator">|</p>
                        </div>
                        <div class="user-trial flex-center" v-if="loggedInUser">
                            {{
                                isScreenNarrow
                                    ? 'Get a Free trial'
                                    : 'Try our onboarding wizard'
                            }}
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
                        <router-link to="/">News</router-link>
                    </li>
                    <li class="navbar-nav-item link">
                        <router-link to="/">Articles</router-link>
                    </li>
                    <li class="navbar-nav-item link">
                        <router-link to="/">About us</router-link>
                    </li>
                </ul>
                <button class="navbar-toggle" @click="toggleNavActive">
                    <dots-horizontal-icon v-if="isScreenNarrow" />
                    <span v-else>More...</span>
                </button>
                <ul
                    class="navbar-mobile-nav"
                    :class="{ active: isNavActive }"
                    v-hammer:swipe.right="toggleNavActive"
                >
                    <button
                        class="navbar-mobile-nav-close-btn"
                        @click="toggleNavActive"
                    >
                        <close-icon />
                    </button>
                    <img
                        src="@/client/assets/imgs/logo-white.png"
                        alt="Efficasafe"
                        class="navbar-mobile-nav-logo"
                    />
                    <li class="navbar-mobile-nav-item">
                        <button class="subscribe-btn">Subscribe</button>
                    </li>
                    <li class="navbar-mobile-nav-item">
                        <button>Login</button>
                    </li>

                    <li class="navbar-mobile-nav-item">
                        <router-link to="/">News</router-link>
                    </li>
                    <li class="navbar-mobile-nav-item">
                        <router-link to="/">Articles</router-link>
                    </li>
                    <li class="navbar-mobile-nav-item">
                        <router-link to="/">About us</router-link>
                    </li>
                    <li class="navbar-mobile-nav-item">
                        <router-link to="/">Contact us</router-link>
                    </li>
                </ul>
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
            return 13;
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

<style lang="scss" scoped>
.navbar-msgs {
    padding-left: 40px;
}
.hi-user {
    & .nav-user-img {
        width: 24px;
        border-radius: 50%;
        margin-right: 10px;
        margin-left: 40px;
    }
}
.seperator {
    margin: 0 14px 0 14px;
}
</style>
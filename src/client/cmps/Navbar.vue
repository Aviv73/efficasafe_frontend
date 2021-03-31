<template>
    <nav class="navbar">
        <div class="main-container">
            <div class="navbar-content">
                <div class="navbar-msgs">
                    <span>
                        {{ (isScreenNarrow) ? 'Get a Free trial' : 'Try our onboarding wizard' }}
                        <font-awesome-icon icon="chevron-right" v-if="!isScreenNarrow" />
                    </span>
                </div>
                <ul class="navbar-nav">
                    <li class="navbar-nav-item">
                        <button :class="{ 'highlight': !loggedInUser }">Subscribe</button>
                    </li>
                    <li class="navbar-nav-item">
                        <button v-if="!loggedInUser" class="login-btn">Login</button>
                        <button v-else class="logout-btn">Log Out</button>
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
                    <font-awesome-icon
                        v-if="isScreenNarrow"
                        icon="ellipsis-h"
                        class="fa-2x"
                    />
                    <span v-else>More...</span>
                </button>
                <ul
                    class="navbar-mobile-nav"
                    :class="{ active: isNavActive }"
                    v-hammer:swipe.right="toggleNavActive"
                >
                    <button class="navbar-mobile-nav-close-btn" @click="toggleNavActive">
                        <font-awesome-icon icon="times" />
                    </button>
                    <img src="@/client/assets/imgs/logo-white.png" alt="Efficasafe" class="navbar-mobile-nav-logo" />
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
export default {
    name: 'Navbar',
    data: () => ({
        isNavActive: false
    }),
    computed: {
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        },
        loggedInUser() {
            return null;
        }
    },
    methods: {  
        toggleNavActive() {
            this.isNavActive = !this.isNavActive;
        }
    }
}
</script>
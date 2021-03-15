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
                <ul class="navbar-actions">
                    <li class="navbar-actions-item">
                        <button class="subscribe-btn">Subscribe</button>
                    </li>
                    <li class="navbar-actions-item">
                        <button>Login</button>
                    </li>
                </ul>
                <button class="navbar-toggle" @click="toggleNavActive">
                    <font-awesome-icon icon="ellipsis-h" class="fa-2x" />
                </button>
                <ul
                    class="navbar-nav"
                    :class="{ active: isNavActive }"
                    v-hammer:swipe.right="toggleNavActive"
                >
                    <button class="navbar-nav-close-btn" @click="toggleNavActive">
                        <font-awesome-icon icon="times" />
                    </button>
                    <img src="@/client/assets/imgs/logo-white.png" alt="Efficasafe" class="navbar-nav-logo" />
                    <li class="navbar-nav-item">
                        <button class="subscribe-btn">Subscribe</button>
                    </li>
                    <li class="navbar-nav-item">
                        <button>Login</button>
                    </li>
                    <li class="navbar-nav-item">
                        News
                    </li>
                    <li class="navbar-nav-item">
                        Articles
                    </li>
                    <li class="navbar-nav-item">
                        About us
                    </li>
                    <li class="navbar-nav-item">
                        More...
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
        isScreenNarrow: window.innerWidth < 900,
        isNavActive: false
    }),
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize);
        });
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    },
    methods: {  
        onResize() {
            this.isScreenNarrow = window.innerWidth < 900;
        },
        toggleNavActive() {
            this.isNavActive = !this.isNavActive;
        }
    }
}
</script>
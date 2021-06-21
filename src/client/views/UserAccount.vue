<template>
    <section class="user-account">
        <div class="user-account-container side-by-side-container">
            <span class="brim-start" />
            <div class="user-account-navigation flex-coloumn">
                <router-link to="/" class="user-account-navigation-logo">
                    <img :src="require('@/client/assets/imgs/logo.png')" alt="Logo" />
                </router-link>
                <nav class="user-account-navigation-nav font-medium">
                    <ul>
                        <li>
                            <router-link to="/account" class="nav-link">
                                Saved searches
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/account/edit" class="nav-link">
                                Personal details
                            </router-link>
                        </li>
                        <!-- <li>
                            <router-link to="/account/purchases" class="nav-link">
                                Purchase history
                            </router-link>
                        </li> -->
                    </ul>
                </nav>
            </div>
            <router-view />
            <span class="brim-end" />
        </div>
    </section>
</template>

<script>
export default {
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        }
    },
    created() {
        console.log(this.loggedInUser);
    }
}
</script>
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
                        <li>
                            <router-link to="/account/purchases" class="nav-link">
                                Purchase history
                            </router-link>
                        </li>
                    </ul>
                </nav>
            </div>
            <transition name="fade" mode="out-in">
                <router-view :key="$route.name" />
            </transition>
            <span class="brim-end" :class="{ 'on-edit': $route.name === 'UserEdit' }" />
        </div>
    </section>
</template>

<script>
export default {
    name: 'UserAccount',
    metaInfo () {
        return {
            title: 'Account'
        }
    },
}
</script>
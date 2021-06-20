<template>
    <section class="user-account">
        <div class="user-account-container side-by-side-container">
            <span class="brim-start" />
            <div class="user-account-navigation">
                <router-link to="/">
                    <img :src="require('@/client/assets/imgs/flat-logo.png')" alt="Logo" />
                </router-link>
                <nav>
                    <ul>
                        <li>
                            <router-link to="/account/searches">
                                Saved searches
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/account/details">
                                Personal details
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/account/history">
                                Purchase history
                            </router-link>
                        </li>
                    </ul>
                </nav>
            </div>
            <main>

            </main>
            <span class="brim-end" />
        </div>
    </section>
</template>

<script>
export default {

}
</script>
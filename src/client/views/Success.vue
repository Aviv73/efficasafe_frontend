<template>
    <section class="success-page">
        <img class="logo" src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
        <template v-if="isLoading">
            <loader/>
            <h3>Do not close this page...</h3>
        </template>
        <template v-else>
            <h2>Congratulations!</h2>
            <h3>We’re glad that you’ve decided to join us</h3>
            <small>Please note: Credit charge will show as Naturopedia LTD</small>
            <button class="btn go-search-btn" @click="$router.push('/search')">
                Let’s search Interactions!
            </button>
        </template>
    </section>
</template>

<script>
import { userService } from '@/cms/services/user.service';
import Loader from '@/client/cmps/common/icons/Loader';

import { googleAnalyticsService } from '../../cms/services/googleAnalyticsService';

export default {
    data(){
        return {
            isLoading: true
        }
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
    },
    async created() {
        await this.$store.dispatch('getUserInfo');
        const user = await userService.getById(this.loggedInUser._id);
        googleAnalyticsService.shootPurchaseEvent(user.purchases.find(c => c.until === 'Ongoing'));
        this.$store.commit({ type: 'setLoggedInUser', user });
        await userService.updateSession(user)
        this.isLoading = false
    },
    components:{
        Loader
    }
};
</script>

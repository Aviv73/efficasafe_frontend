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
            <button class="btn" @click="$router.push('/search')">
                Let’s search Interactions!
            </button>
        </template>
    </section>
</template>

<script>
// import { userService } from '@/cms/services/user.service';
import Loader from '@/client/cmps/common/icons/Loader';

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
        // const user = await userService.getById(this.loggedInUser._id);
        // this.$store.commit({ type: 'setLoggedInUser', user });
        // await userService.updateSession(user)
        this.isLoading = false
    },
    components:{
        Loader
    }
};
</script>

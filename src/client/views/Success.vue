<template>
    <section class="success-page">
        <img class="logo" src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
        <h2>Congratulations!</h2>
        <h3>We’re glad that you’ve decided to join us</h3>
        <button class="btn" @click="$router.push('/search')">
            Let’s search Interactions!
        </button>
    </section>
</template>

<script>
import { userService } from '@/cms/services/user.service';

export default {
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
    },
    async created() {
        await this.$store.dispatch('getUserInfo');
        const user = await userService.getById(this.loggedInUser._id);
        this.$store.commit({ type: 'setLoggedInUser', user });
        await userService.updateSession(user)
        console.log('DONE!!!!');
    },
};
</script>

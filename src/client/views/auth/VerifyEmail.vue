<template>
    <p v-if="!showError">Verifing email...</p>
    <p v-else>Something went wrong, couldn't verify email</p>
</template>

<script>
import { userService } from '@/cms/services/user.service';

export default {
    name: 'VerifyEmail',
    data() {
        return {
            showError: false
        }
    },
    methods: {
        async VerifyEmail() {
            try {
                const { token } = this.$route.params;
                const res = await userService.verifyEmail(token);
                if (res.success){
                    const user = await this.$store.dispatch('getUserInfo');
                    await this.$store.dispatch({type: 'updateAutoPilotContact', user});
                    this.$router.push('/?congratulations=yes');
                }else{
                    this.showError = true;
                    console.log('Error');
                }
            } catch (e) {
                this.showError = true;
            }
        },
    },
    created() {
        this.VerifyEmail();
    },
};
</script>
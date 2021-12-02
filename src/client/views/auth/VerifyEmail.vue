<template>
    <p>Verifing email...</p>
</template>

<script>
import { userService } from '@/cms/services/user.service';

export default {
    methods: {
        async VerifyEmail() {
            const { token } = this.$route.params;
            const res = await userService.verifyEmail(token);
            if (res.success){
                const user = await this.$store.dispatch('getUserInfo');
                await this.$store.dispatch({type: 'updateAutoPilotContact', user});
                this.$router.push('/?congratulations=yes');
            }else{
                console.log('Error');
            }
        },
    },
    created() {
        this.VerifyEmail();
    },
};
</script>
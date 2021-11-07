<template>
    <p>Verifing email...</p>
</template>

<script>
import { userService } from '@/cms/services/user.service';

export default {
    data() {
        return {
            isVerified: false,
        };
    },
    computed:{
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        managementData(){
            return this.$store.getters.getManagementData;
        },
    },
    methods: {
        async VerifyEmail() {
            const { token } = this.$route.params;
            const res = await userService.verifyEmail(token);
            if (res.success){
                const user = JSON.parse(JSON.stringify(this.loggedInUser))
                user.type = 'trial';
                const TrailDurationByDays = 1000 * 60 * 60 * 24 * this.managementData.freeTrailDaysNum;
                user.trialTime = Date.now() + TrailDurationByDays;
                user.email_verified = true
                await this.$store.dispatch({ type: 'updateLoggedInUser', user }),
                this.$router.push('/?congratulations=yes');
            }else{
                console.log('Error');
            }
        },
    },
    async created() {
        try{
            await this.$store.dispatch('getUserInfo');
            await this.$store.dispatch('pullManagementData')
            this.VerifyEmail();
        }catch(err){
            console.log(err);
        }
    },
};
</script>
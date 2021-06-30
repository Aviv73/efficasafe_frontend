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
    methods: {
        async VerifyEmail() {
            const { token } = this.$route.params;
            const res = await userService.verifyEmail(token);
            if (res.status === 200) this.$router.push('/?congratulations=yes');
        },
    },
    created() {
        this.VerifyEmail();
    },
};
</script>
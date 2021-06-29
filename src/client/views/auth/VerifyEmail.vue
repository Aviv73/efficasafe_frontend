<template>
    <h1>Verifing email...</h1>
</template>

<script>
import Axios from 'axios';

export default {
    data() {
        return {
            isVerified: false,
        };
    },
    methods: {
        async VerifyEmail() {
            const BASE_URL =
                process.env.NODE_ENV === 'development'
                    ? '//localhost:3000/api'
                    : '/api';

            const { token } = this.$route.params;
            const res = await Axios.get(
                `${BASE_URL}/account/verifyEmail?token=${token}`
            );
            if (res.status === 200) this.$router.push('/?congratulations=yes');
        },
    },
    created() {
        this.VerifyEmail();
    },
};
</script>
<template>
    <section>
        <input type="text" v-model="newPass" placeholder="pass" />
        <input type="text" v-model="checkPass" placeholder="verified pass" />
        <button @click="onResetPass">RESET PASS</button>
    </section>
</template>

<script>
import { userService } from '../../cms/services/user.service';
export default {
    data() {
        return {
            newPass: '',
            checkPass: '',
            token: '',
        };
    },
    methods: {
        async onResetPass() {
            if (this.newPass !== this.checkPass) return;
            const res = await userService.resetPassword(
                this.newPass,
                this.token
            );
            if (res) this.$router.push('/passwordChanged');
        },
    },
    created() {
        this.token = this.$route.params.token;
    },
};
</script>

<style>
</style>
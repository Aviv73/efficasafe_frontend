<template>
    <div class="auth-modal">
        <div class="auth-modal-cover" @click.stop="closeModal()"></div>
        <div>
            <div class="inside-modal center">
                <img src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
                <div class="auth-modal-small-title font-medium">
                    <p>Congratulations!</p>
                    <p>Your password has been changed!</p>
                </div>

                <button class="btn" @click="closeModal">Close</button>
            </div>
        </div>
    </div>
</template>




<script>
export default {
    methods: {
        closeModal() {
            this.$emit('closeModal');
            this.$router.push('/');
        },
    },
};
</script>



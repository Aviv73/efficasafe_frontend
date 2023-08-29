<template>
    <div class="auth-modal">
        <div class="auth-modal-cover" @click.stop="closeModal()"></div>
        <div>
            <div class="auth-modal-content txt-center">
                <img class="logo" src="@/client/assets/imgs/flat-logo.webp" alt="Logo" />
                <div class="auth-modal-small-title font-medium gap-lg">
                    Congratulations!
                    <span class="d-block">Your password has been changed!</span>
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



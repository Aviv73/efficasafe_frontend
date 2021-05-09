<template>
    <div class="sign-up-modal">
        <div class="black-screen" @click.stop="closeModal()"></div>
        <div>
            <div class="inside-modal center">
                <img src="../../../assets/imgs/flat-logo.png" alt="" />
                <div class="con-title">
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



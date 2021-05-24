<template>
    <div class="sign-up-modal">
        <div class="black-screen" @click.stop="closeModal()"></div>
        <div>
            <button class="close-modal" @click="closeModal">X</button>
            <div class="inside-modal center">
                <img src="../../../assets/imgs/flat-logo.png" alt="Logo" />
                <div class="con-title">
                    <p>Congratulations!</p>
                    <p>You now have 2 weeks of free trial</p>
                </div>

                <button class="btn" @click="$router.push('/search')">
                    Let`s search Interactions!
                </button>

                <p class="assistance">
                    Subscribe and search with no time limit
                </p>
                <p class="desc">
                    Join the elite physicians, pharmacists, and caregivers who
                    already enjoy full access to the most up-to-date,
                    evidence-based interactions database.
                </p>
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



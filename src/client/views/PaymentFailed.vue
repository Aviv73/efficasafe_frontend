<template>
  <section class="success-page">
    <img class="logo" src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
    <h2>Somthing went wrong</h2>
    <h3>For some reason the payment did not go through, please try again</h3>
    <button class="btn" @click="$router.push('/payment')">Try again</button>
  </section>
</template>

<script>

export default {
  computed: {
    loggedInUser(){
        return this.$store.getters.loggedInUser;
    }
  },
  async created() {
      await this.$store.dispatch({type: 'getUserInfo'})
    // update the user autopilot profile and transfer him to a "failed to pay" list 
  },
};
</script>

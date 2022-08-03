<template>
  <section class="success-page">
    <img class="logo" src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
    <h2>Somthing went wrong</h2>
    <h3>For some reason the payment did not go through, please try again</h3>
    <div class="failed-btns">
      <button class="btn" @click="$router.push('/subscribe')">Try again</button>
      <span>or</span>
      <button class="btn" @click="$router.push('/contact')">Contact us</button>
    </div>
  </section>
</template>

<script>

import { httpService } from "@/cms/services/http.service";

export default {
  computed: {
    loggedInUser(){
        return this.$store.getters.loggedInUser;
    }
  },
  async created() {
      await this.$store.dispatch({type: 'getUserInfo'})
      const task = {
        isFailedPayment: true,
        user: JSON.parse(JSON.stringify(this.loggedInUser))
      }
      await httpService.post('task', task)
  },
};
</script>

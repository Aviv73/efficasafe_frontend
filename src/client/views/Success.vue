<template>
  <section class="success-page">
    <img class="logo" src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
    <h2>Congratulations!</h2>
    <h3>We’re glad that you’ve decided to join us</h3>
    <button class="btn" @click="$router.push('/search')">Let’s search Interactions!</button>
  </section>
</template>

<script>

import { manageService } from '@/cms/services/manage.service'
import { storageService } from '@/cms/services/storage.service';

export default {
  computed: {
    selectedPlan(){
        return this.$store.getters.getSelectedPaymentPlan
    },
    loggedInUser(){
        return this.$store.getters.loggedInUser;
    }
  },
  methods: {
    getPlan(management, text){
      if(text.includes('-')){
        const couponName = text.split('-')[0].trim()
        return management.coupons.find(c => c.code === couponName)
      }else{
        return management.plans.find(p => p.durationTxt === this.$route.query.Info)
      }
    }
  },
  async created() {
    const isPaying = storageService.load('isPaying')
    if(isPaying){
      await this.$store.dispatch({type: 'getUserInfo'})
      storageService.remove('isPaying')
      const user = JSON.parse(JSON.stringify(this.loggedInUser))
      const managementData = await manageService.list()
      const plan = this.getPlan(managementData, this.$route.query.Info)
      if(plan){
          user.type = 'subscribed'
          const purchase = {
              at: Date.now(),
              duration: plan.duration,
              price: plan.priceISL * plan.duration,
              plan: plan.durationTxt,
              until: 'Ongoing',
              HKId: this.$route.query.HKId
          }
          user.purchases.unshift(purchase)
          await this.$store.dispatch({ type: 'updateLoggedInUser', user });
          // update the user autopilot profile and transfer him to a "subscribed" list
      }
    }
  },
};
</script>

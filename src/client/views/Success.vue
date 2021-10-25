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
  data() {
    return {
      pay:false
    };
  },
  computed: {
    selectedPlan(){
        return this.$store.getters.getSelectedPaymentPlan
    },
    loggedInUser(){
        return this.$store.getters.loggedInUser;
    }
  },
  methods: {
    
  },
  async created() {
    //Coupons still needs to be implemented, needs to understand if we can pass more parameters on url
    const isPaying = storageService.load('isPaying')
    if(isPaying){
      await this.$store.dispatch({type: 'getUserInfo'})
      storageService.remove('isPaying')
      const user = JSON.parse(JSON.stringify(this.loggedInUser))
      const managementData = await manageService.list()
      const plan = managementData.plans.filter(p => p.durationTxt === this.$route.query.Info)[0] // or by coupon code (from url)
      const months = +plan.duration
      if(plan){
          const timeToAdd = 1000 * 60 * 60 * 24 * 30 * months
          if(user.type === 'trial' || user.type === 'registered'){
            user.trialTime = Date.now() + timeToAdd 
            user.type = 'subscribed'
          }else{
            user.trialTime += timeToAdd
          }
          //add copune bonus time to user: user.bonusTime = X
          user.purchases.unshift({
              at: Date.now(),
              price: plan.priceUSD * plan.duration,
              plan: plan.durationTxt,
              until: user.trialTime
          })
          await this.$store.dispatch({ type: 'updateLoggedInUser', user });
      }
    }
  },
};
</script>

<template>
  <section class="subscribe-page">
    <img class="logo" src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
    <div class="positive-container">
        <div class="positive">
            <img src="@/client/assets/icons/arrow-up.svg" alt="">
            <div class="positive-txt-container">
                <h4>improve</h4>
                <h3>clinical outcomes</h3>
            </div>
        </div>
        <div class="positive">
            <img src="@/client/assets/icons/arrow-down.svg" alt="">
            <div class="positive-txt-container">
                <h4>reduce</h4>
                <h3>medical errors</h3>
            </div>
        </div>
        <div class="positive">
            <img src="@/client/assets/icons/minimize.svg" alt="">
            <div class="positive-txt-container">
                <h4>minimize</h4>
                <h3>risk</h3>
            </div>
        </div>
        <div class="positive">
            <img src="@/client/assets/icons/discover.svg" alt="">
            <div class="positive-txt-container">
                <h4>discover</h4>
                <h3>synergistics</h3>
            </div>
        </div>
    </div>
    <h3 class="headline">Choose your payment plan</h3>
    <div class="cards-container">
        <div v-for="(plan,idx) in plans" :key="idx" class="card" :class="{'with-stars': plan.isRecommended}">
            <div v-if="plan.isRecommended" class="stars">
                <star-icon v-for="idx in 5" :key="idx" class="star-icon"></star-icon>
            </div>
            <h3 class="card-title" :class="{'margin-top': plan.isRecommended}" >{{plan.durationTxt}}</h3>
            <p class="card-price">{{localCurrency}} <span>{{getPriceByLocation(plan)}}</span> /mo</p>
            <button class="card-btn" @click="onSelectPrice($event,plan)">select</button>
        </div>
    </div>
    <div class="benefits-container">
        <h4 class="benefits-title">Benefits and Features </h4>
        <div class="benefit">
            <img src="@/client/assets/imgs/logo-symbol-sm.png" alt="">
            <p><span>Increase patient safety</span> via access to up to date Drug-Drug and Herb-Supplement-Drug interaction data</p>
        </div>
        <div class="benefit">
            <img src="@/client/assets/imgs/logo-symbol-sm.png" alt="">
            <p><span>Make accurate clinical decisions</span> by leveraging extensive evidence-based information on clinical efficacy and patient safety</p>
        </div>
        <div class="benefit">
            <img src="@/client/assets/imgs/logo-symbol-sm.png" alt="">
            <p><span>Cross check</span> multiple Drug-Drug and Herb-Supplement-Drug interactions instantly</p>
        </div>
        <div class="benefit">
            <img src="@/client/assets/imgs/logo-symbol-sm.png" alt="">
            <p><span>Get concise recommendations, summaries, and detailed study reviews</span></p>
        </div>
        <div class="benefit">
            <img src="@/client/assets/imgs/logo-symbol-sm.png" alt="">
            <p><span>Gain</span> valuable insights on which clinical and laboratory parameters to <span>monitor</span> per individual patient profiles/interactions</p>
        </div>
        <div class="benefit">
            <img src="@/client/assets/imgs/logo-symbol-sm.png" alt="">
            <p><span>Optimize integrative treatment</span> via vital information on both negative and synergistic Herb-Supplement-Drug interactions</p>
        </div>
        <div class="benefit">
            <img src="@/client/assets/imgs/logo-symbol-sm.png" alt="">
            <p><span>Save patients' pharmacological profiles.</span> Manage, save, and track updated patient drug-herb-supplement profiles and records quickly and easily</p>
        </div>
        <div class="benefit">
            <img src="@/client/assets/imgs/logo-symbol-sm.png" alt="">
            <p><span>Empower patients</span> with reliable, referenced information to help them better understand their medications and/or supplements while identifying any potentially dangerous interactions before they occur</p>
        </div>
    </div>
  </section>
</template>

<script>

import { manageService } from '@/cms/services/manage.service'
import { locationService } from '@/cms/services/location.service'
import StarIcon from 'vue-material-design-icons/Star';

export default {
  data() {
    return {
      plans: null,
      localCurrency: null
    };
  },
  computed: {
    
  },
  methods: {
    getPriceByLocation(plan){
        if(this.localCurrency === 'ILS') return plan.priceISL
        if(this.localCurrency === 'EUR') return plan.priceEUR
        return plan.priceUSD
    },
    onSelectPrice(ev, plan){
        this.$store.commit({ type: 'setSelectedPaymentPlan', SelectedPlan: plan });
        this.$router.push('/payment')
    }
  },
  async created() {
      this.localCurrency = await locationService.getLocalCurrency()
      const managementData = await manageService.list()
      this.plans = managementData.plans
  },
  components:{
      StarIcon
  }
};
</script>

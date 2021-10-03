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
        <div v-for="(plan,idx) in plans" :key="idx" class="card">
            <div v-if="plan.isRecommended" class="ribbon">
                <span>Recomended</span> 
            </div>
            <h3 class="card-title">{{plan.durationTxt}}</h3>
            <p class="card-price">{{getCurrencyByLocation()}} <span>{{getPriceByLocation(plan)}}</span> /mo</p>
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
    <div class="cards-container">
        <div v-for="(plan,idx) in plans" :key="idx" class="card">
            <div v-if="plan.isRecommended" class="ribbon">
                <span>Recommended</span> 
            </div>
            <h3 class="card-title">{{plan.durationTxt}}</h3>
            <p class="card-price">{{getCurrencyByLocation()}} <span>{{getPriceByLocation(plan)}}</span> /mo</p>
            <button class="card-btn" @click="onSelectPrice($event,plan)">select</button>
        </div>
    </div>
  </section>
</template>

<script>


export default {
  data() {
    return {
      plans: null
    };
  },
  computed: {
    
  },
  methods: {
    getCurrencyByLocation(){
        return 'USD'
    },
    getPriceByLocation(plan){
        return plan.priceUSD
    },
    onSelectPrice(ev, plan){
        this.$store.commit({ type: 'setSelectedPaymentPlan', SelectedPlan: plan });
        this.$router.push('/payment')
    }
  },
  created() {
    //get plans from server
    this.plans = [
        {_id:'001', priceUSD: 25.99, priceISL: 84.99, priceEUR: 24.99, duration: 30, durationTxt: '1 month plan', isRecommended: false},
        {_id:'002', priceUSD: 12.99, priceISL: 44.99, priceEUR: 11.99, duration: 365, durationTxt: '1 year plan', isRecommended: false},
        {_id:'003', priceUSD: 9.99, priceISL: 35.99, priceEUR: 8.99, duration: 730, durationTxt: '2 years plan', isRecommended: true},
    ]
    //get user contry to show currect prices
  },
};
</script>

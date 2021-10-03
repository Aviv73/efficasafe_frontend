<template>
  <section class="payment-page">
    <img class="logo" src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
    <div v-show="!loggedInUser" class="loggin-container">
        <h3 class="loggin-req">You must be logged in to continue</h3>
        <div>
            <button class="signup-btn" @click="onOpenSignup">Sign Up</button>
            or
            <button class="signup-btn" @click="onOpenLogin">Login</button>
        </div>
    </div>
    <div v-show="loggedInUser" class="form-container">
        <form class="user-registration-form">
            <h3 class="form-title">Please complete your registration</h3>
            <div class="form-input">
                <label for="">
                    <input
                    type="text"
                    placeholder="Enter your phone number"
                    v-model="user.phone"
                    ref="phoneInput"
                    />
                    <span class="label">Enter your phone number</span>
                </label>
            </div>
            <div class="form-input">
                <label for="">
                    <input
                    type="text"
                    placeholder="Enter your Street and house number"
                    v-model="user.address"
                    />
                    <span class="label">Enter your Street and house number</span>
                </label>
            </div>
            <div class="form-input">
                <label for="">
                    <input
                    type="text"
                    placeholder="Enter your City"
                    v-model="user.city"
                    />
                    <span class="label">Enter your City</span>
                </label>
            </div>
            <div class="form-input">
                <label for="">
                    <input
                    type="text"
                    placeholder="Enter your Country"
                    v-model="user.country"
                    />
                    <span class="label">Enter your Country</span>
                </label>
            </div>
            <div class="form-input">
                <label for="">
                    <input
                    type="text"
                    placeholder="Enter your Zip code"
                    v-model="user.zipCode"
                    />
                    <span class="label">Enter your Zip code</span>
                </label>
            </div>
        </form>
    </div>
    <h3 class="headline">Choose your membership payment plan</h3>
    <div class="cards-container">
        <div v-for="(plan,idx) in plans" :key="idx" class="card" :class="{'selected':isSelected(plan._id)}">
            <div v-if="plan.isRecommended" class="ribbon">
                <span>Recommended</span> 
            </div>
            <h3 class="card-title">{{plan.durationTxt}}</h3>
            <p class="card-price">{{getCurrencyByLocation()}} <span>{{getPriceByLocation(plan)}}</span> /mo</p>
            <button class="card-btn" @click="onSelectPrice($event,plan)">select</button>
        </div>
    </div>
    <div class="form-input cupon-input">
        <label for="">
            <input
            type="text"
            placeholder="Cupon Code"
            />
            <span class="label">Cupon Code</span>
        </label>
    </div>
    <button @click="onSubmit" class="payment-btn">Continue to payment</button>
  </section>
</template>

<script>

import intlTelInput from "intl-tel-input";
import { eventBus, EV_show_user_msg, EV_open_singup, EV_open_login } from '@/cms/services/eventBus.service';

export default {
  data() {
    return {
      plans: null,
      selectedPlan: null,
      user: null
    };
  },
  computed: {
    loggedInUser(){
        return this.$store.getters.loggedInUser;
    },
    isSelected(){
        return (id) => {
            if(!this.selectedPlan) return false
            if(id === this.selectedPlan._id) return true
            return false
        }
    }
  },
  methods: {
    getCurrencyByLocation(){
        return 'USD'
    },
    getPriceByLocation(plan){
        return plan.priceUSD
    },
    onSelectPrice(ev, plan){
        this.selectedPlan = plan
        this.$store.commit({ type: 'setSelectedPaymentPlan', SelectedPlan: plan });
    },
    onOpenSignup(){
        eventBus.$emit(EV_open_singup)
    },
    onOpenLogin(){
        eventBus.$emit(EV_open_login)
    },
    checkPhoneIntlValid() {
      if (this.user.phone && !this.user.phone.startsWith("+")) {
        this.user.phone = `+1 ${this.user.phone}`;
      }
    },
    async onSubmit(){
        if(!this.loggedInUser){
            eventBus.$emit(EV_show_user_msg, 'Please Login', 3000);
            return
        }
        this.checkPhoneIntlValid();
        const user = JSON.parse(JSON.stringify(this.user));
        if(!user.phone || !user.address || !user.city || !user.country || !user.zipCode){
            eventBus.$emit(EV_show_user_msg, 'Please complete your registration', 3000, 'error');
            return
        }
        if(!this.selectedPlan){
            eventBus.$emit(EV_show_user_msg, 'Please select a payment plan', 3000, 'error');
            return 
        }
        await Promise.all([
                this.$store.dispatch({ type: 'updateLoggedInUser', user }),
                this.$store.dispatch({ type: 'updateAutoPilotContact', user })
            ]);
        
    }
  },
  watch:{
      loggedInUser(newUser){
          this.user = newUser
      }
  },
  mounted() {
    this.iti = intlTelInput(this.$refs.phoneInput, {
      nationalMode: false,
    });
  },
  created() {
    //get plans from server
    this.plans = [
        {_id:'001', priceUSD: 19, priceILS: 69, priceEUR: 19, duration: 30, durationTxt: '1 month plan', isRecommended: false},
        {_id:'002', priceUSD: 12, priceILS: 39, priceEUR: 12, duration: 365, durationTxt: '1 year plan', isRecommended: false},
        {_id:'003', priceUSD: 9, priceILS: 29, priceEUR: 9, duration: 730, durationTxt: '2 years plan', isRecommended: true},
    ]
    //get selected plan from store
    this.selectedPlan = this.$store.getters.getSelectedPaymentPlan
    this.user = this.$store.getters.loggedInUser || {}
    
    //get user contry to show currect prices
  },
};
</script>

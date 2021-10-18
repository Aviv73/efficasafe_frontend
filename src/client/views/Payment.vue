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
            v-model="couponInput"
            type="text"
            placeholder="Cupon Code"
            @change="onSearchCoupon"
            />
            <span class="label">Cupon Code</span>
        </label>
    </div>
    <div v-if="couponPlan" class="cards-container coupon">
        <div class="card" :class="{'selected':isSelected(couponPlan._id)}">
            <h3 class="card-title">{{couponPlan.durationTxt}}</h3>
            <p class="card-price">{{getCurrencyByLocation()}} <span>{{getPriceByLocation(couponPlan)}}</span> /mo</p>
            <button class="card-btn" @click="onSelectPrice($event,couponPlan)">select</button>
        </div>
    </div>
    <button @click="onSubmit" class="payment-btn">Continue to payment</button>
  </section>
</template>

<script>

import intlTelInput from "intl-tel-input";
import { manageService } from '@/cms/services/manage.service'
import { eventBus, EV_show_user_msg, EV_open_singup, EV_open_login } from '@/cms/services/eventBus.service';
import { storageService } from '@/cms/services/storage.service';
import { paymentService } from '@/cms/services/payment.service';
import config from '../config/index'

export default {
  data() {
    return {
      plans: null,
      coupons: null, 
      couponPlan: null,
      selectedPlan: null,
      couponInput: '',
      user: {}
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
    getReleventCoin(){
        return 2
    },
    getReleventPrice(){
        return this.selectedPlan.priceUSD * this.selectedPlan.duration
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
    onSearchCoupon(){
        this.couponPlan = this.coupons.find(cop => cop.code === this.couponInput)
        this.couponInput = ''
        if(this.couponPlan){
            if(this.couponPlan.validUntil < Date.now()) {
                this.couponPlan = null
                return 
            }
            this.selectedPlan = JSON.parse(JSON.stringify(this.couponPlan))
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
        // Payment!!!
        const key = config.yaadPayKey
        const pass = config.yaadPayPassP
        const masof = config.yaadPayMasof
        const address = encodeURI(user.address)
        const city = encodeURI(user.city)
        const {phone, zipCode, email} = user
        const coin = this.getReleventCoin()
        // const price = 1
        const price = this.getReleventPrice()
        const durationTxt = encodeURI(this.selectedPlan.durationTxt)
        const apiSignAddress = `https://icom.yaad.net/p/?action=APISign&What=SIGN&KEY=${key}&PassP=${pass}&Masof=${masof}&Order=12345678910&Info=${durationTxt}&Amount=${price}&UTF8=True&UTF8out=True&street=${address}&city=${city}&zip=${zipCode}&phone=${phone}&email=${email}&Tash=2&FixTash=False&ShowEngTashText=True&Coin=${coin}&Postpone=False&J5=False&Sign=True&MoreData=True&sendemail=False&SendHesh=True&heshDesc=[0~${durationTxt}~1~${price}]&Pritim=True&PageLang=ENG&tmp=1`
        storageService.store('isPaying', true)
        const res = await paymentService.getEndpoint(apiSignAddress)
        window.location = `https://icom.yaad.net/p/?action=pay&${res.payload}`;
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
  async created() {
      const managementData = await manageService.list()
      this.plans = managementData.plans
      this.coupons = managementData.coupons
      this.selectedPlan = this.$store.getters.getSelectedPaymentPlan
      this.user = this.$store.getters.loggedInUser || {}
    //get user contry to show currect prices
  },
};
</script>

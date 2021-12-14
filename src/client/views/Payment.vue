<template>
  <section class="payment-page">
    <img class="logo" src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
    <div v-show="!loggedInUser" class="login-container">
        <h3 class="login-req">You must be logged in to continue</h3>
        <div>
            <button class="signup-btn" @click="onOpenSignup">Sign Up</button>
            or
            <button class="signup-btn" @click="onOpenLogin">Login</button>
        </div>
    </div>
    <!-- <div v-show="loggedInUser" class="form-container">
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
    </div> -->
    <h3 class="headline">Choose your membership payment plan</h3>
    <div class="cards-container">
        <div v-for="(plan,idx) in plans" :key="idx" class="card" :class="{'with-stars': plan.isRecommended, 'selected':isSelected(plan._id)}">
            <div v-if="plan.isRecommended" class="stars">
                <star-icon v-for="idx in 5" :key="idx" class="star-icon"></star-icon>
            </div>
            <h3 class="card-title" :class="{'margin-top': plan.isRecommended}" >{{plan.durationTxt}}</h3>
            <p class="card-price">{{localCurrency}} <span>{{getPriceByLocation(plan)}}</span> /mo</p>
            <button class="card-btn" @click="onSelectPlan($event,plan)">select</button>
        </div>
    </div>
    <div class="coupon-input-container">
        <input
        v-model="couponInput"
        type="text"
        placeholder="Cupon Code"
        @input="onInputCoupon"
        class="coupon-input"
        :class="{'invalid-input': isCouponInvalid}"
        />
        <button @click="onSearchCoupon" class="coupon-input-btn" :class="{'invalid-btn': isCouponInvalid}" >{{couponBtnTxt}}</button>
    </div>
    <div v-if="couponPlan" class="cards-container coupon">
        <div class="card" :class="{'selected':isSelected(couponPlan._id)}">
            <h3 class="card-title">{{couponPlan.durationTxt}}</h3>
            <p class="card-price">{{localCurrency}} <span>{{getPriceByLocation(couponPlan)}}</span> /mo</p>
            <button class="card-btn" @click="onSelectPlan($event,couponPlan)">select</button>
        </div>
    </div>
    <button @click="onSubmit" :disabled="isLoading" class="payment-btn" :class="{'disabled': isLoading}">
        <div v-if="!isLoading">Continue to payment</div> 
        <div v-else class="loader-container">
            <h2>Loading...</h2><loader class="loader"/>
        </div>
    </button>
    <div class="payment-disclaimer">
        <p>Your subscription will automatically renew every month if you select the Monthly Plan, every 12 months if you select the Annual Plan, or every twenty-four months if you select the Bi-Annual Plan. You will be charged the price listed above for the plan you select, plus applicable taxes, on each renewal until you cancel in your account settings. If you cancel, previous charges will not be refunded, but you may continue to use the service until the end of the term you paid for.</p>
        <p>By clicking the "Continue to payment" button above, you are agreeing to our <a href="/terms-and-conditions">Terms And Conditions</a> and acknowledge that you have read our <a href="/privacy-statement"> Privacy Policy</a>.</p>
    </div>
  </section>
</template>

<script>

import StarIcon from 'vue-material-design-icons/Star';
import Loader from '@/client/cmps/common/icons/Loader';
import { manageService } from '@/cms/services/manage.service'
import { locationService } from '@/cms/services/location.service'
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
      user: {},
      isCouponInvalid: false,
      isLoading: false,
      localCurrency: 'USD'
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
    },
    couponBtnTxt(){
        if(this.isCouponInvalid) return 'coupon invalid'
        return 'submit coupon'
    }
  },
  methods: {
    getPriceByLocation(plan){
        if(this.localCurrency === 'ILS') return plan.priceISL
        if(this.localCurrency === 'EUR') return plan.priceEUR
        return plan.priceUSD
    },
    getReleventCoin(){
        if(this.localCurrency === 'ILS') return 1
        if(this.localCurrency === 'EUR') return 3
        return 2
    },
    getReleventPrice(){
        let price = this.selectedPlan.priceUSD 
        if(this.localCurrency === 'ILS') price = this.selectedPlan.priceISL 
        if(this.localCurrency === 'EUR') price = this.selectedPlan.priceEUR
        return price * this.selectedPlan.duration
    },
    onSelectPlan(ev, plan){
        this.selectedPlan = plan
        this.$store.commit({ type: 'setSelectedPaymentPlan', SelectedPlan: plan });
    },
    onOpenSignup(){
        eventBus.$emit(EV_open_singup)
    },
    onOpenLogin(){
        eventBus.$emit(EV_open_login)
    },
    onInputCoupon(){
        if(this.isCouponInvalid) this.isCouponInvalid = false
    },
    onSearchCoupon(){
        this.couponPlan = this.coupons.find(cop => cop.code === this.couponInput)
        this.couponInput = ''
        if(!this.couponPlan || this.couponPlan.validUntil < Date.now()){
            this.couponPlan = null
            this.isCouponInvalid = true
            return 
        }
        this.selectedPlan = JSON.parse(JSON.stringify(this.couponPlan))
    },
    async onSubmit(){
        if(!this.loggedInUser){
            eventBus.$emit(EV_show_user_msg, 'Please Login', 3000);
            return
        }
        if(!this.selectedPlan){
            eventBus.$emit(EV_show_user_msg, 'Please select a payment plan', 3000, 'error');
            return 
        }
        this.isLoading = true
        const key = config.yaadPayKey
        const pass = config.yaadPayPassP
        const masof = config.yaadPayMasof

        // const address = encodeURI(user.address)
        // const city = encodeURI(user.city)
        // const {phone, zipCode, email} = user
        const {email} = this.user
        const coin = this.getReleventCoin()
        const price = this.getReleventPrice()
        const durationTxt = this.selectedPlan.code ? encodeURI(`${this.selectedPlan.code} - ${this.selectedPlan.durationTxt}`) : encodeURI(this.selectedPlan.durationTxt)
        const duration = +this.selectedPlan.duration
        const apiSignAddress = `https://icom.yaad.net/p/?action=APISign&What=SIGN&KEY=${key}&PassP=${pass}&Masof=${masof}&Order=12345678910&Info=${durationTxt}&Amount=${price}&UTF8=True&UTF8out=True&email=${email}&Tash=999&FixTash=False&ShowEngTashText=True&Coin=${coin}&Postpone=False&J5=False&Sign=True&MoreData=True&sendemail=False&SendHesh=True&heshDesc=[0~${durationTxt}~1~${price}]&Pritim=True&PageLang=ENG&HK=True&freq=${duration}`
        // const apiSignAddress = `https://icom.yaad.net/p/?action=APISign&What=SIGN&KEY=${key}&PassP=${pass}&Masof=${masof}&Order=12345678910&Info=${durationTxt}&Amount=${price}&UTF8=True&UTF8out=True&street=${address}&city=${city}&zip=${zipCode}&phone=${phone}&email=${email}&Tash=999&FixTash=False&ShowEngTashText=True&Coin=${coin}&Postpone=False&J5=False&Sign=True&MoreData=True&sendemail=False&SendHesh=True&heshDesc=[0~${durationTxt}~1~${price}]&Pritim=True&PageLang=ENG&tmp=1&HK=True&freq=${duration}`
        storageService.store('isPaying', true)
        const res = await paymentService.getEndpoint(apiSignAddress)
        this.isLoading = false
        window.location = `https://icom.yaad.net/p/?action=pay&${res.payload}`;
    }
  },
  watch:{
      loggedInUser(newUser){
          this.user = newUser
      }
  },
  async created() {
      const managementData = await manageService.list()
      this.plans = managementData.plans
      this.coupons = managementData.coupons
      this.selectedPlan = this.$store.getters.getSelectedPaymentPlan
      this.user = this.$store.getters.loggedInUser || {}
      this.localCurrency = await locationService.getLocalCurrency()
      if(this.localCurrency !== 'ILS' && this.localCurrency !== 'EUR') this.localCurrency = 'USD'
  },
  components:{
      StarIcon,
      Loader
  }
};
</script>

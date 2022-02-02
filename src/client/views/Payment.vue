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
    <h3 class="headline">Choose your membership payment plan</h3>
    <div class="cards-container">
        <div v-for="(plan,idx) in plans" :key="idx" class="card" :class="{'with-stars': plan.isRecommended, 'selected':isSelected(plan._id)}">
            <div v-if="plan.isRecommended" class="stars">
                <star-icon v-for="idx in 5" :key="idx" class="star-icon"></star-icon>
            </div>
            <h3 class="card-title" :class="{'margin-top': plan.isRecommended}" >{{plan.durationTxt}}</h3>
            <p class="card-price">{{localCurrency}} <span>{{getPriceByLocation(plan)}}</span> /mo</p>
            <button class="card-btn" @click="onSelectPlan($event,plan)">{{selectBtnTxt((plan._id))}}</button>
        </div>
    </div>
    <div class="coupon-input-container">
        <input
        v-model="couponInput"
        type="text"
        placeholder="Coupon Code"
        @input="onInputCoupon"
        class="coupon-input"
        :class="{'invalid-input': isCouponInvalid}"
        />
        <button @click="onSearchCoupon" ref="submitCoupon" class="coupon-input-btn" :class="{'invalid-btn': isCouponInvalid}" >{{couponBtnTxt}}</button>
    </div>
    <div v-if="selectedCoupon" ref="selectedCoupon" class="cards-container coupon">
        <div v-for="(plan,idx) in selectedCoupon.plans" :key="idx" class="card" :class="{'selected':isSelectedCoupon(idx)}">
            <h3 class="card-title">{{plan.durationTxt}}</h3>
            <p class="card-price">{{localCurrency}} <span>{{getPriceByLocation(plan)}}</span> /mo</p>
            <button class="card-btn" @click="onSelectCouponPlan(idx)">{{couponSelectBtnTxt((idx))}}</button>
        </div>
    </div>
    <button @click="onSubmit" :disabled="isLoading" class="payment-btn" :class="{'disabled': isLoading}">
        <div v-if="!isLoading">Continue to payment</div> 
        <div v-else class="payment-loader-container">
            <h2>Loading...</h2><loader class="loader"/>
        </div>
    </button>
    <div class="payment-disclaimer">
        <p>Your subscription will automatically renew every month if you select the Monthly Plan, every 12 months if you select the Annual Plan, or every twenty-four months if you select the Biennial Plan. You will be charged the price listed above for the plan you select, plus applicable taxes, on each renewal until you cancel in your account settings. If you cancel, previous charges will not be refunded, but you may continue to use the service until the end of the term you paid for.</p>
        <p>By clicking the "Continue to payment" button above, you are agreeing to our <a href="/terms-and-conditions">Terms And Conditions</a> and acknowledge that you have read our <a href="/privacy-statement"> Privacy Policy</a>.</p>
    </div>
  </section>
</template>

<script>

import StarIcon from 'vue-material-design-icons/Star';
import Loader from '@/client/cmps/common/icons/Loader';
import { manageService } from '@/cms/services/manage.service'
import { storageService } from '@/cms/services/storage.service';
import { locationService } from '@/cms/services/location.service'
import { eventBus, EV_show_user_msg, EV_open_signup, EV_open_login } from '@/cms/services/eventBus.service';
import { paymentService } from '@/cms/services/payment.service';

export default {
  data() {
    return {
      plans: null,
      coupons: null, 
      selectedCoupon: null,
      selectedPlan: null,
      couponInput: '',
      user: {},
      isCouponInvalid: false,
      isLoading: false,
      localCurrency: null
    };
  },
  computed: {
    loggedInUser(){
        return this.$store.getters.loggedInUser;
    },
    isScreenNarrow() {
        return this.$store.getters.isScreenNarrow;
    },
    isSelected(){
        return (id) => {
            if(!this.selectedPlan) return false
            if(id === this.selectedPlan._id) return true
            return false
        }
    },
    isSelectedCoupon(){
        return (idx) => {
            if(!this.selectedPlan) return false
            if(this.selectedCoupon.plans[idx].priceUSD === this.selectedPlan.priceUSD) return true
            return false
        }
    },
    selectBtnTxt(){
        return (id) => {
            if(!this.selectedPlan) return 'select'
            if(id === this.selectedPlan._id) return 'selected'
            return 'select'
        }
    },
    couponSelectBtnTxt(){
        return (idx) => {
            if(!this.selectedPlan) return 'select'
            if( this.selectedCoupon.plans[idx].priceUSD === this.selectedPlan.priceUSD ) return 'selected'
            return 'select'
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
    getRelevantPrice(){
        let price = this.selectedPlan.priceUSD 
        if(this.localCurrency === 'ILS') price = this.selectedPlan.priceISL 
        if(this.localCurrency === 'EUR') price = this.selectedPlan.priceEUR
        return price * this.selectedPlan.duration
    },
    onSelectPlan(ev, plan){
        this.selectedPlan = plan
        this.$store.commit({ type: 'setSelectedPaymentPlan', SelectedPlan: plan });
    },
    onSelectCouponPlan(idx){
        const plan = JSON.parse(JSON.stringify(this.selectedCoupon.plans[idx]))
        plan.code = this.selectedCoupon.code
        this.selectedPlan = plan
    },
    onOpenSignup(){
        eventBus.$emit(EV_open_signup)
    },
    onOpenLogin(){
        eventBus.$emit(EV_open_login)
    },
    onInputCoupon(){
        if(this.isCouponInvalid) this.isCouponInvalid = false
    },
    onSearchCoupon(){
        const coupon = this.coupons.find(cop => cop.code === this.couponInput)
        if(!coupon || coupon.validUntil < Date.now()) return this.isCouponInvalid = true
        this.selectedCoupon = coupon
    },
    async onSubmit(){
        if(!this.loggedInUser){
            eventBus.$emit(EV_show_user_msg, 'Please signup or login', 3000);
            return
        }
        if(!this.selectedPlan){
            eventBus.$emit(EV_show_user_msg, 'Please select a payment plan', 3000, 'error');
            return 
        }
        this.isLoading = true
        const price = this.getRelevantPrice()
        if(price === 0){
            const user = JSON.parse(JSON.stringify(this.loggedInUser))
            user.type = 'subscribed'
            const purchase = {
                at: Date.now(),
                duration: this.selectedPlan.duration,
                price: 0,
                plan: `${this.selectedPlan.durationTxt}`,
                until: 'Ongoing',
                coupon: this.selectedPlan.code
            }
            user.purchases.unshift(purchase)
            await this.$store.dispatch({ type: 'updateLoggedInUser', user });
            await this.$store.dispatch({ type: 'updateAutoPilotContact', user});
            this.isLoading = false
            this.$router.push('/?subscribed=true')
        }else{
            const url = await paymentService.getEndpoint(this.selectedPlan, this.localCurrency)
            this.isLoading = false
            if(url) window.location = url
            else eventBus.$emit(EV_show_user_msg, 'Something Went wrong, please try again', 5000, 'error');
            
        }
    },
    async createAndDisplayCoupon(){
        if(storageService.load('customCoupon')){
            this.couponInput = storageService.load('customCoupon')
        }else{
            this.couponInput = await manageService.createNewCoupon()
            if(this.couponInput) storageService.store('customCoupon', this.couponInput)
        }
        const managementData = await manageService.list()
        this.coupons = managementData.coupons
        this.$nextTick(() => {
            this.$refs.submitCoupon.click()
            const hight = this.isScreenNarrow ? 800 : 500;  
            window.scrollTo(0, hight);
            if(this.$refs.selectCouponBtn) this.$refs.selectCouponBtn.click()
        })
    }
  },
  watch:{
      loggedInUser(newUser){
          this.user = newUser
      }
  },
  async mounted(){
      if(this.$route.query.cnc){
        await this.createAndDisplayCoupon()
    }
  },
  async created() {
      this.localCurrency = await locationService.getLocalCurrency()
      const managementData = await manageService.list()
      this.plans = managementData.plans
      this.coupons = managementData.coupons
      this.selectedPlan = this.$store.getters.getSelectedPaymentPlan
      this.user = this.$store.getters.loggedInUser || {}
  },
  components:{
      StarIcon,
      Loader
  }
};
</script>

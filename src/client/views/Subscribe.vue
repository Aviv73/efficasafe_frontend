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
    <div v-if="selectedCoupon || plans" class="cards-container" :class="{'justify-center': isCouponZero}">
        <template v-if="!selectedCoupon">
            <div v-for="(plan,idx) in plans" :key="idx" class="card" :class="{'selected':isSelected(plan._id)}" @click="onSelectPlan($event,plan)">
                <div v-if="idx === 1" class="ribbon-container">
                    <img src="@/client/assets/icons/ribbon.svg" alt="">
                    <p class="ribbon-txt">{{percentageSave}}%</p>
                    <p class="ribbon-txt-save">SAVE!</p>
                </div>
                <h3 class="card-title">Individual {{plan.durationTxt}}</h3>
                <p class="card-price">{{localCurrency}} <span>{{getPriceByLocation(plan)}}</span> /mo</p>
                <p class="card-billing-txt">{{billingTxt(plan)}}</p>
                <button class="card-btn">select</button>
            </div>
        </template>
        <template v-if="selectedCoupon">
            <div v-for="(plan,idx) in selectedCoupon.plans" :key="idx" class="card" :class="{'selected':isSelectedCoupon(idx)}" @click="onSelectCouponPlan(idx)">
                <div class="ribbon-container">
                    <img src="@/client/assets/icons/ribbon.svg" alt="">
                    <p class="ribbon-txt ribbon-coupon">COUPON</p>
                    <p class="ribbon-txt-save ribbon-deal">DEAL!</p>
                </div>
                <h3 class="card-title">Individual {{plan.durationTxt}}</h3>
                <p class="card-price">{{localCurrency}} <span>{{getPriceByLocation(plan)}}</span> /mo</p>
                <p class="card-billing-txt">{{billingTxt(plan)}}</p>
                <button class="card-btn">{{couponSelectBtnTxt((idx))}}</button>
            </div>
        </template>
        <div class="card enterprise-card" :class="{'hide': isCouponZero }" @click="openGroupSubModal">
            <h3 class="enterprise-card-title">Institutional</h3>
            <p class="card-txt">Get an offer tailored to your needs</p>
            <button class="card-btn">Get an offer</button>
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
    <button @click="onSubmitPayment" :disabled="isLoadingPayment" class="payment-btn" :class="{'disabled': isLoading}">
        <div v-if="!isLoadingPayment">Continue to payment</div> 
        <div v-else class="payment-loader-container">
            <h2>Loading...</h2><loader class="loader"/>
        </div>
    </button>
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
    <div class="payment-disclaimer">
        <p>Your subscription will automatically renew every month if you select the Monthly Plan, every 12 months if you select the Annual Plan, or every twenty-four months if you select the Biennial Plan. You will be charged the price listed above for the plan you select, plus applicable taxes, on each renewal until you cancel in your account settings. If you cancel, previous charges will not be refunded, but you may continue to use the service until the end of the term you paid for.</p>
        <p>By clicking the "Continue to payment" button above, you are agreeing to our <a href="/terms-and-conditions">Terms And Conditions</a> and acknowledge that you have read our <a href="/privacy-statement"> Privacy Policy</a>.</p>
    </div>
    <modal-wrap
            :isActive="isGroupSubModal"
            @close-modal="closeGroupSubModal"
            >
            <div class="group-sub-modal-container">
                <template v-if="isLoading">
                    <div class="loader-rap">
                        <loader class="loader"/>
                    </div>
                </template>
                <template v-else>
                    <img class="group-sub-modal-container-logo" src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
                    <form @submit.prevent="onSubmit">
                        <h3 v-if="!isShowError">Please fill in the details</h3>
                        <h3 v-else style="color: red">Please fill in all the fields</h3>
                        <input
                            class="reg-input"
                            type="text"
                            placeholder="Institution / Company Name"
                            v-model="groupSubData.companyName"
                            @change="isShowError = false"
                        />
                        <input
                            type="text"
                            class="reg-input"
                            placeholder="Type (e.g. Hospital, Clinic, Etc)"
                            v-model="groupSubData.type"
                            @change="isShowError = false"
                        />
                        <input
                            type="text"
                            class="reg-input"
                            placeholder="Number Of licenses needed"
                            v-model="groupSubData.numberOfEmployees"
                            @change="isShowError = false"
                        />
                        <input
                            type="text"
                            class="reg-input"
                            placeholder="Contact full Name"
                            v-model="groupSubData.contactName"
                            @change="isShowError = false"
                        />
                        <input
                            type="text"
                            class="reg-input"
                            placeholder="Email"
                            v-model="groupSubData.contactEmail"
                            @change="isShowError = false"
                        />
                        <div class="form-input last-input-form">
                            <label for="">
                            <input
                                type="text"
                                placeholder="Phone"
                                v-model="groupSubData.phoneNumber"
                                ref="phoneInput"
                                @countrychange="setPhoneDialCode"
                                @change="isShowError = false"
                            />
                            <span class="label ml">Phone</span>
                            </label>
                        </div>
                        <button>Get a tailored offer</button>
                    </form>
                </template>
            </div>
        </modal-wrap>
  </section>
</template>

<script>

import { manageService } from '@/cms/services/manage.service'
import { locationService } from '@/cms/services/location.service'
import { httpService } from "@/cms/services/http.service";
import { eventBus, EV_show_user_msg, EV_open_login } from '@/cms/services/eventBus.service';
import { paymentService } from '@/cms/services/payment.service';
import { storageService } from '@/cms/services/storage.service';
import intlTelInput from "intl-tel-input";
import ModalWrap from '@/client/cmps/common/ModalWrap';
import Loader from '@/client/cmps/common/icons/Loader';

export default {
  data() {
    return {
      plans: null,
      coupons: null, 
      selectedPlan: null,
      selectedCoupon: null,
      couponInput: '',
      isCouponInvalid: false,
      user: {},
      localCurrency: null,
      isGroupSubModal: false,
      isLoading: false,
      isLoadingPayment: false,
      isShowError: false,
      groupSubData:{
          isGroupSubReq: true,
          contactName: '',
          companyName: '',
          numberOfEmployees: '',
          contactEmail: '',
          phoneNumber:'',
          type: ''
      }
    };
  },
  computed: {
    loggedInUser(){
        return this.$store.getters.loggedInUser;
    },
    isCouponZero(){
        if(this.selectedCoupon){
            let price
            if(this.localCurrency === 'ILS') price = this.selectedCoupon.plans[0].priceISL
            else if(this.localCurrency === 'EUR') price = this.selectedCoupon.plans[0].priceEUR
            else price = this.selectedCoupon.plans[0].priceUSD
            
            if(price === '0' || price === 0) return true
        }
        return false
    },
    billingTxt(){
        return (plan) => {
            if(plan.duration === '1') return 'Billed Monthly'
            return 'Billed Annually'
        }
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
    couponBtnTxt(){
        if(this.isCouponInvalid) return 'coupon invalid'
        return 'submit coupon'
    },
    couponSelectBtnTxt(){
        return (idx) => {
            if(!this.selectedPlan) return 'select'
            if( this.selectedCoupon.plans[idx].priceUSD === this.selectedPlan.priceUSD ) return 'selected'
            return 'select'
        }
    },
    percentageSave(){
        let monthlyPrice = this.localCurrency === 'ILS' ? this.plans[0].priceISL : this.localCurrency === 'EUR' ? this.plans[0].priceEUR : this.plans[0].priceUSD
        let annualPrice = this.localCurrency === 'ILS' ? this.plans[1].priceISL : this.localCurrency === 'EUR' ? this.plans[1].priceEUR : this.plans[0].priceUSD
        const percent = 100 - Math.ceil((100 * annualPrice) / monthlyPrice) 
        return percent
    },
    isScreenNarrow() {
        return this.$store.getters.isScreenNarrow;
    },
  },
  methods: {
    async onSubmitPayment(){
        if(!this.loggedInUser){
            eventBus.$emit(EV_open_login)
            return
        }
        if(!this.selectedPlan){
            eventBus.$emit(EV_show_user_msg, 'Please select a payment plan', 3000, 'error');
            return 
        }
        this.isLoadingPayment = true
        const price = this.getRelevantPrice()
        const user = JSON.parse(JSON.stringify(this.loggedInUser))
        if(price === 0){
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
            this.isLoadingPayment = false
            this.$router.push('/?subscribed=true')
        }else{
            const url = await paymentService.getEndpoint(this.selectedPlan, this.localCurrency)
            user.pressPayment = true
            await this.$store.dispatch({type: 'updateAutoPilotContact', user});
            this.isLoadingPayment = false
            if(url) window.location = url
            else eventBus.$emit(EV_show_user_msg, 'Something Went wrong, please try again', 5000, 'error');
            
        }
    },
    onInputCoupon(){
        if(this.isCouponInvalid) this.isCouponInvalid = false
    },
    onSearchCoupon(){
        const coupon = this.coupons.find(cop => cop.code === this.couponInput)
        if(!coupon || coupon.validUntil < Date.now()) return this.isCouponInvalid = true
        this.selectedCoupon = coupon
    },
    getRelevantPrice(){
        let price = this.selectedPlan.priceUSD 
        if(this.localCurrency === 'ILS') price = this.selectedPlan.priceISL 
        if(this.localCurrency === 'EUR') price = this.selectedPlan.priceEUR
        return price * this.selectedPlan.duration
    },
    getPriceByLocation(plan){
        if(this.localCurrency === 'ILS') return plan.priceISL
        if(this.localCurrency === 'EUR') return plan.priceEUR
        return plan.priceUSD
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
    openGroupSubModal(){
        this.selectedPlan = null
        this.isGroupSubModal = true
    },
    closeGroupSubModal(){
        this.isGroupSubModal = false
    },
    setPhoneDialCode() {
        this.groupSubData.phoneNumber = ''
        this.groupSubData.phoneNumber = this.$refs.phoneInput.value;
    },
    async onSubmit(){
        const isAllField = Object.values(this.groupSubData).every(v => v)
        if(!isAllField){
            this.isShowError = true
            return
        }
        this.isLoading = true
        try{
            await httpService.post('task', this.groupSubData)
            this.closeGroupSubModal()
            eventBus.$emit(EV_show_user_msg, 'Your request was submitted, we will reply as soon as possible', 15000, 'success')
        }catch(err){
            eventBus.$emit(EV_show_user_msg, 'Something went wrong', 5000, 'error')
        }
        this.isLoading = false
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
            window.scrollTo(0, hight - 250);
            if(this.$refs.selectCouponBtn) this.$refs.selectCouponBtn.click()
        })
    }
  },
  watch:{
      loggedInUser(newUser){
          this.user = newUser
      }
  },
  async mounted() {
    this.iti = intlTelInput(this.$refs.phoneInput, {
      nationalMode: false,
    });
    if(this.$route.query.cnc){
        await this.createAndDisplayCoupon()
    }
  },
  async created() {
      this.localCurrency = await locationService.getLocalCurrency()
      const managementData = await manageService.list()
      this.plans = managementData.plans
      this.coupons = managementData.coupons
      this.user = this.$store.getters.loggedInUser || {}
  },
  components:{
      ModalWrap,
      Loader
  }
};
</script>

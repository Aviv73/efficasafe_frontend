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
    <div v-if="plans" class="cards-container">
        <div v-for="(plan,idx) in plans" :key="idx" class="card" :class="{'with-stars': plan.isRecommended}">
            <div v-if="plan.isRecommended" class="stars">
                <star-icon v-for="idx in 5" :key="idx" class="star-icon"></star-icon>
            </div>
            <h3 class="card-title" :class="{'margin-top': plan.isRecommended}" >Individual {{plan.durationTxt}}</h3>
            <p class="card-price">{{localCurrency}} <span>{{getPriceByLocation(plan)}}</span> /mo</p>
            <button class="card-btn" @click="onSelectPrice($event,plan)">select</button>
        </div>
        <div  class="card enterprise-card">
            <h3 class="enterprise-card-title">Institutional</h3>
            <p class="card-txt">Get an offer tailored to your needs</p>
            <button @click="openGroupSubModal" class="card-btn">Get an offer</button>
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
import { eventBus, EV_show_user_msg } from '@/cms/services/eventBus.service';
import intlTelInput from "intl-tel-input";
import StarIcon from 'vue-material-design-icons/Star';
import ModalWrap from '@/client/cmps/common/ModalWrap';
import Loader from '@/client/cmps/common/icons/Loader';

export default {
  data() {
    return {
      plans: null,
      localCurrency: null,
      isGroupSubModal: false,
      isLoading: false,
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
    },
    openGroupSubModal(){
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
    }
  },
  mounted() {
    this.iti = intlTelInput(this.$refs.phoneInput, {
      nationalMode: false,
    });
  },
  async created() {
      this.localCurrency = await locationService.getLocalCurrency()
      const managementData = await manageService.list()
      this.plans = managementData.plans
  },
  components:{
      StarIcon,
      ModalWrap,
      Loader
  }
};
</script>

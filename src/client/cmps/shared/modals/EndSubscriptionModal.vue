<template>
    <div class="end-subscription-modal">
        <button class="end-subscription-modal-close-btn" @click="closeModal">X</button>
        <div v-if="isLoading" class="loader flex-center">
            <loader />
        </div>
        <div v-else class="end-subscription-modal-content">
            <div class="header flex-align-end">
                <img class="logo" :src="require('@/client/assets/imgs/logo-symbol.png')" alt="">
                <h2 class="title">Hello {{loggedInUser.username}}</h2>
            </div>
            <div class="form">
                <img class="bgc-img" :src="require('@/client/assets/imgs/end-sub-bgc.svg')" alt="">
                <div class="top-txt-container">
                    <p class="txt">We’re sorry to see you go!</p>
                    <p class="txt">To help us improve Efficasafe, please state the reason for the cancellation:</p>
                </div>
                <div class="checkboxes-container">
                    <div class="checkbox-container flex-align-center">
                        <checkbox class="checkbox" v-model="formData.difficult" :isChecked="formData.difficult"/>
                        <p class="checkbox-desc">It was difficult to use</p>
                    </div>
                    <div class="checkbox-container flex-align-center">
                        <checkbox class="checkbox" v-model="formData.features" :isChecked="formData.features"/>
                        <p class="checkbox-desc">It lacks key features or functionality</p>
                    </div>
                    <div class="checkbox-container flex-align-center">
                        <checkbox class="checkbox" v-model="formData.expensive" :isChecked="formData.expensive"/>
                        <p class="checkbox-desc">It’s too expensive</p>
                    </div>
                    <div class="checkbox-container flex-align-center">
                        <checkbox class="checkbox" v-model="formData.other" :isChecked="formData.other"/>
                        <p class="checkbox-desc">Other</p>
                    </div>
                </div>

                <input class="text-input space-bottom" v-if="formData.other" v-model="formData.otherTxt" type="text" placeholder="Please tell us your reason">

                <div class="sub-container">
                    <p class="txt">If you don’t mind sharing, which platform will you use now?</p>
                    <input class="text-input" v-model="formData.platform" type="text" placeholder="Platform name">
                </div>

                <div class="sub-container">
                    <p class="txt">What can we do to improve?</p>
                    <textarea class="free-txt" v-model="formData.improve" placeholder="Write here"/>
                </div>

                <div class="btn-container flex-end">
                    <button class="cancel-btn" @click="closeModal">Cancel</button>
                    <button class="end-btn" @click="onEndSubscription">End subscription</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { paymentService } from '@/cms/services/payment.service';
import { eventBus, EV_show_user_msg } from '@/cms/services/eventBus.service';
import Loader from '@/client/cmps/common/icons/Loader';
import Checkbox from "@/client/cmps/common/Checkbox";


export default {
    props: {
        recurringId: {
            type: String
        }
    },
    data(){
        return{
            isLoading: false,
            formData: {
                difficult: false,
                features: false,
                expensive: false,
                other: false,
                otherTxt: '',
                platform:'',
                improve:''
            }
        }
    },
    methods: {
        closeModal() {
            this.$emit('close-modal');
        },
        async onEndSubscription(){
            this.isLoading = true
            const res = await paymentService.endSubscription(this.recurringId, this.formData)
            if(res.payload === false){
                eventBus.$emit(EV_show_user_msg, 'Something went wrong, please try again or contact us', 5000, 'error')
                this.$emit('close-modal');
            }else{
                this.$emit('update-user');
            }
            this.isLoading = false
        }
    },
    computed:{
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
    },
    components:{
        Loader,
        Checkbox
    }
};
</script>
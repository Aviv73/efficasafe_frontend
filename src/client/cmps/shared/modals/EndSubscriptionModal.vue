<template>
    <div class="end-subscription-modal">
        <button class="end-subscription-modal-close-btn" @click="closeModal">X</button>
        <div v-if="isLoading" class="end-subscription-modal-content">
            <loader />
        </div>
        <div v-else class="end-subscription-modal-content txt-center">
            <h2>Are you sure you want to end your subscription?</h2>
            <section class="btns-container">
                <button class="red" @click="onEndSubscritpion">End subscription</button>
                <button class="green" @click="closeModal">Cancel</button>
            </section>
        </div>
    </div>
</template>

<script>

import { paymentService } from '@/cms/services/payment.service';
import Loader from '@/client/cmps/common/icons/Loader';
import { eventBus, EV_show_user_msg } from '@/cms/services/eventBus.service';


export default {
    props: {
        recurringId: {
            type: String
        }
    },
    data(){
        return{
            isLoading: false
        }
    },
    methods: {
        closeModal() {
            this.$emit('close-modal');
        },
        async onEndSubscritpion(){
            this.isLoading = true
            const res = await paymentService.endSubscription(this.recurringId)
            if(res.payload === false){
                eventBus.$emit(EV_show_user_msg, 'Something went wrong, please try again or contact us', 5000, 'error')
                this.$emit('close-modal');
            }else{
                this.$emit('update-user');
            }
            this.isLoading = false
        }
    },
    components:{
        Loader
    }
};
</script>
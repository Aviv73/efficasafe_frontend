<template>
    <section class="container">
        <template v-if="managementData">
            <h2 class="management-title">Management Data</h2>
            <v-form @submit.prevent="uploadData">
                <h2 class="management-subtitle">Guest mode</h2>
                <div class="management-input">
                    <h3>Number of free searches:</h3>
                    <v-text-field
                        v-model="managementData.freeSearchesNum"
                        placeholder="Number of free searches"
                        hide-details
                        single-line
                        type="number"
                    />
                </div>
                <div class="management-input">
                    <h3>Number of interactions to show:</h3>
                    <v-text-field
                        v-model="managementData.showInteractionsNum"
                        placeholder="Number of interactions to show"
                        hide-details
                        single-line
                        type="number"
                    />
                </div>
                <div class="management-input">
                    <h3>Number of positive interactions to show:</h3>
                    <v-text-field
                        v-model="managementData.showPositiveInteractionsNum"
                        placeholder="Number of positive interactions to show"
                        hide-details
                        single-line
                        type="number"
                    />
                </div>
                <h2 class="management-subtitle">Trail mode</h2>
                <div class="management-input">
                    <h3>Number of free trail days:</h3>
                    <v-text-field
                        v-model="managementData.freeTrailDaysNum"
                        placeholder="Number of free trail days"
                        hide-details
                        single-line
                        type="number"
                    />
                </div>
                <h2 class="management-subtitle">Payment plans</h2>
                <div class="cards-containrt">
                    <v-card class="card" v-for="(plan, idx) in managementData.plans" :key="idx">
                        <div class="management-input">
                            <h3>Duration in days:</h3>
                            <v-text-field
                                v-model="managementData.plans[idx].duration"
                                placeholder="Duration in days"
                                hide-details
                                single-line
                                type="number"
                            />
                        </div>
                        <div class="management-input">
                            <h3>Duration in words:</h3>
                            <v-text-field
                                v-model="managementData.plans[idx].durationTxt"
                                placeholder="Duration in days"
                                hide-details
                                single-line
                            />
                        </div>
                        <div class="management-input">
                            <h3>Price in USD:</h3>
                            <v-text-field
                                v-model="managementData.plans[idx].priceUSD"
                                placeholder="Duration in days"
                                hide-details
                                single-line
                                type="number"
                            />
                        </div>
                        <div class="management-input">
                            <h3>Price in EUR:</h3>
                            <v-text-field
                                v-model="managementData.plans[idx].priceEUR"
                                placeholder="Duration in days"
                                hide-details
                                single-line
                                type="number"
                            />
                        </div>
                        <div class="management-input">
                            <h3>Price in ISL:</h3>
                            <v-text-field
                                v-model="managementData.plans[idx].priceISL"
                                placeholder="Duration in days"
                                hide-details
                                single-line
                                type="number"
                            />
                        </div>
                        <div class="management-input checkbox-input">
                            <h3>Recommended:</h3>
                            <input class="checkbox" type="checkbox" id="checkbox" v-model="managementData.plans[idx].isRecommended" @change="onChangeRadioBtn($event, managementData.plans[idx]._id)">
                        </div>
                    </v-card>
                </div>
                <v-btn type="submit">Save</v-btn>
            </v-form>
        </template>
        <v-alert 
            class="management-alert" 
            v-if="isShowAlert"
            type="success"
            dismissible
        >
            Saved!
        </v-alert>
    </section>
</template>

<script>

import { manageService } from '@/cms/services/manage.service'

export default {
    name: 'Management',
    data(){
        return {
            managementData: null,
            isShowAlert: false
        }
    },
    computed: {
        
    },
    methods: {
        async uploadData(){
            const manage = JSON.parse(JSON.stringify(this.managementData))
            try{
                await this.$store.dispatch({type:'updateManagementData', manage})
                this.isShowAlert = true
                setTimeout(()=> this.isShowAlert = false, 3000)
            }catch(err){
                console.log('error');
            }
        },
        onChangeRadioBtn(ev, id){
            this.managementData.plans.forEach(plan => {
                if(plan._id === id) plan.isRecommended = true
                else plan.isRecommended = false
            });
        }
    },
    async created() {
        this.managementData = await manageService.list()
    },
    beforeDestroy() {
    },
};
</script>
<template>
    <section class="container">
        <v-card v-if="managementData && managementData.coupons" class="py-2 px-4 text-center">
            <p>Coupons</p>
            <v-btn color="primary" @click="onAddCoupon" class="mb-4">Create coupon</v-btn>
            <v-data-table
                :headers="tableHeaders"
                :items="couponsToShow"
                :items-per-page="5"
                class="elevation-1"
            >
                <template  v-slot:body="{ items }">
                    <tbody>
                        <tr v-for="item in items" :key="item._id">
                            <td style="text-align: start">{{item.code}}</td>
                            <td style="text-align: start" :class="{'red-txt': item.validUntil < Date.now()}">
                                <template v-if="item.validUntil">
                                    {{ new Date(item.validUntil) | timeFilter('DD/MM/YYYY') }}
                                </template>
                            </td>
                            <td style="text-align: start">{{ item.endTrialDate ? 'Trial' : 'Subscription' }}</td>
                            <td style="text-align: start">
                                <v-btn color="primary" @click="onOpenEdit(item)"><v-icon small>mdi-pencil</v-icon></v-btn>
                                <v-btn color="error" @click="onDeleteCoupon(item.id)" class="ml-4"><v-icon small>mdi-delete</v-icon></v-btn>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-data-table>
        </v-card>
        <v-card v-if="dynamicCoupon" width="600" style="margin: 0 auto" class="py-2 px-4 mt-4 text-center">
            <div class="dynamic-coupon-input" width="200">
                <h3>Dynamic Coupon Life Time:</h3>
                <v-text-field
                    v-model="managementData.dynamicCouponLifeTime"
                    placeholder="Dynamic Coupon Life Time"
                    hide-details
                    single-line
                    type="number"
                />
                <v-btn color="success" @click="saveDynamicCouponLifeTime">Save Life Time</v-btn>
            </div>
            <p>Dynamic Coupon</p>
            <div v-for="(plan,idx) in dynamicCoupon" :key="idx" class="coupon-edit-content">
                <div class="coupon-input">
                    <h3>Duration in months:</h3>
                    <v-select
                        :items="durations"
                        label="Duration in month"
                        v-model="dynamicCoupon[idx].duration"
                    ></v-select>
                </div>
                <div class="coupon-input">
                    <h3>Duration in words:</h3>
                    <h3>{{dynamicCouponDurationTxtToShow(idx)}}</h3>
                </div>
                <div class="coupon-input">
                    <h3>Price in USD:</h3>
                    <v-text-field
                        v-model="dynamicCoupon[idx].priceUSD"
                        placeholder="Price in USD"
                        hide-details
                        single-line
                        type="number"
                    />
                </div>
                <div class="coupon-input">
                    <h3>Price in ILS:</h3>
                    <v-text-field
                        v-model="dynamicCoupon[idx].priceISL"
                        placeholder="Price in ILS"
                        hide-details
                        single-line
                        type="number"
                    />
                </div>
                <div class="coupon-input">
                    <h3>Price in EUR:</h3>
                    <v-text-field
                        v-model="dynamicCoupon[idx].priceEUR"
                        placeholder="Price in EUR"
                        hide-details
                        single-line
                        type="number"
                    />
                </div>
            </div>
            <div class="btn-container">
                <v-btn color="success" @click="onSaveDynamicCoupon">Save</v-btn>
            </div>
        </v-card>
        <v-card v-if="managementData && managementData.coupons" class="py-2 px-4 text-center mt-4">
            <p>Dynamic Coupons</p>
            <v-data-table
                :headers="tableHeaders"
                :items="dynamicCouponsToShow"
                :items-per-page="20"
                class="elevation-1"
            >
                <template  v-slot:body="{ items }">
                    <tbody>
                        <tr v-for="item in items" :key="item._id">
                            <td style="text-align: start">{{item.code}}</td>
                            <td style="text-align: start" :class="{'red-txt': item.validUntil < Date.now()}">
                                <template v-if="item.validUntil">
                                    {{ new Date(item.validUntil) | timeFilter('DD/MM/YYYY') }}
                                </template>
                            </td>
                            <td style="text-align: start">
                                <v-btn color="primary" @click="onOpenEdit(item)"><v-icon small>mdi-pencil</v-icon></v-btn>
                                <v-btn color="error" @click="onDeleteCoupon(item.id)" class="ml-4"><v-icon small>mdi-delete</v-icon></v-btn>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-data-table>
        </v-card>
        <v-card v-if="couponToEdit" class="coupon-edit">
            <v-card-title class="primary headline" style="color:white; font-weight:bold;">{{editorTitle}} coupon</v-card-title>
            <div class="coupon-edit-content">
                <div class="coupon-input">
                    <h3>Code:</h3>
                    <v-text-field
                        v-model="couponToEdit.code"
                        placeholder="Coupon code"
                        hide-details
                        single-line
                    />
                </div>
                <div class="coupon-input">
                    <h3>Valid Until:</h3>
                    <v-text-field
                        v-model="couponToEdit.validUntil"
                        hide-details
                        single-line
                        type="date"
                    />
                </div>
                <div class="coupon-input">
                    <h3>End trial time (only for free coupons):</h3>
                    <v-text-field
                        v-model="couponToEdit.endTrialDate"
                        hide-details
                        single-line
                        type="date"
                    />
                </div>
                <div class="plans-container">
                    <v-card class="plan" v-for="(plan, idx) in couponToEdit.plans" :key="idx">
                        <div class="coupon-input">
                            <h3>Duration in months:</h3>
                            <v-select
                                :items="durations"
                                label="Duration in month"
                                v-model="couponToEdit.plans[idx].duration"
                            ></v-select>
                        </div>
                        <div class="coupon-input">
                            <h3>Duration in words:</h3>
                            <h3>{{durationTxtToShow(idx)}}</h3>
                        </div>
                        <div class="coupon-input">
                            <h3>Price in USD:</h3>
                            <v-text-field
                                v-model="couponToEdit.plans[idx].priceUSD"
                                placeholder="Price in USD"
                                hide-details
                                single-line
                                type="number"
                            />
                        </div>
                        <div class="coupon-input">
                            <h3>Price in ILS:</h3>
                            <v-text-field
                                v-model="couponToEdit.plans[idx].priceISL"
                                placeholder="Price in ILS"
                                hide-details
                                single-line
                                type="number"
                            />
                        </div>
                        <div class="coupon-input">
                            <h3>Price in EUR:</h3>
                            <v-text-field
                                v-model="couponToEdit.plans[idx].priceEUR"
                                placeholder="Price in EUR"
                                hide-details
                                single-line
                                type="number"
                            />
                        </div>
                    </v-card>
                </div>
            </div>
            <div class="btn-container">
                <v-btn color="primary" @click="onAddPlan">Add plan</v-btn>
                <v-btn color="success" @click="onSaveEditCoupon">Save</v-btn>
                <v-btn @click="couponToEdit = null">Cancel</v-btn>
            </div>
        </v-card>
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
import { utilService } from '@/cms/services/util.service'

export default {
    name: 'Coupon',
    data(){
        return {
            managementData: null,
            dynamicCoupon: null,
            couponToEdit: null,
            isShowAlert: false,
            tableHeaders: [
                {text: 'Code', value: 'code'},
                {text: 'Valid Until', value: 'validUntil'},
                {text: 'Type', value: 'endTrialDate'},
                {text: 'Actions'}
            ],
            durations: ['1','12','24'],
            durationTxtMap: {
                '1': 'Monthly plan',
                '12': 'Annual plan',
                '24': 'Biennial plan'
            }
        }
    },
    computed: {
        editorTitle(){
            if(this.couponToEdit.id) return 'Edit'
            return 'Add'
        },
        durationTxtToShow(){
            return (idx) => {
                if(!this.couponToEdit.plans[idx].duration) return 'Enter duration in month to see the right text'
                return this.durationTxtMap[this.couponToEdit.plans[idx].duration]
            }
        },
        dynamicCouponDurationTxtToShow(){
            return (idx) => {
                if(!this.dynamicCoupon[idx].duration) return 'Enter duration in month to see the right text'
                return this.durationTxtMap[this.dynamicCoupon[idx].duration]
            }
        },
        couponsToShow(){
            return this.managementData.coupons.filter( c => !c.isDynamic)
        },
        dynamicCouponsToShow(){
            return this.managementData.coupons.filter( c => c.isDynamic)
        }
    },
    methods: {
        onOpenEdit(coupon){
            this.couponToEdit = JSON.parse(JSON.stringify(coupon))
        },
        onAddCoupon(){
            this.couponToEdit = {
                code: '',
                validUntil: null,
                endTrialDate: null,
                plans:[{
                    duration: '',
                    durationTxt: '',
                    priceEUR: 0,
                    priceISL: 0,
                    priceUSD: 0,
                }]
            }
        },
        onAddPlan(){
            this.couponToEdit.plans.push({
                    duration: '',
                    durationTxt: '',
                    priceEUR: 0,
                    priceISL: 0,
                    priceUSD: 0,
            })
        },
        async saveManagementData(manage){
            try{
                await this.$store.dispatch({type:'updateManagementData', manage})
                this.isShowAlert = true
                setTimeout(()=> this.isShowAlert = false, 3000)
            }catch(err){
                console.log(err);
            }
        },
        async saveDynamicCouponLifeTime(){
            const manage = JSON.parse(JSON.stringify(this.managementData))
            await this.saveManagementData(manage)
        },
        async onSaveDynamicCoupon(){
            this.dynamicCoupon.forEach((plan, idx) => {
                plan.durationTxt = this.dynamicCouponDurationTxtToShow(idx)
            });
            const manage = JSON.parse(JSON.stringify(this.managementData))
            manage.dynamicCoupon = this.dynamicCoupon
            await this.saveManagementData(manage)
        },
        async onSaveEditCoupon(){
            this.couponToEdit.validUntil = new Date(this.couponToEdit.validUntil).getTime()
            this.couponToEdit.plans.forEach((plan, idx) => {
                plan.durationTxt = this.durationTxtToShow(idx)
            });
            if(this.couponToEdit.code.includes('-')) return
            if(this.couponToEdit.id){
                const idx = this.managementData.coupons.findIndex(cop => cop.id === this.couponToEdit.id)
                this.managementData.coupons.splice(idx, 1, this.couponToEdit)
            }else{
                this.couponToEdit.id = utilService.makeId()
                this.managementData.coupons.push(this.couponToEdit)
            }
            const manage = JSON.parse(JSON.stringify(this.managementData))
            await this.saveManagementData(manage)
            this.couponToEdit = null
        },
        async onDeleteCoupon(id){
             const idx = this.managementData.coupons.findIndex(cop => cop.id === id)
             this.managementData.coupons.splice(idx, 1)
             const manage = JSON.parse(JSON.stringify(this.managementData))
             await this.$store.dispatch({type:'updateManagementData', manage})
        },
        async deleteExpiredDynamicCoupons(managementData){
            const isDynamicExpired = managementData.coupons.some(c => c.validUntil < Date.now() && c.isDynamic)
            if(isDynamicExpired){
                managementData.coupons = managementData.coupons.filter(c => {
                    return !c.isDynamic || (c.isDynamic && c.validUntil > Date.now())
                })
                await this.$store.dispatch({type:'updateManagementData', manage: managementData})
            }
        }
    },
    async created() {
       let managementData = await manageService.list()
       await this.deleteExpiredDynamicCoupons(managementData)
       this.managementData = managementData
       this.dynamicCoupon = JSON.parse(JSON.stringify(this.managementData.dynamicCoupon))
    },
};
</script>
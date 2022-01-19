<template>
    <section class="container">
        <v-card v-if="managementData && managementData.coupons" class="py-2 px-4 text-center">
            <p>Coupons</p>
            <v-btn color="primary" @click="onAddCoupon" class="mb-4">Create coupon</v-btn>
            <v-data-table
                :headers="tableHedaers"
                :items="managementData.coupons"
                :items-per-page="5"
                class="elevation-1"
            >
                <template  v-slot:body="{ items }">
                    <tbody>
                        <tr v-for="item in items" :key="item._id">
                            <td style="text-align: start">{{item.code}}</td>
                            <td style="text-align: start">{{item.durationTxt}}</td>
                            <td style="text-align: start">${{item.priceUSD}}</td>
                            <td style="text-align: start" :class="{'red-txt': item.validUntil < Date.now()}">{{ item.validUntil | moment('DD/MM/YYYY') }}</td>
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
            <p>Dynamic Coupon</p>
            <div class="coupon-edit-content">
                <div class="coupon-input">
                    <h3>Duration in months:</h3>
                    <v-select
                        :items="durations"
                        label="Duration in month"
                        v-model="dynamicCoupon.duration"
                    ></v-select>
                </div>
                <div class="coupon-input">
                    <h3>Duration in words:</h3>
                    <h3>{{dynamicCouponDurationTxtToShow}}</h3>
                </div>
                <div class="coupon-input">
                    <h3>Price in USD:</h3>
                    <v-text-field
                        v-model="dynamicCoupon.priceUSD"
                        placeholder="Price in USD"
                        hide-details
                        single-line
                        type="number"
                    />
                </div>
                <div class="coupon-input">
                    <h3>Price in ILS:</h3>
                    <v-text-field
                        v-model="dynamicCoupon.priceISL"
                        placeholder="Price in ILS"
                        hide-details
                        single-line
                        type="number"
                    />
                </div>
                <div class="coupon-input">
                    <h3>Price in EUR:</h3>
                    <v-text-field
                        v-model="dynamicCoupon.priceEUR"
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
                    <h3>Duration in months:</h3>
                    <v-select
                        :items="durations"
                        label="Duration in month"
                        v-model="couponToEdit.duration"
                    ></v-select>
                </div>
                <div class="coupon-input">
                    <h3>Duration in words:</h3>
                    <h3>{{durationTxtToShow}}</h3>
                </div>
                <div class="coupon-input">
                    <h3>Price in USD:</h3>
                    <v-text-field
                        v-model="couponToEdit.priceUSD"
                        placeholder="Price in USD"
                        hide-details
                        single-line
                        type="number"
                    />
                </div>
                <div class="coupon-input">
                    <h3>Price in ILS:</h3>
                    <v-text-field
                        v-model="couponToEdit.priceISL"
                        placeholder="Price in ILS"
                        hide-details
                        single-line
                        type="number"
                    />
                </div>
                <div class="coupon-input">
                    <h3>Price in EUR:</h3>
                    <v-text-field
                        v-model="couponToEdit.priceEUR"
                        placeholder="Price in EUR"
                        hide-details
                        single-line
                        type="number"
                    />
                </div>
            </div>
            <div class="btn-container">
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
            tableHedaers: [
                {text: 'Code', value: 'code'},
                {text: 'Duration', value: 'durationTxt'},
                {text: 'Price Per Month', value: 'priceUSD'},
                {text: 'Valid Until', value: 'validUntil'},
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
            if(!this.couponToEdit.duration) return 'Enter duration in month to see the right text'
            return this.durationTxtMap[this.couponToEdit.duration]
        },
        dynamicCouponDurationTxtToShow(){
            if(!this.dynamicCoupon.duration) return 'Enter duration in month to see the right text'
            return this.durationTxtMap[this.dynamicCoupon.duration]
        },
    },
    methods: {
        onOpenEdit(coupon){
            this.couponToEdit = JSON.parse(JSON.stringify(coupon))
        },
        onAddCoupon(){
            this.couponToEdit = {
                code: '',
                duration: '',
                durationTxt: '',
                priceEUR: 0,
                priceISL: 0,
                priceUSD: 0,
                validUntil: null,
            }
        },
        async onSaveDynamicCoupon(){
            const manage = JSON.parse(JSON.stringify(this.managementData))
            manage.dynamicCoupon = this.dynamicCoupon
            try{
                await this.$store.dispatch({type:'updateManagementData', manage})
                this.isShowAlert = true
                setTimeout(()=> this.isShowAlert = false, 3000)
            }catch(err){
                console.log(err);
            }
        },
        async onSaveEditCoupon(){
            this.couponToEdit.validUntil = new Date(this.couponToEdit.validUntil).getTime()
            this.couponToEdit.durationTxt = this.durationTxtToShow
            if(this.couponToEdit.code.includes('-')) return
            if(this.couponToEdit.id){
                const idx = this.managementData.coupons.findIndex(cop => cop.id === this.couponToEdit.id)
                this.managementData.coupons.splice(idx, 1, this.couponToEdit)
            }else{
                this.couponToEdit.id = utilService.makeId()
                this.managementData.coupons.push(this.couponToEdit)
            }
            const manage = JSON.parse(JSON.stringify(this.managementData))
            try{
                await this.$store.dispatch({type:'updateManagementData', manage})
                this.isShowAlert = true
                setTimeout(()=> this.isShowAlert = false, 3000)
                this.couponToEdit = null
            }catch(err){
                console.log(err);
            }
        },
        async onDeleteCoupon(id){
             const idx = this.managementData.coupons.findIndex(cop => cop.id === id)
             this.managementData.coupons.splice(idx, 1)
             const manage = JSON.parse(JSON.stringify(this.managementData))
             await this.$store.dispatch({type:'updateManagementData', manage})
        }
    },
    async created() {
       const managementData = await manageService.list()
       this.managementData = managementData
       this.dynamicCoupon = JSON.parse(JSON.stringify(this.managementData.dynamicCoupon))
    },
};
</script>
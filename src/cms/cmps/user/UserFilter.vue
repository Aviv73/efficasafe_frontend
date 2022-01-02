<template>
    <section class="user-filter px-4">
        <div class="d-flex align-center justify-space-between">
            <v-text-field
                style="max-width: 50%"
                class="mr-8"
                label="Search User By username or email"
                v-model="filterBy.q"
            />
            <section class="d-flex align-center">
                <v-select
                    class="small-search mr-8"
                    :items="searchOptions"
                    label="Select search method"
                    v-model="searchBy"
                ></v-select>
                <v-select
                    v-if="searchBy === 'Type'"
                    class="small-search"
                    :items="typeItems"
                    label="Search By Type"
                    v-model="filterBy.planType"
                ></v-select>
                <v-select
                    v-if="searchBy === 'Role'"
                    class="small-search"
                    :items="roleItems"
                    label="Search By Role"
                    v-model="filterBy.roleType"
                ></v-select>
                <v-select
                    v-if="searchBy === 'Coupon'"
                    class="small-search"
                    :items="couponItems"
                    label="Search By Coupon"
                    v-model="filterBy.coupon"
                ></v-select>
                <v-date-picker 
                    v-if="searchBy === 'Registration Date'"
                    width="300"
                    @change="handlefilterByDateFrom('registration', $event)"
                ></v-date-picker>
                <v-date-picker 
                    v-if="searchBy === 'Registration Date'"
                    width="300"
                    @change="handlefilterByDateTo('registration', $event)"
                ></v-date-picker>
                <v-date-picker 
                    v-if="searchBy === 'End Trial Date'"
                    width="300"
                    @change="handlefilterByDateFrom('endTrial', $event)"
                ></v-date-picker>
                <v-date-picker 
                    v-if="searchBy === 'End Trial Date'"
                    width="300"
                    @change="handlefilterByDateTo('endTrial', $event)"
                ></v-date-picker>
            </section>
        </div>
    </section>
</template>

<script>

export default {
    data() {
        return {
            filterBy: {
                q: '',
                planType: '',
                roleType: '',
                registrationDateFrom: '',
                registrationDateTo: '',
                endTrialDate: '',
                coupon: ''
            },
            searchBy: 'Role',
            searchOptions: ['Role', 'Type', 'Registration Date', 'End Trial Date','Coupon'],
            typeItems: ['all', 'subscribed', 'trial', 'registered'],
            roleItems: ['all', 'user', 'editor', 'sales', 'admin']
        };
    },
    watch: {
        filterBy: {
            handler() {
                this.fetchEntriesDebounced();
            },
            deep: true,
        },
    },
    computed: {
        couponItems(){
            const managementData = this.$store.getters.getManagementData
            return managementData.coupons.reduce((acc, c) => {
                acc.push(c.code)
                return acc
            }, [])
        },
    },
    methods: {
        fetchEntriesDebounced() {
            let timerId = null;
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                this.emitFilterBy();
            }, 500);
        },
        emitFilterBy() {
            this.$emit(
                'emit-filter',
                JSON.parse(JSON.stringify(this.filterBy))
            );
        },
        handlefilterByDateFrom(type, value){
            const date = new Date(value).getTime()
            if(type === 'registration') this.filterBy.registrationDateFrom = date
            else this.filterBy.endTrialDateFrom = date
            this.emitFilterBy()
        },
        handlefilterByDateTo(type, value){
            const date = new Date(value).getTime()
            if(type === 'registration') this.filterBy.registrationDateTo = date
            else this.filterBy.endTrialDateTo = date
            this.emitFilterBy()
        }
    },
};
</script>
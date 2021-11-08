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
                <v-date-picker 
                    v-if="searchBy === 'Registration Date'"
                    width="300"
                    @change="handlefilterByDate('registration', $event)"
                ></v-date-picker>
                <v-date-picker 
                    v-if="searchBy === 'End Trial Date'"
                    width="300"
                    @change="handlefilterByDate('endTrial', $event)"
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
                registrationDate: '',
                endTrialDate: ''
            },
            searchBy: 'Role',
            searchOptions: ['Role', 'Type', 'Registration Date', 'End Trial Date'],
            typeItems: ['all', 'subscribed', 'trial', 'registered'],
            roleItems: ['all', 'user', 'editor', 'sales', 'admin'],
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
        handlefilterByDate(type, value){
            const date = new Date(value).getTime()
            if(type === 'registration') this.filterBy.registrationDate = date
            else this.filterBy.endTrialDate = date
        }
    },
};
</script>
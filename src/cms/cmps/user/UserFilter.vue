<template>
    <section class="user-filter px-4">
        <div class="d-flex align-center justify-space-between">
            <v-text-field
                style="max-width: 50%"
                class="mr-8"
                label="Search User By name or email"
                v-model="filterBy.q"
            />
            <section class="d-flex align-center">
                <v-text-field
                    class="small-search mr-9"
                    label="Search By Invoice number"
                    v-model="filterBy.invoiceNum"
                    type="number"
                />
                <v-select
                    class="small-search"
                    :items="items"
                    label="Search By Type"
                    v-model="filterBy.planType"
                ></v-select>
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
                invoiceNum: null,
                planType: '',
            },
            items: ['all', 'subscribed', 'trial', 'registered'],
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
    },
};
</script>
<template>
    <section class="user-filter">
        <div class="filter-input">
            <v-text-field
                label="Search User By name or email"
                v-model="filterBy.q"
            />
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            filterBy: {
                q: '',
            },
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

<style>
.filter-input {
    width: 40%;
    margin: 0 auto;
}
</style>
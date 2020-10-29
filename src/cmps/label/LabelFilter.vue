<template>
    <section class="label-filter">
        <div class="filter-input">
            <autocomplete
                :items="labels"
                @emitAutocomplete="updateFilter"
                searchName="Search label"
            />
        </div>
        <div class="filter-type">
            <v-select
                :items="label.src"
                label="Label source"
                @change="emitFilter"
                v-model="filterBy.src"
            ></v-select>
        </div>
    </section>
</template>

<script>
import autocomplete from '@/cmps/Autocomplete';

export default {
    name: 'labelFilter',
    props: {
        labels: Array,
    },
    data() {
        return {
            filterBy: {
                q: '',
                src: 'all',
            },
            label: {
                src: [
                    {
                        text: 'All',
                        value: 'all',
                    },
                    {
                        text: 'ATC',
                        value: 'atc',
                    },
                    {
                        text: 'Custom',
                        value: 'custom',
                    },
                ],
            },
        };
    },
    methods: {
        emitFilter() {
            this.$emit(
                'emit-filter',
                JSON.parse(JSON.stringify(this.filterBy))
            );
        },
        updateFilter(label) {
            if (label) {
                this.filterBy.q = label.text;
            } else {
                this.filterBy.q = '';
            }
            this.emitFilter();
        },
    },
    components: {
        autocomplete,
    },
};
</script>
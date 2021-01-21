<template>
    <section class="label-page">
        <div class="container">
            <v-card v-if="labels" class="mb-10">
                <v-card-title>
                    Labels collection
                    <v-spacer></v-spacer>
                    <v-btn color="primary" to="/label/edit/">new label</v-btn>
                </v-card-title>
                <label-filter :labels="labels" @emit-filter="setFilter" />
                <label-list
                    :labels="labels"
                    :totalItems="totalItems"
                    :loading="isLoading"
                    @options-updated="setFilter"
                    @header-clicked="setFilter"
                />
            </v-card>
            <icons-map />
        </div>
    </section>
</template>

<script>
import labelFilter from '@/cmps/label/LabelFilter';
import labelList from '@/cmps/label/LabelList';
import iconsMap from '@/cmps/general/IconsMap';

export default {
    data() {
        return {
          isLoading: false
        };
    },
    watch: {
        '$route.query': {
            handler() {
                this.loadLabels();
            },
            immediate: true
        }
    },
    computed: {
        labels() {
          return this.$store.getters.labels;
        },
        totalItems() {
          return this.$store.getters.labelsCount;
        },
    },
    methods: {
        setFilter(filterBy) {
            const criteria = {
                ...this.$route.query,
                ...filterBy
            };
            const queryStr = '?' + new URLSearchParams(criteria).toString();
            this.$router.push(queryStr);
        },
        async loadLabels() {
            this.isLoading = true;
            const filterBy = this.$route.query;

            filterBy.sortBy = filterBy.sortBy || 'isSuper';
            filterBy.isDesc = filterBy.isDesc || 1;
            filterBy.limit = filterBy.limit || 15;
            if (filterBy.q) filterBy.page = 0;

            await this.$store.dispatch({ type: 'loadLabels', filterBy });
            this.isLoading = false;
        }
    },
    components: {
      labelFilter,
      labelList,
      iconsMap
    }
};
</script>
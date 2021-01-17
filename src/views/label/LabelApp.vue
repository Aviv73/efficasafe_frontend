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
                    @options-updated="paginate"
                    @header-clicked="setSort"
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
          isLoading: false,
          tableData: null,
        };
    },
    watch: {
        '$route.query': function () {
          this.loadLabels();
        },
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
        paginate(tableData) {
            this.tableData = tableData;
            this.loadLabels();
        },
        setSort(propName, isDesc) {
            const criteria = {
                ...this.$route.query,
                sortBy: propName,
                isDesc,
            };
            const queryStr = '?' + new URLSearchParams(criteria).toString();
            this.$router.push(queryStr);
        },
        setFilter(filterBy) {
            if (filterBy.isSuper === '') {
                delete filterBy.isSuper;
            }
            if (!filterBy.q) {
                delete filterBy.q;
            }
            const queryStr = '?' + new URLSearchParams(filterBy).toString();
            if (
                filterBy.isSuper !== this.$route.query.isSuper &&
                this.tableData
            ) {
                this.tableData.page = 1;
            }
            this.$router.push(queryStr);
        },
        loadLabels() {
            this.isLoading = true;
            const filterBy = this.$route.query;

            if (this.tableData) {
                let { page, itemsPerPage } = this.tableData;
                filterBy.limit = (itemsPerPage < 0) ? 0 : itemsPerPage;
                filterBy.page = --page;
            } else filterBy.limit = 10;

            if (filterBy.q) filterBy.page = 0;

            this.$store.dispatch({ type: 'loadLabels', filterBy });
            this.isLoading = false;
        },
        removeLabel(labelId) {
          this.$store.dispatch({ type: 'removeLabel', labelId });
        },
    },
    created() {
      const { sortBy, isDesc } = this.$route.query;
      if (sortBy !== 'isSuper' && isDesc !== 'true') {
        this.setSort('isSuper', true);
      }
    },
    components: {
      labelFilter,
      labelList,
      iconsMap
    }
};
</script>
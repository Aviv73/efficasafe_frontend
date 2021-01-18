<template>
  <section class="featured-interaction-list">
    <v-data-table
        :headers="headers"
        :items="groups"
        :server-items-length="groupCount"
        :options.sync="options"
        disable-sort
        :loading="isLoading"
    >
        <template v-slot:[`header.name`]="{ header }">
            <label class="list-header">
                <input type="checkbox" hidden @change="onSort(header.value, $event.target.checked)" />
                {{ header.text }}
                <v-icon class="icon" :class="{ 'icon-active': isSortedBy(header.value) }">mdi-arrow-down</v-icon>
            </label>
        </template>
        <!-- <template v-slot:body="{ items }">

        </template> -->
    </v-data-table>
  </section>
</template>

<script>
export default {
    INFINITY: Math.pow(2, 53) - 1,
    props: {
        groups: {
            type: Array,
            required: true
        },
        groupCount: {
            type: Number,
            required: true
        },
        isLoading: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            options: {},
            headers: [
                {
                    text: 'Side 1',
                    value: 'name'
                },
                {
                    text: 'Interactions',
                    value: 'count',
                    sortable: false,
                    align: 'center',
                }
            ],
            isInit: true
        }
    },
    watch: {
        options: {
            handler() {
                if (this.isInit) this.isInit = false;
                else {
                    let { itemsPerPage, page } = this.options;
                    const filterBy = {
                        limit: (itemsPerPage < 0) ? this.$options.INFINITY : itemsPerPage,
                        page: --page
                    };
                    this.$emit('pagination-changed', filterBy);
                }
            },
            deep: true
        }
    },
    methods: {
        onSort(sortBy, isDesc) {
            this.$emit('sort-changed', { sortBy, isDesc });
        },
        isSortedBy(property) {
            return this.$route.query.sortBy === property;
        }
    }
}
</script>
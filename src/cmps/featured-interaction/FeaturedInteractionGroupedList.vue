<template>
  <section class="featured-interaction-app-list">
    <v-data-table
        :headers="headers"
        :items="groups"
        :server-items-length="groupCount"
        :options.sync="options"
        :expanded.sync="expanded"
        :single-expand="true"
        item-key="_id"
        show-expand
        disable-sort
        @click:row="onRowClick"
        :loading="isLoading"
        :items-per-page="-1"
        :footer-props="{
            'items-per-page-options': [ 15, 50, -1 ]
        }"
    >
        <template v-slot:[`header.name`]="{ header }">
            <label class="list-header">
                <input type="checkbox" hidden @change="onSort(header.value, $event.target.checked)" />
                {{ header.text }}
                <v-icon class="icon" :class="{ 'icon-active': isSortedBy(header.value) }">mdi-arrow-down</v-icon>
            </label>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length" class="expanded py-2 px-3 primary lighten-1">
                <featured-interaction-list :group="item" />
            </td>
        </template>
    </v-data-table>
  </section>
</template>

<script>
import featuredInteractionList from '@/cmps/featured-interaction/FeaturedInteractionList';

export default {
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
            isMounted: false,
            expanded: [],
            options: {},
            headers: [
                {
                    text: 'Side 1',
                    value: 'name'
                },
                {
                    text: 'Interactions',
                    value: 'count',
                    align: 'center'
                },
                { 
                    text: '',
                    value: 'data-table-expand'
                }
            ]
        }
    },
    watch: {
        options: {
            handler() {
                if (this.isMounted) {
                    let { itemsPerPage, page } = this.options;
                    const filterBy = {
                        limit: (itemsPerPage < 0) ? Number.MAX_SAFE_INTEGER : itemsPerPage,
                        page: --page
                    };
                    this.$emit('pagination-changed', filterBy);
                } else this.isMounted = true;
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
        },
        onRowClick(row) {
            const idx = this.expanded.indexOf(row);
            if (idx === -1) this.expanded = [ row ];
            else this.expanded = [];
        }
    },
    created() {
        const { expandedGroups  } = this.$store.getters;
        if (expandedGroups) this.expanded = expandedGroups;
    },
    destroyed() {
        this.$store.commit({ 
            type: 'setExpandedGroups',
            groups: JSON.parse(JSON.stringify(this.expanded))
        });
    },
    components: {
        featuredInteractionList
    }
}
</script>
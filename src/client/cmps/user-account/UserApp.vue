<template>
    <section class="user-app">
        <div class="user-app-header">
            <div class="flex-align-center">
                <div class="user-app-header-search font-medium">
                    <input
                        type="text"
                        placeholder="Search..."
                        v-model="filterBy.name"
                    />
                </div>
            </div>
            <div class="flex-space-between">
                <span class="user-app-header-notice">
                    Showing 10/100 searches
                </span>
                <span class="user-app-header-filter">
                    <custom-select
                        :options="filterOptions.limit"
                        @option-picked="onFilter"
                    />
                    <custom-select
                        :options="filterOptions.createdAt"
                        @option-picked="onFilter"
                    />
                </span>
            </div>
        </div>
        <div class="user-app-content">
            <user-data-table
                :headers="tableHeaders"
                :items="tableItems"
            />
        </div>
    </section>
</template>

<script>
import UserDataTable from '@/client/cmps/user-account/UserDataTable';
import CustomSelect from '@/client/cmps/common/CustomSelect';

export default {
    // TODO: updates!
    data() {
        return {
            filterBy: {
                name: '',
                /// TODO:
                /// ADD v-model ability to custom select & v model striaght here
                /// table paging & page size
                /// filter by name (regex) && createdAt > (Date.now() - hodesh)
                /// sort by
            },
            filterOptions: {
                createdAt: [
                    'All', 'Last 3 days', 'Last 2 weeks', 'Last month', 'Last year'
                ],
                limit: [
                    'Show 10', 'Show 50', 'Show 200', 'Show all'
                ]
            }
        }
    },
    computed: {
        tableHeaders() {
            if (this.$route.name === 'Searches') {
                return [
                    {
                        title: 'Client name',
                        field: 'title',
                        sortable: true
                    },
                    {
                        title: 'Created',
                        field: 'at',
                        sortable: true
                    },
                    {
                        title: 'Updates',
                        field: '',
                        sortable: true
                    },
                    {
                        title: '',
                        field: ''
                    }
                ];
            }
            /// return purchases table headers in their route
            return [];
        },
        tableItems() {
            if (this.$route.name === 'Searches') {
                // TODO: return searches for display by filterby
                return this.$store.getters.loggedInUser.searches;
            }
            // replace with purchases when there are any
            return this.$store.getters.loggedInUser.searches;
        }
    },
    methods: {
        onFilter(filterBy) {
            console.log(filterBy);
        }
    },
    components: {
        CustomSelect,
        UserDataTable
    }
}
</script>
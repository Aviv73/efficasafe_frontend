<template>
    <section class="user-app">
        <div class="user-app-header">
            <div class="flex-align-center">
                <div class="user-app-header-search font-medium">
                    <input
                        type="text"
                        placeholder="Search..."
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
                
            />
        </div>
    </section>
</template>

<script>
import UserDataTable from '@/client/cmps/user-account/UserDataTable';
import CustomSelect from '@/client/cmps/common/CustomSelect';

export default {
    data() {
        return {
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
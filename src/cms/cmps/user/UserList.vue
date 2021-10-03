<template>
    <section class="user-list">
        <v-data-table
            :headers="headers"
            :items="users"
            :server-items-length="totalItems"
            :options.sync="options"
            :loading="loading"
            disable-sort
            :items-per-page="15"
            :footer-props="{
                'items-per-page-options': [ 15, 50, -1 ],
            }"
        >
            <template v-slot:[`header.name`]="{ header }">
                <label class="list-header">
                    <input
                        type="checkbox"
                        hidden
                        @change="onSort(header.value, $event.target.checked)"
                    />
                    {{ header.text }}
                    <v-icon
                        class="icon"
                        :class="{ 'icon-active': isSortedBy(header.value) }"
                        >mdi-arrow-down</v-icon
                    >
                </label>
            </template>
            <template v-slot:body="{ items }">
                <tbody>
                    <tr class="tr-label" v-for="item in items" :key="item._id">
                        <td class="td-name-img">
                            <router-link :to="`user/edit/${item._id}`">
                                <span class="text-capitalize">{{
                                    item.username
                                }}</span>
                            </router-link>
                        </td>

                        <td class="centered text-center">
                            {{ item.role }}
                        </td>

                        <td class="centered text-center">
                            {{ item.email }}
                        </td>
                        <td class="centered text-center">
                            {{
                                dateToShow(item.registeredTime)
                            }}
                        </td>
                        <td class="centered text-center">
                            {{ item.type ? item.type : 'T' }}
                        </td>
                        <td class="centered text-center">
                            {{
                                dateToShow(item.trialTime)
                            }}
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-data-table>
    </section>
</template>

<script>
export default {
    props: {
        users: {
            type: Array,
            required: true,
        },
        loading: {
            type: Boolean,
            required: true,
        },
        totalItems: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            selected: [],
            confirmDialog: false,
            isMounted: false,
            options: {},
            isDesc: true,
            headers: [
                {
                    text: 'Username',
                    value: 'username',
                },
                {
                    text: 'Role',
                    value: 'role',
                    align: 'center',
                    sortable: false,
                },
                {
                    text: 'Email',
                    value: 'email',
                    align: 'center',
                    sortable: false,
                },
                {
                    text: 'Registered',
                    value: 'Registered',
                    align: 'center',
                },
                {
                    text: 'Type',
                    value: 'subType',
                    align: 'center',
                },
                {
                    text: 'End Trial',
                    value: 'endTrial',
                    align: 'center',
                },
            ],
        };
    },
    watch: {
        options() {
            if (this.isMounted) {
                let { itemsPerPage, page } = this.options;
                const filterBy = {
                    limit: itemsPerPage < 0 ? 0 : itemsPerPage,
                    page: --page,
                };
                this.$emit(
                    'options-updated',
                    JSON.parse(JSON.stringify(filterBy))
                );
            } else {
                this.isMounted = true;
            }
        },
    },
    methods: {
        onSort(sortBy, isDesc) {
            this.$emit('header-clicked', { sortBy, isDesc });
        },
        isSortedBy(property) {
            return this.$route.query.sortBy === property;
        },
        confirmDelete() {
            this.$emit('delete-many-users', [...this.selected]);
            this.selected = [];
            this.confirmDialog = false;
        },
        dateToShow(originalDate){
            if(!originalDate) return '---'
            let date = new Date(originalDate).toISOString().substr(0, 10)
            return date.split('-').reverse().join('-')
        }
    },
};
</script>
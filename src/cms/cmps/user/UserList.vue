<template>
    <!--:loading="loading" -->
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
                'items-per-page-options': [15, 50, -1],
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
                            <router-link :to="`/user/${item._id}`">
                                <span class="text-capitalize">{{
                                    item.name
                                }}</span>
                            </router-link>
                        </td>
                        <td class="centered text-center">
                            {{ item.resgisteredTime | moment('L') }}
                        </td>
                        <td class="centered text-center">
                            {{ item.trialTime | moment('L') }}
                        </td>

                        <td class="centered text-center">
                            {{ item.email }}
                        </td>

                        <td class="centered text-center">
                            {{ item.role }}
                        </td>

                        <td
                            class="td-actions d-flex align-center justify-center"
                            align="center"
                        >
                            <v-checkbox
                                v-model="selected"
                                :value="item._id"
                                title="Toggle Interaction"
                            />
                            <v-btn
                                small
                                color="primary"
                                :to="`/user/edit/${item._id}`"
                            >
                                <v-icon small>mdi-pencil</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-data-table>
        <v-fab-transition>
            <v-btn
                v-if="selected.length"
                :title="`Delete ${selected.length} labels`"
                @click="confirmDialog = true"
                color="error"
                fab
                fixed
                right
                bottom
            >
                <v-icon>mdi-delete</v-icon>
            </v-btn>
        </v-fab-transition>
        <v-dialog v-model="confirmDialog" max-width="400">
            <v-card>
                <v-card-title
                    class="primary headline"
                    style="color: white; font-weight: bold"
                >
                    <v-icon dark left>mdi-delete</v-icon>
                    Confirm delete
                </v-card-title>
                <v-card-text class="py-4" style="text-align: center">
                    Are you sure you want to delete
                    {{ selected.length }} labels?
                </v-card-text>
                <v-divider />
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="normal" @click="confirmDialog = false"
                        >Cancel</v-btn
                    >
                    <v-btn color="primary" @click="confirmDelete">Ok</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
                    text: 'Name',
                    value: 'name',
                },
                {
                    text: 'Registered',
                    value: 'Registered',
                    align: 'center',
                },
                {
                    text: 'End Trial',
                    value: 'endTrial',
                    align: 'center',
                },
                {
                    text: 'Email',
                    value: 'email',
                    align: 'center',
                    sortable: false,
                },
                {
                    text: 'Role',
                    value: 'role',
                    align: 'center',
                    sortable: false,
                },
                {
                    text: 'Actions',
                    name: 'Action',
                    value: 'action',
                    sortable: false,
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
    },
};
</script>
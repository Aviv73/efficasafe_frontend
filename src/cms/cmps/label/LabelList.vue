<template>
    <section class="label-list">
        <v-data-table
            :headers="headers"
            :items="labels"
            :server-items-length="totalItems"
            :options.sync="options"
            disable-sort
            :loading="loading"
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
            <template v-slot:[`header.isSuper`]="{ header }">
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
                            <router-link :to="`/label/${item._id}`">
                                <img
                                    :src="
                                        require(`@/cms/assets/icons/custom.svg`)
                                    "
                                    alt="Label"
                                    title="Label"
                                />
                                <span class="text-capitalize">{{
                                    item.name
                                }}</span>
                            </router-link>
                        </td>

                        <td width="80" class="centered">
                            <v-checkbox
                                class="tr-label-checkbox"
                                disabled
                                readonly
                                :ripple="false"
                                :input-value="item.isSuper"
                            ></v-checkbox>
                        </td>

                        <td class="td-color" width="80">
                            <div
                                class="color-circle v-chip"
                                :style="{ backgroundColor: item.color }"
                            ></div>
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
                                :to="`/label/edit/${item._id}`"
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
    name: 'labelList',
    props: {
        labels: {
            type: Array,
            required: true,
        },
        totalItems: {
            type: Number,
            required: true,
        },
        loading: {
            type: Boolean,
            required: true,
        },
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
                    text: 'Is Super',
                    value: 'isSuper',
                    align: 'center',
                    sortable: false,
                },
                {
                    text: 'Color',
                    value: 'color',
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
    methods: {
        confirmDelete() {
            this.$emit('delete-many-labels', [...this.selected]);
            this.selected = [];
            this.confirmDialog = false;
        },
        onSort(sortBy, isDesc) {
            this.$emit('header-clicked', { sortBy, isDesc });
        },
        isSortedBy(property) {
            return this.$route.query.sortBy === property;
        },
    },
};
</script>
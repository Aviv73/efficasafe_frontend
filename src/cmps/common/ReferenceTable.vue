<template>
    <section class="reference-table">
        <v-card>
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table
                :headers="headers"
                :items="references"
                :items-per-page="5"
                :search="search"
                class="elevation-1"
            >
                <template #[`item.link`]="{ value }">
                    <a :href="value">
                        {{ value }}
                    </a>
                </template>
            </v-data-table>
        </v-card>
    </section>
</template>

<script>
export default {
    props: {
        references: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            search: '',
            headers: [
                {
                    text: '#',
                    align: 'start',
                    sortable: true,
                    value: 'draftIdx',
                },
                {
                    text: 'Type',
                    align: 'start',
                    sortable: true,
                    value: 'type',
                },
                {
                    text: 'Text',
                    align: 'start',
                    sortable: true,
                    value: 'txt',
                },
                {
                    text: 'Link',
                    align: 'start',
                    sortable: false,
                    value: 'link',
                },
                {
                    text: 'PubmedId',
                    align: 'start',
                    sortable: true,
                    value: 'pubmedId',
                },
            ],
        };
    },
};
</script>

<style>
</style>
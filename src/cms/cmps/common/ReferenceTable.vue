<template>
    <section class="reference-table">
        <v-card>
            <v-icon 
                v-if="isEdit"
                class="reference-table-add-btn"
                @click="$emit('edit-ref')"
                title="Add Reference"
                >mdi-plus-circle</v-icon>
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
                :hide-default-footer="isShrinked"
                :disable-pagination="isShrinked"
                :headers="computedHeaders"
                :items="references"
                :items-per-page="5"
                :search="search"
                class="elevation-0"
            >
                <template #[`item.link`]="{ value }">
                    <a :href="value">
                        {{ value }}
                    </a>
                </template>
                <template #[`item.txt`]="{ value, item }">
                    <p :class="{'red--text': !value}">
                        {{ value || 'Reference does not exists on side 1 material' | ref-txt }}
                    </p>
                    <a :href="item && item.link" target="_blank" class="ref-link">
                        {{ item && item.link }}
                    </a>
                </template>
                <template #[`item.draftIdx`]="{ value, item }">
                    <span :class="{'red--text': !value}">
                        {{ isInteraction ? `${RefIdxForDisplay(item)} (${value || 'Invalid'})` : value }}
                    </span>
                </template>
                <template #[`item.type`]="{ value }">
                    {{ value || 'Null' }}
                </template>
                <template #[`item.actions`]="{ item }">
                    <v-icon 
                        class="edit-icon" 
                        @click="$emit('edit-ref', item)"
                        title="Edit Reference"
                        >mdi-pencil</v-icon>
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
        isInteraction: {
            type: Boolean,
            default: false
        },
        isEdit: {
            type: Boolean,
            default: false
        },
        isShrinked: {
            type: Boolean,
            default: false
        },
        isFlat: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            search: '',
            headers: [
                {
                    text: '#',
                    align: 'center',
                    sortable: true,
                    value: 'draftIdx',
                },
                {
                    text: 'Text',
                    align: 'start',
                    sortable: true,
                    value: 'txt',
                },
                {
                    text: 'Type',
                    align: 'start',
                    sortable: true,
                    value: 'type',
                },
                {
                    text: 'Actions',
                    align: 'start',
                    sortable: false,
                    value: 'actions'
                }
            ]
        };
    },
    computed: {
        computedHeaders() {
            return (this.isEdit) ? this.headers : this.headers.filter(header => header.text !== 'Actions');
        }
    },
    methods: {
        RefIdxForDisplay(item) {
            const idx = this.references.findIndex(ref => ref === item);
            return idx + 1;
        }
    }
};
</script>

<style>
</style>
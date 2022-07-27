<template>
    <section class="reference-table">
        <v-card>
            <v-icon 
                v-if="isEdit"
                class="reference-table-add-btn"
                @click="$emit('edit-ref')"
                title="Add Reference"
            >
                mdi-plus-circle
            </v-icon>
            <v-file-input
                v-if="isEdit"
                title="Upload excel file"
                class="reference-table-file-btn"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                clearable
                hide-details
                show-size
                dense
                single-line
                placeholder="Upload refs"
                @change="handleRefsUpload"
            />
            <v-btn v-if="references.length" color="success" class="mt-4 ml-4">
                <download-excel
                :data="refsToDownload"
                :name="`${name} refs.xls`"
                >
                    download refs
                </download-excel>
            </v-btn>
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
import readXlsxFile from 'read-excel-file';

export default {
    props: {
        references: {
            type: Array,
            required: true,
        },
        name: {
            type: String
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
        },
        refsToDownload(){
            return this.references.map( ref => {
                if(ref){
                    return {
                        order: ref.draftIdx,
                        type: ref.type || null,
                        space: '',
                        data: ref.txt + ' ' + ref.link
                    }
                }
                return {}
            })
        }
    },
    methods: {
        async handleRefsUpload(file) {
           const rows = await readXlsxFile(file);
            const refs = rows.reduce((acc, row, idx) => {
               if (idx === 0) return acc;
                let txt = row[3];
                let link = '';
                let pubmedId = '';
                let linkIdx = txt.indexOf('http://');
                if (linkIdx === -1) linkIdx = txt.indexOf('https://');
                if (linkIdx !== -1) {
                    link = txt.substring(linkIdx, txt.length);
                    txt = txt.substring(0, linkIdx);
                }
                if (link) {
                    const pubmedIdx = link.indexOf('pubmed');
                    if (pubmedIdx !== -1) {
                        const regex = /([\d])/g;
                        pubmedId = link.match(regex) ? link.match(regex).join('') : 0;
                    }
                }

                const ref = {
                    draftIdx: idx,
                    type: row[1] || '',
                    txt,
                    link,
                    pubmedId: +pubmedId
                };

                acc.push(ref);
                return acc;
           }, []);
           this.$emit('refs-uploaded', refs);
        },
        RefIdxForDisplay(item) {
            const idx = this.references.findIndex(ref => ref === item);
            return idx + 1;
        }
    }
};
</script>

<style>
</style>
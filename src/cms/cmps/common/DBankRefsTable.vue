<template>
  <section class="d-bank-refs-table">
        <v-icon 
            v-if="isEdit"
            @click="$emit('edit-ref')"
            class="reference-table-add-btn"
            title="Add Reference"
        >
            mdi-plus-circle
        </v-icon>
        <v-btn v-if="refs.length" color="success" class="mt-4 ml-4">
            <download-excel
            :data="refs"
            :name="`${name} dBank refs.xls`"
            >
                download drug bank refs
            </download-excel>
        </v-btn>
      <v-data-table
        caption="DrugBank's References"
        :headers="computedHeaders"
        :items="refs"
      >
        <template #[`item.draftIdx`]="{ value, item }">
            {{ value || refs.findIndex(currItem => currItem.ref_id === item.ref_id) + 1 }}
        </template>
        <template #[`item.citation`]="{ value, item }">
            <p>
                {{ value || item.title | ref-txt }}
            </p>
            <a 
                class="ref-link"
                :href="(item.pubmed_id) ? `https://pubmed.ncbi.nlm.nih.gov/${item.pubmed_id}` : item.url" 
                target="_blank" 
            >
                {{ (item.pubmed_id) ? `https://pubmed.ncbi.nlm.nih.gov/${item.pubmed_id}` : item.url }}
            </a>
        </template>
        <template #[`item.actions`]="{ item }">
            <v-icon 
                class="edit-icon" 
                @click="$emit('edit-ref', item)"
                title="Edit Reference"
            >
                mdi-pencil
            </v-icon>
        </template>
      </v-data-table>
  </section>
</template>

<script>
export default {
    props: {
        refs: {
            type: Array,
            required: true
        },
        name: {
            type: String
        },
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
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
                    value: 'citation'
                },
                {
                    text: 'ID',
                    align: 'center',
                    sortable: true,
                    value: 'ref_id'
                },
                {
                    text: 'Actions',
                    align: 'center',
                    sortable: false,
                    value: 'actions'
                }
            ]
        }
    },
    computed: {
        computedHeaders() {
            return (this.isEdit) ? this.headers : this.headers.filter(header => header.text !== 'Actions');
        }
    }
}
</script>
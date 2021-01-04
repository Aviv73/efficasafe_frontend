<template>
  <section class="d-bank-refs-table">
      <v-data-table
        caption="References"
        :headers="headers"
        :items="refs"
      >
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
      </v-data-table>
  </section>
</template>

<script>
export default {
    refIdx: 1,
    props: {
        refs: {
            type: Array,
            required: true
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
                }
            ]
        }
    }
}
</script>
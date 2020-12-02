<template>
  <section class="pathway-table">
    <v-card>
      <v-icon
        v-if="isEdit"
        class="pathway-table-add-btn"
        @click="$emit('edit-pathway')"
        title="Add Pathway"
        >mdi-plus-circle
      </v-icon>
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
        :items="items"
        :headers="computedHeaders"
        :items-per-page="5"
        :search="search"
        class="elevation-0"
      >
        <template #[`item.enzyme`]="{ value }">
          <span class="text-uppercase">{{ value }}</span>
        </template>
        <template #[`item.influence`]="{ value }">
          <div v-if="isHerb" v-html="value" class="pathway-table-influence"></div>
          <p v-else>{{ value }}</p>
        </template>
        <template #[`item.fullReferences`]="{ value, item }">
          <div class="pathway-table-full-ref">
            <p v-for="(fullRef, idx) in value" :key="idx">
              {{ formatedRef(fullRef) }}
              <a :href="`https://pubmed.ncbi.nlm.nih.gov/${item.references[idx]}`">
                {{ `https://pubmed.ncbi.nlm.nih.gov/${item.references[idx]}` }}
              </a>
            </p>
          </div>
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="pathway-table-actions">
            <v-icon
              class="edit-icon"
              @click="$emit('edit-pathway', item, itemIdx(item))"
              title="Edit Pathway"
              >mdi-pencil</v-icon
            >
          </div>
        </template>
      </v-data-table>
    </v-card>
  </section>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    isHerb: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Enzyme',
          align: 'start',
          sortable: false,
          value: 'enzyme',
        },
        {
          text: 'Influence',
          align: 'start',
          sortable: false,
          value: 'influence',
        },
        {
          text: 'Full References',
          align: 'start',
          sortable: false,
          value: 'fullReferences',
        },
        {
          text: 'Actions',
          align: 'start',
          sortable: false,
          value: 'actions',
        },
      ],
    };
  },
  computed: {
    computedHeaders() {
      let headers = [];
      if (this.isHerb) {
        headers = this.headers.filter(
          (header) => header.value !== 'fullReferences'
        );
      } else {
        headers = this.headers.filter((header) => header.value !== 'influence');
      }
      return this.isEdit
        ? headers
        : headers.filter((header) => header.value !== 'actions');
    },
  },
  methods: {
    itemIdx(item) {
        return this.items.findIndex(currItem => currItem === item);
    },
    formatedRef(fullRef) {
      const doiIdx = fullRef.indexOf('doi');
      if (doiIdx !== -1) {
        return fullRef.substring(0, doiIdx).trim();
      }
      const PmidIdx = fullRef.indexOf('PMID');
      if (PmidIdx !== -1) {
        return fullRef.substring(0, PmidIdx).trim();
      }
      return fullRef;
    },
  },
};
</script>
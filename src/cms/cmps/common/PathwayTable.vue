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
        <template #[`item.name`]="{ item }">
          <div 
            class="text-uppercase"
            :title="item.fullName"
            :style="{cursor: (item.fullName) ? 'help' : 'default' }"
          >
            {{ item.name }}
          </div>
          <span v-if="item.type">({{ item.type }})</span>
        </template>
        <template #[`item.itemActions`]="{ item }">
          <v-avatar
            class="action-types my-1"
            v-for="(action, idx) in item.actions"
            :key="idx"
            size="36"
            :title="action | capitalize"
            color="primary"
          >
            {{ action.charAt(0).toUpperCase() }}
          </v-avatar>
        </template>
        <template #[`item.fullReferences`]="{ value, item }">
          <div class="pathway-table-full-ref">
            <p v-for="(fullRef, idx) in value" :key="idx">
              {{ fullRef | ref-txt }}
              <a :href="getPathwayLink(item.references[idx])" class="ref-link">
                {{ getPathwayLink(item.references[idx]) }}
              </a>
            </p>
          </div>
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="pathway-table-actions">
            <v-icon
              class="edit-icon"
              @click="$emit('edit-pathway', item, getItemIdx(item))"
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
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Roles',
          align: 'center',
          sortable: false,
          value: 'itemActions'
        },
        {
          text: 'Full References',
          align: 'start',
          sortable: false,
          value: 'fullReferences',
        },
        {
          text: 'Actions',
          align: 'center',
          sortable: false,
          value: 'actions',
        },
      ],
    };
  },
  computed: {
    computedHeaders() {
      return this.isEdit ?
        this.headers :
        this.headers.filter((header) => header.value !== 'actions');
    },
  },
  methods: {
    getPathwayLink(pubmedId) {
      return (typeof pubmedId === 'number') ? `https://pubmed.ncbi.nlm.nih.gov/${pubmedId}` : pubmedId;
    },
    getItemIdx(item) {
      return this.items.findIndex(currItem => currItem === item);
    }
  }
};
</script>
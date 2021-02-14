<template>
  <v-card class="label-search">
    <v-card-title
      class="side-picker-title primary headline"
      style="color: white; font-weight: bold"
    >
      <v-icon dark class="mr-2">mdi-text-box-search-outline</v-icon>
      Search material by Drugbank's categories
      <v-spacer />
      <v-btn 
        icon
        dark
        @click="closeDialog"
      >
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-card-title>
    <main>
      <v-radio-group
        class="label-search-radios"
        v-model="search.action"
        mandatory
        :column="false"
      >
        <v-radio
          label="ONE FIELD"
          value=""
        />
        <v-radio
          label="AND"
          value="AND"
        />
        <v-radio
          label="AND NOT"
          value="AND_NOT"
        />
      </v-radio-group>
      <div class="label-search-inputs">
        <v-text-field
          class="label-search-inputs-field"
          v-model="search.query1"
          append-icon="mdi-magnify"
          placeholder="Search first category"
          @keypress.enter="getMaterials"
        />
        <v-text-field
          class="label-search-inputs-field"
          v-model="search.query2"
          append-icon="mdi-magnify"
          placeholder="Search second category"
          :disabled="!search.action"
          @keypress.enter="getMaterials"
        />
      </div>
      <div class="label-search-actions mb-4 mt-2">
        <v-btn
          class="mr-2"
          color="primary"
          outlined
          rounded
          @click="getMaterials"
          :disabled="!search.query1"
        >
          Search
        </v-btn>
        <v-btn
          class="ml-2"
          color="error"
          outlined
          rounded
          @click="materials = []"
          :disabled="!materials.length"
        >
          Reset
        </v-btn>
      </div>
      <v-divider />
      <div class="my-4">
        <div v-if="!isLoading && materials.length">
          <p class="mb-2">{{ materials.length }} materials are picked.</p>
          <v-btn
            color="success"
            outlined
            rounded
            @click="emitMaterials"
          >
            Add materials
          </v-btn>
        </div>
        <p v-if="!isLoading && !materials.length" class="ma-0">
          No results.
        </p>
        <v-progress-circular v-if="isLoading" />
      </div>
    </main>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      search: {
        action: '',
        query1: '',
        query2: ''
      },
      materials: [],
      isLoading: false
    }
  },
  methods: {
    async getMaterials() {
      this.isLoading = true;
      const { action, query1, query2 } = this.search;
      const criteria = {
        operator: action,
        category: (action) ? [ query1, query2 ] : query1,
        limit: 0,
        page: 0
      };
      const materials = await this.$store.dispatch({ type: 'getMaterials', criteria });
      this.materials = materials;
      this.isLoading = false;
    },
    reset() {
      this.materials = [];
      this.search = {
        action: '',
        query1: '',
        query2: ''
      }
    },
    closeDialog() {
      this.$emit('close-search-dialog');
    },
    emitMaterials() {
      this.$emit('import-materials', this.materials);
      this.reset();
      this.closeDialog();
    }
  }
}
</script>
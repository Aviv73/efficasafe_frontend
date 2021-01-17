<template>
  <section class="autocomplete">
    <v-autocomplete
      ref="autocomplete"
      v-model="select"
      :items="results"
      :background-color="backgroundColor"
      :color="color"
      :search-input.sync="search"
      :loading="isLoading"
      @change="emitAutocomplete"
      :label="placeholder"
      :disabled="isDisabled"
      clearable
      cache-items
      hide-selected
      flat
      :dark="isDark"
      :solo="isSolo"
      :solo-inverted="isSoloInverted"
      return-object
    />
  </section>
</template>

<script>
import { eventBus, EV_clear_autocomplete } from '@/services/eventBus.service';

export default {
  name: 'Autocomplete',
  props: {
    isLabel: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Search Material'
    },
    isDisabled: {
      type: Boolean,
      defualt: false
    },
    isDark: {
      type: Boolean,
      default: false
    },
    isSoloInverted: {
      type: Boolean,
      default: false
    },
    isSolo: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    isSuperLabelImport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      search: null,
      items: [],
      select: null,
      isLoading: false,
    };
  },
  watch: {
    search(val) {
      if (val && val !== this.select) this.getResults(val);
    },
  },
  computed: {
    materials() {
      return this.$store.getters.materials;
    },
    labels() {
      return this.$store.getters.labels;
    },
    results() {
      if (!this.items) return [];
      return this.items.map((item) => {
        const result = {
          _id: item._id,
          text: item.name,
        };
        if (item.type) result.type = item.type;
        if (item.src) result.src = item.src;
        return result;
      });
    },
  },
  methods: {
    async getResults(q) {
      this.isLoading = true;
      const criteria = { q: q || '' };
      if (this.isSuperLabelImport) {
        criteria.isSuper = true;
        criteria.limit = 0;
      }
      const entities = await this.$store.dispatch({
        type: (this.isLabel) ? 'getLabels' : 'getMaterials',
        criteria,
      });
      this.items = entities.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      this.isLoading = false;
    },
    emitAutocomplete() {
      this.select = this.select || null;
      this.$emit('emitAutocomplete', JSON.parse(JSON.stringify(this.select)));
    },
  },
  async created() {
    if (!this.isLabel) {
      if (this.materials) this.items = this.materials;
      else this.getResults(this.search);
    } else {
      if (this.labels && !this.isSuperLabelImport) this.items = this.labels;
      else this.getResults(this.search);
    }
  },
  mounted() {
    eventBus.$on(EV_clear_autocomplete, () => {
      this.$refs.autocomplete.setValue('');
    });
  },
  destroyed() {
    eventBus.$off(EV_clear_autocomplete);
  }
};
</script>
<template>
  <section class="material-label-path" v-if="atcPaths">
    <div v-if="labels" class="material-label-row">
      <autocomplete
        v-if="labels !== null"
        :items="labels"
        @emitAutocomplete="addLabel"
        searchName="labels"
      />
      <v-btn
        small
        class="label-add-btn"
        color="info"
        @click="$emit('open-custom-dialog')"
      >
        <v-icon dark left>mdi-label-outline</v-icon>new label
      </v-btn>
      <v-btn
        small
        class="label-add-btn"
        color="info"
        @click="$emit('open-atc-dialog')"
      >
        <v-icon dark left>mdi-file-tree</v-icon>ATC tree
      </v-btn>
    </div>
    <label-path-list
      :atcPaths="atcPaths"
      :isEdit="true"
    />
  </section>
</template>

<script>
import autocomplete from '@/cmps/Autocomplete';
import labelPathList from '@/cmps/material/details/LabelPathList';

export default {
  name: 'MaterialLabelPath',
  props: {
    atcPaths: Array,
  },
  computed: {
    labels() {
      return this.$store.getters.labels;
    },
  },
  methods: {
    addLabel(label) {
      if (label) {
        const path = [
          [
            {
              _id: label._id,
              name: label.text,
            },
          ],
        ];
        this.$emit('add-label', path);
      }
    }
  },
  components: {
    autocomplete,
    labelPathList,
  },
};
</script>

<style>
</style>
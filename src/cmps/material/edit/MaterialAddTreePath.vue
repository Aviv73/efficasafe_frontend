<template>
  <v-card>
    <v-card-title
      class="primary headline"
      style="color: white; font-weight: bold"
    >
      <v-icon dark left>mdi-file-tree</v-icon>Add ATC label
      <v-spacer></v-spacer>
      <v-icon dark right @click="closeDialog">mdi-window-close</v-icon>
    </v-card-title>
    <material-tree-view
      @branches-selected="toggleSubmit"
    ></material-tree-view>
    
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="normal" @click="closeDialog">Cancel</v-btn>
      <v-btn
        color="primary"
        @click="addLabelPaths"
        :disabled="!selection.length"
        >Add to material</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import materialTreeView from '@/cmps/common/MaterialTreeView';

export default {
  data() {
    return {
      selection: []
    };
  },
  methods: {
    toggleSubmit(selection) {
      this.selection = selection;
    },
    async addLabelPaths() {
      const selectedPaths = JSON.parse(JSON.stringify(this.selection));
      try {
        const labelPaths = await this.$store.dispatch({
          type: 'getLabelPaths',
          selectedPaths,
        });
        this.$emit('add-label-paths', labelPaths);
      } catch (err) {
        console.log('ERROR', err);
      }
      this.closeDialog();
    },
    closeDialog() {
      this.$emit('close-dialog');
      this.selection = [];
    }
  },
  components: {
    materialTreeView
  }
};
</script>
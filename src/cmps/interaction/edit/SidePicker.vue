<template>
  <v-card>
        <v-card-title
        class="primary headline"
        style="color: white; font-weight: bold"
        >
        <v-icon dark left>mdi-plus-box-multiple</v-icon>
        Add Side 2
        <v-spacer></v-spacer>
        <v-icon dark right @click="$emit('close-dialog')"
            >mdi-window-close</v-icon
        >
        </v-card-title>
    <section class="side-picker-container">
        <material-tree-view></material-tree-view> 
    </section>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="normal">Cancel</v-btn>
      <v-btn
        color="primary"
        >Add Side</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import materialTreeView from '@/cmps/common/MaterialTreeView';

export default {
  components: {
    materialTreeView,
  },
};
</script>
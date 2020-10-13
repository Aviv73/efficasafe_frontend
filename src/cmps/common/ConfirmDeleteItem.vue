<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <v-card>
      <v-card-title class="primary headline" style="color:white; font-weight:bold;">
        <v-icon dark left>mdi-delete</v-icon>Confirm Delete
      </v-card-title>
      <v-card-text
        style="margin-top:12px;"
      >Are you sure you want to delete this item from this list?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="normal" @click="$emit('remove-item-canceled')">Cancel</v-btn>
        <v-btn color="primary" @click="$emit('remove-item-confirmed')">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
  },
};
</script>

<style>
</style>
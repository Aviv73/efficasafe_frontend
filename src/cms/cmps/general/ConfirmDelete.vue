<template>
  <section>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="400">
        <v-card>
          <v-card-title class="primary headline" style="color:white; font-weight:bold;">
            <v-icon dark left>{{ (isRestore) ? 'mdi-archive-arrow-up' : 'mdi-delete' }}</v-icon>
            Confirm {{ (isRestore) ? 'Restore' : 'Delete' }}
          </v-card-title>
          <v-card-text style="margin-top:12px;">
            Are you sure you want to {{ (isRestore) ? 'restore' : 'delete' }} this {{ type }}?
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="normal" @click="cancelDelete">Cancel</v-btn>
            <v-btn color="primary" @click="confirmDelete">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </section>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    dialog: {
      type: Boolean,
      required: true
    },
    isRestore: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    confirmDelete() {
      this.$emit("delete-confirm");
    },
    cancelDelete() {
      this.$emit("delete-cancel");
    },
  },
};
</script>
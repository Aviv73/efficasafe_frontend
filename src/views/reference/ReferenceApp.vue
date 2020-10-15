<template>
  <section class="reference-app">
    <v-card class="mb-10" v-if="refs">
      <v-card-title>
        Reference collection
        <v-spacer></v-spacer>
      </v-card-title>

      <material-filter :materials="materials" @emit-filter="setFilter" />
      <material-list :materials="materials" :loading="loading" @options-updated="setSort" />
    </v-card>

    <icons-map />
  </section>
</template>

<script>
export default {

}
</script>

<style>

</style>
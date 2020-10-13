<template>
  <section class="reference-table">
    <v-simple-table class="ref-table" fixed-header height="300px">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">#</th>
            <th class="text-left">Type</th>
            <th class="text-left">Text</th>
            <th class="text-left">Link</th>
            <th class="text-left">Pubmed id</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(reference, idx) in references" :key="idx">
            <td>{{ idx + 1 }}</td>
            <td>{{ reference.type }}</td>
            <td>{{ reference.text }}</td>
            <td>{{ reference.link }}</td>
            <td>{{ reference.pubmedId }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </section>
</template>

<script>
export default {
  props: {
    references: Array,
  },
};
</script>

<style>
</style>
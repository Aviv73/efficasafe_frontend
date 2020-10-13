<template>
  <section class="label-path-list" v-if="labelPaths.length && labelPaths">
    <div class="path-container" v-for="(labelPath, idx) in labelPaths" :key="idx">
      <div class="path-number">
        <span>{{idx + 1}}.</span>
      </div>
      <div>
        <div v-for="(label, index) in labelPath" :key="label._id">
          <span v-html="pad(index)"></span>
          <router-link class :to="`/label/${label._id}`">{{label.name}}</router-link>
        </div>
      </div>
      <div class="edit-path" v-if="isEdit">
        <v-btn small color="error" @click="$emit('remove-path', idx)">
          <v-icon small left>mdi-delete</v-icon>
          Delete
        </v-btn>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "labelPathList",
  props: {
    labelPaths: Array,
    isEdit: Boolean,
  },
  methods: {
    pad(length) {
      return "&nbsp;".repeat(length * 2);
    },
  },
};
</script>
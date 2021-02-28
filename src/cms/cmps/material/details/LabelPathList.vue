<template>
  <section class="label-path-list" v-if="atcPaths.length && atcPaths">
    <div class="path-container" v-for="(atcPath, idx) in atcPaths" :key="idx">
      <div class="path-number">
        <span>{{idx + 1}}.</span>
      </div>
      <div>
        <div v-for="(label, idx) in atcPath" :key="idx">
          <span v-html="pad(idx)"></span>
          <span class="primary--text">{{label}}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'labelPathList',
  props: {
    atcPaths: Array,
    isEdit: Boolean,
  },
  methods: {
    pad(length) {
      return '&nbsp;'.repeat(length * 2);
    },
  },
};
</script>
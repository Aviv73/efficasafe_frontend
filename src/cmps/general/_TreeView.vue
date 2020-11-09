<template>
  <section class="tree-view">
    <ul>
      <li
        v-for="(item, idx) in items"
        :key="idx"
        :class="[ { leaf: (!item.children || !item.children.length) && depth > 2 },
                  { childless: depth <= 2 && (!item.children || !item.children.length) }
        ]"
      >
      <label>
        <input 
          hidden 
          type="checkbox" 
          class="expandInput"
          @change="onBranchToggle($event.target.checked, item.name)" />
        <v-icon>mdi-play</v-icon>
      </label>
      {{ item.name }}
      </li>
    </ul>
  </section>
</template>

<script>
import { atcService } from '@/services/atc.service';

export default {
  name: 'tree-view',
  props: {
    depth: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      items: null
    };
  },
  watch: {
    '$route.query'() {
      this.loadAtcLabels();
    }
  },
  methods: {
    onBranchToggle(isOpen, name) {
      console.log(isOpen, name); /// here i can know who is the parent
      const filterBy = {
        root: this.getAtcId(name)
      };
      if (isOpen) {
        this.pushUrlParams(filterBy);
      }
    },
    async loadAtcLabels() {
      const filterBy = this.$route.query;
      const items = await atcService.query(filterBy);
      console.log('Items:', items); /// need to append new items to their parent
      this.items = items;
    },
    pushUrlParams(filterBy) {
      this.$router.replace({ query: filterBy });
    },
    getAtcId(name) {
      return name.split(' ')[0];
    }
  },
  created() {
    this.loadAtcLabels();
  }
};
</script>

<style scoped lang="scss">
h6 {
  display: inline;
}
h6:hover {
  background-color: darken(white, 10%);
}
[type='checkbox']:indeterminate {
  outline: 1px solid #1976d2;
}
.expandInput:checked + .v-icon {
  display: inline-block;
  transform: rotateZ(90deg);
}
.leaf {
  padding-left: 36px;
}
.childless {
  padding-left: 24px;
}
.atc-id {
  margin: 0 6px;
}
</style>

<template>
  <div class="depleted-section">
    <p class="sure" v-if="sures.length">
      {{ material.name }} <span>leads</span> to deficiency of
      <template v-for="(c, idx) in sures">
        <button :title="hoverMsg" @click="handleClick(c)" :key="c.name">
          {{ c.name.trim() }}
        </button>
        <template v-if="idx < sures.length - 2">, </template>
        <template v-else-if="idx < sures.length - 1">
          <template v-if="sures.length > 2">, </template>
          and
        </template>
        <template v-else-if="idx === sures.length - 1">.</template>
      </template>
    </p>
    <p v-if="notSures.length">
      {{ material.name }} <span>may lead</span> to deficiency of
      <template v-for="(c, idx) in notSures">
        <button :title="hoverMsg" @click="handleClick(c)" :key="c.name">
          {{ c.name.trim() }}
        </button>
        <template v-if="idx < notSures.length - 2">, </template>
        <template v-else-if="idx < notSures.length - 1">
          <template v-if="notSures.length > 2">, </template>
          and
        </template>
        <template v-else-if="idx === notSures.length - 1">.</template>
      </template>
    </p>
  </div>
</template>

<script>
import {interactionService} from '../../../cms/services/interaction.service';
export default {
  name: 'MaterialDepletionsSection',
  props: {
    material: {
      type: Object
    },
    onClickMatCb: {
      type: Function
    },
    basePushUrl: {
      type: String,
      default: ''
    },
    hoverMsg: {
      type: String,
      default: ''
    },
  },
  computed: {
    sures() {
      return this.material.depleteds.filter((_) => _.sure);
    },
    notSures() {
      return this.material.depleteds.filter((_) => !_.sure);
    }
  },
  methods: {
    async handleClick(subMat) {
      if (this.onClickMatCb) return this.onClickMatCb(subMat);
      // this.$router.push(`/search?q=${this.material.name}&q=${subMat.name}`);

      let sideIds = [this.material._id, subMat._id];
      if (subMat.labelId) {
        sideIds = [subMat._id, subMat.labelId];
      }

      console.log(subMat);
      console.log(sideIds);

      const interaction = await interactionService.getBySideIds(sideIds);
      this.$router.push(`/interaction/${interaction._id}`);
    }
  }
}
</script>
        
<style lang="scss">
.depleted-section {
  .danger {
    color: red;
  }
  .warn {
    color: yellow;
  }
  a, button {
    border: none;
    background: none;
    padding: none;
    margin: none;
    display: inline;
    color: #55c595 !important;
    text-decoration: underline;
  }
  // .sure {
  //   a {
  //     color: red;
  //   }
  // }
}
</style>
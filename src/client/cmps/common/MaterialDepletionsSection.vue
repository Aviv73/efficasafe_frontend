
<template>
  <div class="depleted-section as-text" v-if="showAsTxt">
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
  <div class="depleted-section with-capsuls " v-else>
    <span>{{ material.name }} leads to deficiency of</span> <AppTooltip v-for="c in material.depleteds" :key="c._id"  on="focus">
      <template #preview>
        <span class="capsule" :class="c.sure? 'danger-border' : 'warn-border'">{{c.name}}</span>
      </template>
      <template #content>
        <div class="tooltip-content flex column gap10">
          <div class="flex align-center gap20">
            <h3 class="bold">{{c.name}}</h3>
            <button v-if="!isInSearch(c) && onClickMatCb" :title="hoverMsg" class="add-tosearch-btn flex align-center gap5" @click.stop="onClickMatCb(c)">
              <img :src="require('@/client/assets/imgs/plus.svg')" alt="" /> <span v-if="hoverMsg">({{hoverMsg}})</span>
            </button>
          </div>
          <p>{{ material.name }}
            <span v-if="c.sure" class="danger">leads</span>
            <span v-else class="warn">may lead</span>
          to {{c.name}} deficiency</p>
          <hr/>
          <div class="flex column gap10" v-if="material.monitor && material.monitor.symptoms.find(_ => _.material.name === c.name)">
            <h4 class="bold flex align-center space-between" @click="showSymptoms = !showSymptoms"><span>Deficiency symptoms</span> <img :class="{toggled: showSymptoms}" class="small-arrow-img" :src="require('@/client/assets/imgs/small-arrow-down.svg')"/></h4>
            <p class="symptom-p" v-if="showSymptoms">
              {{ material.monitor.symptoms.find(_ => _.material.name === c.name).value }}
            </p>
          </div>
          <p>
            <button @click="goToInteractionPage(c)">Interaction data <img :src="require('@/client/assets/imgs/link-out.svg')"/></button>
          </p>
          <p>
            <button @click="goToMatPage(c)">{{c.name}} info <img :src="require('@/client/assets/imgs/link-out.svg')"/></button>
          </p>
          <p>
            <router-link :to="`/search?q=${material.name}&q=${c.name}`" >All interactions of {{c.name}} <img :src="require('@/client/assets/imgs/link-out.svg')"/></router-link>
          </p>
        </div>
      </template>
    </AppTooltip>
  </div>
</template>

<script>
import {interactionService} from '../../../cms/services/interaction.service';
import AppTooltip from './AppTooltip.vue';
import { materialService } from '@/cms/services/material.service';
// import Tooltip from './Tooltip.vue';
export default {
  components: { AppTooltip },
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
    showAsTxt: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      innerMatsMap: {},
      showSymptoms: false
    }
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
      this.goToInteractionPage(subMat);
    },
    async goToInteractionPage(subMat) {
      let sideIds = [this.material._id, subMat._id];
      if (subMat.labelId) {
        sideIds = [subMat._id, subMat.labelId];
      }

      const interaction = await interactionService.getBySideIds(sideIds);
      if (!interaction) return alert('Cant find interaction..');
      this.$router.push(`/interaction/${interaction._id}/${subMat.labelId? this.material._id : ''}`);
    },

    goToMatPage(mat) {
      if (!mat._id || (mat._id.includes('NOT_FOUND'))) return alert('Cant find material..');
      this.$router.push(`/material/` + mat._id)
    },

    
    isInSearch(mat) {
      if (!this.$route.query.q) return false;
      return this.$route.query.q.find(c => c === mat.name);
    },

    async loadMatsMap() {
      this.material.depleteds.map(async c => {
        this.innerMatsMap[c._id] = await materialService.getById(c._id);
      })
    }
  },
  created() {
    // this.loadMatsMap();
  }
}
</script>
        
<style lang="scss">
.depleted-section {
  .flex {
    display: flex !important;
  }
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

  &.as-text {

  }

  &.with-capsuls {
    >* {
      &:not(:last-child) {
        margin-inline-end: 5px;
      }
    }
    .app-tooltip {
      display: inline-block;
      position: relative;
      width: fit-content;
      .msg {
        padding-inline-start: 0 !important;
        opacity: 1 !important;
        top: 50% !important;
        left: 50% !important;
      }
    }
  
    .capsule {
      cursor: pointer;
      position: relative;
      display: inline-block;
      height: 25px;
      // min-width: 110px;
      font-size: 0.85em;
      padding: 0 10px;
      font-weight: bold;
      border-radius: 15px;
      background-color: white;
      border: 1px solid black;
      display: flex;
      align-items: center;
      justify-content: center;
      &.danger-border {
        // border: 1px solid red;
        border-color: red;
      }
      &.warn-border {
        // border: 1px solid yellow;
        border-color: yellow;
      }
    }
  
    .tooltip-content {
      * {
        line-height: 1em;
      }
      h3 {
        margin: 0;
      }
      padding: 20px;
      padding-top: 40px;
      width: 300px;
      a, button {
        text-decoration: unset !important;
      }
      p {
        margin-bottom: 0;
        padding-inline-end: 0;
      }
    }

    .bold {
      font-weight: bold;
    }

    .symptom-p {
      line-height: 1.3em;
    }

    .small-arrow-img {
      cursor: pointer;
      transition: .2s;
      &.toggled {
        transform: rotate(180deg);
      }
    }
  }

  // .sure {
  //   a {
  //     color: red;
  //   }
  // }
}
</style>
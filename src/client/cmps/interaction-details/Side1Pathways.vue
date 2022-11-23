<template>
  <section class="side1-pathways">
    <div v-if="summary">
      <h3 class="font-medium regular-pointer">Summary</h3>
      <p
        class="paragraph regular-pointer"
        v-html="formatRefs(summaryWithRefs, true)"
        v-refs-tooltip.pathwaysSecond="{
          combinedRefs,
          side2Refs
        }"
      />
    </div>
    <template v-if="pathways.length">
      <div class="details-container">
        <h3 class="font-medium regular-pointer">Details</h3>
        <tooltip on="hover" topRightCorner>
          <template #content>
            <section class="pathways-tooltip-container">
              <div class="tip">
                <p>A <span class="green bold">green</span> marking means that <span class="underline">clinical studies</span> have shown no effect</p>
                <p>of the supplement on the pathway.</p>
              </div>
              <div class="tip">
                <p>A <span class="red bold">red</span> marking means that <span class="underline">clinical studies</span> have shown that the</p>
                <p>supplement inhibits or induces the pathway.</p>
              </div>
              <div class="tip">
                <p>A <span class="yellow bold">yellow</span> marking means that there are only <span class="underline">pre-clinical</span> studies</p>
                <p>and the effect of the supplement on the pathway is unclear.</p>
              </div>
            </section>
          </template>
          <information-outline-icon class="info-icon" :size="16" title="" />
        </tooltip>
      </div>
      <ul class="side1-pathways-nav flex-align-center">
        <li class="side1-pathways-nav-item" v-for="pathway in pathways" :key="pathway.name">
          <button class="chip" :class="setPathwayClassName(pathway.influence)" @click="activeTab = pathway.name">
            <chevron-down-icon v-if="activeTab !== pathway.name" :size="16" title="" />
            <chevron-up-icon v-else :size="16" title="" />
            {{ pathway.name }}
          </button>
        </li>
      </ul>
      <p
        class="active-tab-txt regular-pointer"
        v-show="pathways.length"
        v-html="formatRefs(activeTabTxt, true)"
        v-refs-tooltip.pathwaysSecond.dynamicTxt="{
          combinedRefs,
          side2Refs
        }"
      />
    </template>
    <span class="d-flex un-relevant-container">
      <span class="un-relevant regular-pointer" v-if="unrelevantPathways.length"> There are no studies on {{ `${materialName}'s` }} effect on: {{ unrelevantPathwayNames }} </span>
    </span>
  </section>
</template>

<script>
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';
import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline';

import Tooltip from '@/client/cmps/common/Tooltip';

export default {
  props: {
    summary: {
      type: String,
      default: ''
    },
    pathways: {
      type: Array,
      required: true
    },
    materialName: {
      type: String,
      required: true
    },
    unrelevantPathways: {
      type: Array,
      default: () => []
    },
    formatRefs: {
      type: Function,
      required: true
    },
    combinedRefs: {
      type: Array,
      required: true
    },
    side2Refs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeTab: this.pathways.length ? this.pathways[0].name : ''
    };
  },
  computed: {
    unrelevantPathwayNames() {
      return this.unrelevantPathways.map((p) => p.name?.toUpperCase()).join(', ');
    },
    activeTabTxt() {
      const pathway = this.pathways.find((p) => p.name === this.activeTab);
      return pathway ? pathway.influence : '';
    },
    summaryWithRefs() {
      return this.formatMaterialRefs(this.summary);
    }
  },
  methods: {
    formatMaterialRefs(txt) {
      const regex = /\(([\d- ,\d]+)\)|<sub>\(([\d- ,\d]+)\)<\/sub>/g;
      const matches = txt.match(regex);
      if (matches) {
        let lastidx = 0;
        matches.forEach((match) => {
          if (this.isRefStr(match)) {
            const idx = txt.indexOf(match, lastidx);
            if (idx < 0) return;
            lastidx = idx + 6;
            txt = txt.slice(0, idx) + txt.slice(idx).replace(match, `<sub>${match}</sub>`);
          }
        });
      }
      return txt;
    },
    isRefStr(refStr) {
      let doReturn = true;
      let formatted = refStr.replaceAll(/[-,()]/g, '__');
      formatted = formatted.split('__').filter((idxStr) => +idxStr);
      formatted.forEach((numStr) => {
        if (numStr.length >= 4) doReturn = false;
      });
      return doReturn;
    },
    setPathwayClassName(influence) {
      let firstLine = influence.split('</p>')[0];
      if (!firstLine) return '';
      firstLine = firstLine.toLowerCase();

      if (firstLine.includes('may induce') || firstLine.includes('may inhibit') || firstLine.includes('may bind')) {
        return 'chip-red';
      } else if (firstLine.includes('is unclear')) {
        return 'chip-yellow';
      } else if (firstLine.includes('not likely to affect')) {
        return 'chip-green';
      }

      return 'default';
    }
  },
  components: {
    ChevronUpIcon,
    ChevronDownIcon,
    InformationOutlineIcon,
    Tooltip
  }
};
</script>

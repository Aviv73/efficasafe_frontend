<template>
  <div
    class="interaction-capsules"
    :class="{
      dup: showDraftName,
      group: isGroup || isLabel
    }"
  >
    <div
      class="interaction-capsules-side"
      :class="{
        dense: dense,
        wide: onDetailsPage,
        'serach-engin-capsule': isSearcheEngin,
        'light-gray': isLowLevelInteraction
      }"
      @mouseenter="showTitle($event)"
      @mouseleave="showTitle(null)"
      v-if="!showDraftName && !isMaterialGroup"
    >
      <span v-if="isInteractionDetails" :class="{ pointer: isLink, 'clip-txt': isScreenNarrow }" @click="goToMaterial(side1NameToShow)">{{ side1NameToShow }}</span>
      <span v-else :title="side1NameToShow" :class="{ 'clip-txt': isScreenNarrow }">{{ side1NameToShow }}</span>
      <!-- <span v-if="isInteractionDetails" :class="{ pointer: isLink, 'clip-txt': isScreenNarrow }" @click="goToMaterial(side1NameToShow)">{{ isScreenNarrow ? side1NameToShow.slice(0, 15) : side1NameToShow }}</span>
      <span v-else :title="side1NameToShow" :class="{ 'clip-txt': isScreenNarrow }">{{ isScreenNarrow ? side1NameToShow.slice(0, 16) : side1NameToShow }}</span> -->

      <!-- old title - "titleSide1" -->
      <svg xmlns="http://www.w3.org/2000/svg" class="cap cap-left" viewBox="0 0 24.192 48.001">
        <path
          :fill="color"
          d="M24.192,48h-.221A23.973,23.973,0,0,1,0,24,23.96,23.96,0,0,1,23.972,0h.221V4.132a21.046,21.046,0,0,0-6.841,1.532A20.58,20.58,0,0,0,10.8,9.929a19.82,19.82,0,0,0-4.414,6.326,19.338,19.338,0,0,0,0,15.492A19.81,19.81,0,0,0,10.8,38.071a20.585,20.585,0,0,0,6.548,4.265,21.043,21.043,0,0,0,6.841,1.532V48Z"
          transform="translate(24.192 48.001) rotate(180)"
        />
      </svg>
    </div>
    <div
      class="interaction-capsules-side"
      :class="{
        dense: dense,
        wide: onDetailsPage,
        'serach-engin-capsule': isSearcheEngin,
        'light-gray': isLowLevelInteraction
      }"
      @mouseenter="showTitle($event)"
      @mouseleave="showTitle(null)"
    >
      <svg v-if="showDraftName || isMaterialGroup" xmlns="http://www.w3.org/2000/svg" class="cap cap-left" viewBox="0 0 24.192 48.001">
        <path
          :fill="color"
          d="M24.192,48h-.221A23.973,23.973,0,0,1,0,24,23.96,23.96,0,0,1,23.972,0h.221V4.132a21.046,21.046,0,0,0-6.841,1.532A20.58,20.58,0,0,0,10.8,9.929a19.82,19.82,0,0,0-4.414,6.326,19.338,19.338,0,0,0,0,15.492A19.81,19.81,0,0,0,10.8,38.071a20.585,20.585,0,0,0,6.548,4.265,21.043,21.043,0,0,0,6.841,1.532V48Z"
          transform="translate(24.192 48.001) rotate(180)"
        />
      </svg>
      <span v-if="isInteractionDetails" :class="{ pointer: isLink, 'clip-txt': isScreenNarrow }" @click="goToMaterial(draftNameContent)"> {{ draftNameContent }} </span>
      <span v-else :title="titleSide2" :class="{ 'clip-txt': isScreenNarrow }">
        {{ draftNameContent }}
      </span>
      <!-- <span v-if="isInteractionDetails" :class="{ pointer: isLink, 'clip-txt': isScreenNarrow }" @click="goToMaterial(draftNameContent)"> {{ isScreenNarrow ? trimmedDraftNameContent : draftNameContent }} </span>
      <span v-else :title="titleSide2" :class="{ 'clip-txt': isScreenNarrow }">
        {{ isScreenNarrow ? trimmedDraftNameContent : draftNameContent }}
      </span> -->
      <svg xmlns="http://www.w3.org/2000/svg" class="cap cap-right" viewBox="0 0 24.192 48.001">
        <path
          :fill="color"
          d="M24.192,0h-.221A23.973,23.973,0,0,0,0,24,23.96,23.96,0,0,0,23.971,48h.221V43.869a21.046,21.046,0,0,1-6.841-1.532A20.58,20.58,0,0,1,10.8,38.072a19.82,19.82,0,0,1-4.414-6.326,19.338,19.338,0,0,1,0-15.492A19.81,19.81,0,0,1,10.8,9.93a20.585,20.585,0,0,1,6.548-4.265,21.042,21.042,0,0,1,6.841-1.532V0Z"
        />
      </svg>
    </div>
    <span v-if="isGroup || isLabel">
      <span
        class="layer"
        v-for="n in 3"
        :key="n"
        :style="{
          transform: `translateX(-${n * 5}px)`
        }"
      />
    </span>
  </div>
</template>

<script>
import { utilService } from '@/cms/services/util.service';

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#b1b1b1'
    },
    vInteractionCount: {
      type: Number,
      required: true
    },
    localize: {
      type: Boolean,
      required: true
    },
    showDraftName: {
      type: Boolean,
      required: true
    },
    draftName: {
      type: String,
      default: ''
    },
    isLabel: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    onDetailsPage: {
      type: Boolean,
      default: false
    },
    isMaterialGroup: {
      type: Boolean,
      default: false
    },
    exactName: {
      type: String,
      required: false
    },
    isPositive: {
      type: Boolean,
      default: false
    },
    isSearcheEngin: {
      type: Boolean,
      default: false
    },
    isLink: {
      type: Boolean,
      default: false
    },
    isInteractionDetails: {
      type: Boolean,
      default: false
    },
    isLowLevelInteraction: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      testEl: null
    };
  },
  computed: {
    isScreenNarrow() {
      return this.$store.getters.isScreenNarrow;
    },
    trimmedDraftNameContent() {
      let slicedName = this.draftNameContent.slice(0, 15);
      if (slicedName.length === 15) {
        return slicedName + '...';
      } else return slicedName;
    },
    materials() {
      return this.$store.getters.materials;
    },
    isGroup() {
      return this.vInteractionCount > 0;
    },
    sortBySide() {
      return this.$store.getters.firstInteractionSide;
    },
    // draftNameFullContent() {
    //     if((this.$route.name === 'InteractionDetails' ||  this.$route.name === 'VinteractionDetails') && this.sortBySide === 2) return this.side1Name
    //     const nameToDisplay = (this.showDraftName && this.draftName) ? this.draftName : this.side2Name;
    //     if(this.$route.name === 'Boosters') return nameToDisplay
    //     return (this.vInteractionCount) ? `${nameToDisplay} (${this.vInteractionCount})` : nameToDisplay;
    // },
    draftNameContent() {
      if ((this.$route.name === 'InteractionDetails' || this.$route.name === 'VinteractionDetails') && this.sortBySide === 2) {
        const side1Name = this.name.split('&')[0].trim();
        return side1Name;
      }
      const nameToDisplay = this.showDraftName && this.draftName ? this.draftName : this.side2Name;

      // const side1Name = this.name.split('&')[0].trim();
      
      // const fixedName = this.materials.find(c => c.name === this.draftName)?.userQuery || nameToDisplay;

      if (this.$route.name === 'Boosters') return nameToDisplay;
      // if (nameToDisplay.length >= 14 && this.isGroup) {
      //     return `${nameToDisplay.substring(0, 12)}...(${this.vInteractionCount})`;
      // }
      return this.vInteractionCount ? `${nameToDisplay} (${this.vInteractionCount})` : nameToDisplay;
    },
    side1NameToShow() {
      if (!this.name || this.isMaterialGroup) return '';
      if ((this.$route.name === 'InteractionDetails' || this.$route.name === 'VinteractionDetails') && this.sortBySide === 2) return this.side2Name;
      const side1Name = this.name.split('&')[0].trim();
      // if (this.onDetailsPage || !this.isSideSwapped) return side1Name;
      if (this.$store.getters.materialNamesMap && this.$store.getters.materialNamesMap[side1Name]) {
        const queryName = this.$store.getters.materialNamesMap[side1Name][0];
        const count = this.materials.reduce((acc, m) => {
          if (m.userQuery === queryName) {
            acc++;
          }
          return acc;
        }, 0);
        if (count > 1) {
          return `${queryName} - ${side1Name}`;
        } else {
          return queryName;
        }
      }
      return side1Name;
    },
    // side1Name() {
    //     if (!this.name || this.isMaterialGroup) return '';
    //     const side1Name = this.name.split('&')[0].trim();
    //     // if (this.onDetailsPage || !this.isSideSwapped) return side1Name;
    //     if (this.$store.getters.materialNamesMap && this.$store.getters.materialNamesMap[side1Name]) {
    //         return this.$store.getters.materialNamesMap[side1Name][0];
    //     }
    //     return side1Name;
    // },
    side2Name() {
      // if (!this.name) return '';
      // if (this.isMaterialGroup) return this.$store.getters.materialNamesMap[this.name] ? this.$store.getters.materialNamesMap[this.name][0] : this.name
      // const side2Name = this.name.split('&')[1].trim();
      // const queries = this.$store.getters.materialNamesMap ? this.$store.getters.materialNamesMap[side2Name] : null;
      // const count = queries ? this.$store.getters.queryApearanceCount(queries[0]) : 0;
      // if(this.isPositive && count > 1) return side2Name
      // if (!this.isInteractionDetails && !this.localize && this.isSideSwapped) return side2Name;
      // if (queries) {
      //     return queries[0];
      // }
      // return side2Name;

      // if (!this.name || this.isMaterialGroup) return '';
      // if((this.$route.name === 'InteractionDetails' ||  this.$route.name === 'VinteractionDetails') && this.sortBySide === 2) return this.side2Name
      if (!this.name) return '';
      if (this.isMaterialGroup) return this.$store.getters.materialNamesMap[this.name] ? this.$store.getters.materialNamesMap[this.name][0] : this.name;
      const side2Name = this.name.split('&')[1].trim();
      // if (this.onDetailsPage || !this.isSideSwapped) return side1Name;
      if (this.$store.getters.materialNamesMap && this.$store.getters.materialNamesMap[side2Name]) {
        const queryName = this.$store.getters.materialNamesMap[side2Name][0];
        const count = this.materials.reduce((acc, m) => {
          if (m.userQuery === queryName) {
            acc++;
          }
          return acc;
        }, 0);
        if (queryName === side2Name) return side2Name;
        if (count > 1) {
          return `${queryName} - ${side2Name}`;
        } else {
          return queryName;
        }
      }
      return side2Name;
    },
    isSideSwapped() {
      if (this.$store.getters.firstInteractionSide === 1) return true;
      return false;
    },
    titleSide1() {
      if (this.name.includes('&')) {
        const side1Name = this.name.split('&')[0].trim();
        return side1Name;
      }
      return this.side1NameToShow;
    },
    titleSide2() {
      if (this.name.includes('&')) {
        const side1Name = this.name.split('&')[1].trim();
        return side1Name;
      }
      return this.draftNameContent;
    }
  },
  methods: {
    goToMaterial(name) {
      if (!this.isLink) return;
      if (name.includes('-')) {
        this.$emit('go-to-material', name.split('-')[0].trim());
      }
      this.$emit('go-to-material', name);
    },
    showTitle(ev) {
      if (!ev) {
        this.$emit('openModal', null);
        return;
      }
      // const page = {
      //   // pageX: ev.pageX,
      //   // offset: ev.offsetY
      //   x: ev.screenX,
      //   y: ev.screenY
      // };
      const page = utilService.getMousePosition(ev);
      this.$emit('openModal', page);
    }
  }
};
</script>

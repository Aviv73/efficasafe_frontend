<template>
  <section class="interaction-preview positive-booster" v-if="currInteraction && currInteraction.vInteractions.length">
    <collapse v-for="(group, idx) in sortVints(currInteraction.vInteractions)" :key="group._id + idx" @collapse-closed="onCollapseToggle(idx, group.cacheKey)" :initial-is-visible="isInitialiOpen(idx)" :disable="!isAllowed(idx)">
      <template #header>
        <div class="interaction-preview-header table-row child" :class="{ 'interaction-column': !isAllowed(idx) }" @click="onCollapseToggle(idx, group.cacheKey)">
          <span class="table-col capsul-container flex align-center">
            <!-- <positive-inner-list-count :key="renderKey" :group="group" :length="group.innerLength"/> -->
            <interaction-capsules :name="getInnerGroupName(group)" :isMaterialGroup="true" :color="getInteractionColor(group.recommendation, idx)" :showDraftName="false" :vInteractionCount="0" :localize="true" />
            <button v-if="!isInSearch(group)" title="Add to search results" class="add-tosearch-btn" @click.stop="addToSearch(group)">
              <img :src="require('@/client/assets/imgs/plus.svg')" alt="" />
            </button>
          </span>
          <span v-if="isAllowed(idx)" class="table-col recomendation" :title="group.recommendation">
            {{ getShortRecommendation(group.recommendation) }}
          </span>
          <span v-else class="table-col flex-start" title="Open only for subscribers">
            <lock-icon class="lock-icon" :size="18" />
            <p class="clip-txt">open only for subscribers</p>
          </span>
          <span v-if="isAllowed(idx)" class="table-col small-data">
            <tooltip :txt="getLongEvidenceLevel(group.evidenceLevel)" right>
              <span class="evidence-level" :class="{ only: group.evidence_level && true }">
                {{ group.evidenceLevel }}
              </span>
            </tooltip>
            <span class="de-activator">
              <chevron-up-icon class="opened" title="" />
              <chevron-down-icon class="closed" title="" />
            </span>
          </span>
          <span v-else-if="!loggedInUser" class="table-col sign-up-tabel flex-start" @click="onOpenSignUp">
            <p>Sign up</p>
            <chevron-right-icon class="chevron-right-icon" />
          </span>
          <span v-else class="table-col sign-up-tabel flex-start" @click="onOpenSubscribe">
            <p>Choose plan</p>
            <chevron-right-icon class="chevron-right-icon" />
          </span>
        </div>
      </template>
      <template #content>
        <div class="interaction-preview-content">
          <positive-interaction-inner-list
            :parentInteraction="interaction"
            :group="group" 
            :side1-id="group.side1Material._id"
            :side2-id="group.side2Material._id"
            :main-side2-material-id="interaction.mainMaterialId"
            :materials="materials"
            :exactName="interaction.exactName"
            :isSupp="isSupp"
            :groupIdx="idx"
            @remove="removeGroup"
            @groupDone="groupDone"
            @setInnerInteractionsLength="setInnerInteractionsLength"
            @doneDrugGroup="sortVinteractions"
          />
        </div>
      </template>
      <template #de-activator>
        <collapse-toggle-icon />
      </template>
    </collapse>
  </section>
</template>

<script>
import { eventBus, EV_open_signup } from '@/cms/services/eventBus.service'
import { interactionUIService } from '@/cms/services/interaction-ui.service'
import { interactionService } from '@/cms/services/interaction.service'

import Collapse from '@/client/cmps/common/Collapse'
import Tooltip from '@/client/cmps/common/Tooltip'
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules'
import PositiveInteractionInnerList from '@/client/cmps/search-engine/PositiveInteractionInnerList'
// import PositiveInnerListCount from '@/client/cmps/search-engine/PositiveInnerListCount';

import CollapseToggleIcon from '@/client/cmps/common/icons/CollapseToggleIcon'
import ChevronUpIcon from 'vue-material-design-icons/ChevronUp'
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown'
import LockIcon from 'vue-material-design-icons/Lock'
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight'

export default {
  name: 'PositiveInteractionPreview',
  props: {
    interaction: {
      type: Object,
      required: true
    },
    materials: {
      type: Array,
      required: true
    },
    parentIdx: {
      type: Number,
      required: true
    },
    isSupp: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      openCollapses: [],
      currInteraction: null,
      groupsDoneLoadingCount: 0,
      vInteractionsOriginalLength: null,
      renderKey: 101
    }
  },
  computed: {
    isScreenNarrow() {
      return this.$store.getters.isScreenNarrow
    },
    isAllowed() {
      return idx => {
        if (this.isShareTokenValid) return true
        if (this.loggedInUser && this.loggedInUser.type === 'subscribed') return true
        if (this.loggedInUser && !this.loggedInUser.email_verified) {
          if (idx > 0 || this.freeSearchesCount <= 0) return false
          return true
        }
        if (this.loggedInUser && this.freeTrialTime <= 0) return false
        if (!this.loggedInUser && this.freeSearchesCount <= 0) return false
        if (!this.loggedInUser && idx > 0) return false
        return true
      }
    },
    isShareTokenValid() {
      return this.$store.getters.getIsSharedToken
    },
    loggedInUser() {
      return this.$store.getters.loggedInUser
    },
    freeTrialTime() {
      const {
        loggedInUser: { trialTime }
      } = this.$store.getters
      const timeLeft = trialTime - Date.now()
      const daysLeft = timeLeft / (1000 * 3600 * 24)
      return daysLeft > 0 ? Math.ceil(daysLeft) : 0
    }
  },
  methods: {
    sortVints(vInts = []) {
      const map = interactionUIService.getRecommendationOrderMap();
      return [...vInts].sort((a, b) => {
        // return (b.children?.length || 0) - (a.children?.length || 0);
        // const calcVal = (vint) => (10 - vint.recommendation) * (vint.children?.length || 0);
        // const calcVal = (vint) => (vint.children?.length || 0);
        // const calcVal = (vint) => vint.children.reduce((sum, c) => sum + (10 - map[c.recommendation]), 0) * (vint.children?.length || 0);
        // const calcVal = (vint) => vint.children.reduce((sum, c) => sum + (11 - map[c.recommendation]), 0) / vint.children.length + vint.children.length * 0.6;
        const calcVal = (vint) => vint.children.reduce((val, c) => {
            switch (11 - map[c.recommendation]) {
              case 9:
                return val + 2.5;
              case 8:
                return val + 2;
              case 7:
              case 6:
                return val + 1;
              case 5:
                return val + -1;
              default:
                return val;
            }
          }, 0);
        return calcVal(b) - calcVal(a);
        // return (map[b.recommendation] - map[a.recommendation]) * -1 || a.evidenceLevel.toLowerCase().localeCompare(b.evidenceLevel.toLowerCase()) || (b.children?.length || 0) - (a.children?.length || 0) || a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        // return (map[b.recommendation] - map[a.recommendation]) * -1 || a.evidenceLevel.toLowerCase().localeCompare(b.evidenceLevel.toLowerCase()) || a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
    },
    isInSearch(mat) {
      if (!this.$route.query.q) return false;
      return this.$route.query.q.find(c => c === this.getInnerGroup(mat).name);
    },
    addToSearch(toAdd) {
      this.$emit('add-to-search', this.getInnerGroup(toAdd))
    },
    sortVinteractions() {
      // const map = interactionUIService.getRecommendationOrderMap();
      // this.currInteraction.vInteractions.sort((a, b) => {
      //   return (a.innerLength - b.innerLength) * -1 || (map[b.recommendation] - map[a.recommendation]) * -1 || (b.innerRecSum - a.innerRecSum) * -1 || a.evidenceLevel.toLowerCase().localeCompare(b.evidenceLevel.toLowerCase()) || a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      // });
    },
    onOpenSignUp() {
      eventBus.$emit(EV_open_signup)
    },
    onOpenSubscribe() {
      this.$router.push('/subscribe')
    },
    getBadgeColor({ recommendation }) {
      const color = interactionUIService.getInteractionColor(recommendation)
      if (color === '#F6D55C') return 'background-color: #F6D55C; color: blue'
      return 'background-color: #55C595'
    },
    setInnerInteractionsLength(data) {
      if (this.currInteraction.vInteractions[data.idx]) {
        this.currInteraction.vInteractions[data.idx].innerLength = data.length
        this.currInteraction.vInteractions[data.idx].innerRecSum = data.innerRecSum
      }
      this.renderKey++
    },
    removeGroup(idx) {
      this.currInteraction.vInteractions.splice(idx, 1)
      this.$emit('setCount', this.currInteraction.vInteractions.length)
      if (!this.currInteraction.vInteractions.length) {
        this.$emit('removeInteraction', this.parentIdx)
      }
    },
    groupDone() {
      this.groupsDoneLoadingCount++
      const ids = this.currInteraction.vInteractions.map(vInt => `${this.currInteraction.mainMaterialId}-${vInt.side1Material._id}-${vInt.side2Material._id}`)
      this.$nextTick(() => {
        this.$store.commit('setPosSuppIds', { ids })
        if (this.groupsDoneLoadingCount === this.vInteractionsOriginalLength) {
          this.sortVinteractions()
          this.$emit('interactionDone')
        }
      })
    },
    isInitialiOpen(idx) {
      return this.openCollapses.includes(idx)
    },
    onCollapseToggle(idx, key) {
      const cacheData = {
        key,
        idx,
        parentIdx: this.parentIdx
      }
      interactionService.cacheSearchState(cacheData)
    },
    getInteractionColor(recommendation, idx) {
      if (!this.isAllowed(idx)) return '#a4b8c6'
      return interactionUIService.getInteractionColor(recommendation)
    },
    getInnerGroup(group) {
      if (this.isSupp && this.interaction.mainMaterialId === group.side1Material._id) return group.side2Material || group.side2Label
      else return group.side1Material
    },
    getInnerGroupName(group) {
      let idx = 0
      if (this.isSupp && this.interaction.mainMaterialId === group.side1Material._id) idx = 1
      return group.name.split('&')[idx].trim()
    },
    getShortRecommendation(fullRec) {
      return interactionUIService.getShortRecommendation(fullRec)
    },
    getLongEvidenceLevel(evidenceLevel) {
      if (!evidenceLevel) return ''
      switch (evidenceLevel.toString().toUpperCase()) {
        case 'A':
          return 'A - multi clinical or meta analysis'
        case 'B':
          return 'B - 1 clinical or cohort + pre-clinical'
        case 'C':
          return 'C - 1 clinical or cohort'
        case 'D':
          return 'D - case report'
        case 'E':
          return 'E - multi pre-clinical'
        case 'F':
          return 'F - 1 pre-clinical'
        case '1':
          return 'information formally provided in official prescribing information'
        case '2':
          return 'based on scientific and clinical knowledge referenced from a variety of evidence sources'
        default:
          return ''
      }
    }
  },
  created() {
    this.interaction.vInteractions.forEach(({ cacheKey }) => {
      if (!cacheKey) return
      const res = interactionService.getCache(cacheKey)
      if (!res?.searchState) return
      Object.values(res.searchState).forEach(value => {
        Object.keys(value).forEach(idx => {
          this.openCollapses.push(+idx)
        })
      })
    })
    this.currInteraction = JSON.parse(JSON.stringify(this.interaction))
    this.vInteractionsOriginalLength = this.currInteraction.vInteractions.length
    this.sortVinteractions()
  },
  components: {
    Collapse,
    InteractionCapsules,
    Tooltip,
    ChevronUpIcon,
    ChevronDownIcon,
    PositiveInteractionInnerList,
    // PositiveInnerListCount,
    CollapseToggleIcon,
    LockIcon,
    ChevronRightIcon
  }
}
</script>

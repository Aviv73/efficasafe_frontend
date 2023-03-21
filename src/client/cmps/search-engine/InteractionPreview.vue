<template>
  <section class="interaction-preview" :id="interaction._id">
    <collapse @collapse-closed="onCollapseToggle" :initialIsVisible="$route.name === 'Monitor'" :initial-is-visible="initialCollapseIsVisible" :disable="!isAllowed">
      <template #header>
        <component :is="headerCmp" :to="interactionURL" @click="onCollapseToggle">
          <span v-if="$route.name === 'Boosters' && !isChild && !interaction.isNegative" class="poss-booster-count badge" :style="getBadgeColor(interaction)">{{ newLength || getVinteractionsCount(interaction) }}</span>
          <div
            class="interaction-preview-header table-row"
            :class="{
              child: isChild,
              'dups-list': isDuplicate,
              'empty-group': interaction.isEmpty,
              'interaction-column': !isAllowed
            }"
          >
            <span class="table-col" :class="{ 'flex-align-center': isDuplicate, 'off-interaction-col-1': !isAllowed }">
              <interaction-capsules
                :name="interactionName || ''"
                :color="getInteractionColor(interaction)"
                :vInteractionCount="newLength || getVinteractionsCount(interaction)"
                :localize="!isCompoundPart"
                :showDraftName="isDuplicate"
                :draftName="interaction.side2DraftName"
                :isLabel="!!interaction.side2Label"
                :isMaterialGroup="!!interaction.isMaterialGroup"
                :exactName="exactName"
                :isPositive="isPositive"
                :isSearcheEngin="true"
                :isLowLevelInteraction="isLowLevelInteraction(interaction)"
              />
            </span>
            <span v-if="isAllowed" class="recomendation table-col" :class="{ 'recomendation-not-advised': interaction.recommendation === 'Coadministration is not advised' }" :title="interaction.recommendation">
              {{ getShortRecommendation(interaction.recommendation) }}
            </span>
            <span v-else class="table-col flex-start off-interaction-col-2" title="Open only for subscribers">
              <lock-icon class="lock-icon" :size="18" />
              <p class="clip-txt">open only for subscribers</p>
            </span>
            <span
              v-if="isAllowed"
              class="table-col small-data"
              :class="{
                'small-data-not-advised': interaction.recommendation === 'Coadministration is not advised',
                togglable: ((!interaction.refs && !interaction.severity) || interaction.side2Label) && !interaction.isEmpty
              }"
            >
              <tooltip right :txt="getLongEvidenceLevel(interaction.evidenceLevel || interaction.evidence_level)">
                <template #content>
                  <ul class="loe-tooltip">
                    <li>{{ getLongEvidenceLevel(interaction.evidenceLevel || interaction.evidence_level) }}</li>
                    <li v-if="interaction.refs && !interaction.side2Label">{{ getRefsCountTxt(interaction) }} scientific articles</li>
                  </ul>
                </template>
                <span class="evidence-level" :class="{ only: interaction.evidence_level && true }">
                  {{ interaction.evidenceLevel || interaction.evidence_level }}
                </span>
                <span class="refs" v-if="interaction.refs && !interaction.side2Label">
                  {{ getRefsCount(interaction) }}
                </span>
              </tooltip>
              <!-- Arrow -->
              <span v-if="((!interaction.refs && !interaction.severity) || interaction.side2Label) && !interaction.isEmpty" class="de-activator">
              <!-- <span v-if="interaction.vInteractions" class="de-activator"> -->
                <chevron-up-icon class="opened" title="" />
                <chevron-down-icon class="closed" title="" />
              </span>
            </span>
            <!-- <span v-else class="table-col sign-up-tabel flex-start" @click="onOpenSignUp">
                            <p>
                                Sign up
                            </p>
                            <chevron-right-icon class="chevron-right-icon"/>
                        </span> -->
            <span v-else-if="!loggedInUser" class="table-col sign-up-tabel flex-start" @click="onOpenSignUp">
              <p>Sign up</p>
              <chevron-right-icon class="chevron-right-icon" />
            </span>
            <span v-else class="table-col sign-up-tabel flex-start" @click="onOpenSubscribe">
              <p>Choose plan</p>
              <chevron-right-icon class="chevron-right-icon" />
            </span>
          </div>
        </component>
      </template>
      <template #content>
        <div class="negative-msg" v-if="interaction.isNegative">{{ negativeMsgName(interaction.name) }} has a negative interaction with one of the searched drugs</div>
        <div class="interaction-preview-content" :class="{ link: link }" v-if="!interaction.side2Label && interaction.side2Material">
          <div v-if="!link">
            <div v-if="$route.name === 'Monitor'">
              <ul class="monitor-list" v-if="interaction.monitor.general || interaction.monitor.labTests || interaction.monitor.otherTests || interaction.monitor.symptoms">
                <li v-if="interaction.monitor.general">
                  <span class="monitor-list-header font-bold">General:</span>
                  {{ interaction.monitor.general }}
                </li>
                <li v-if="interaction.monitor.labTests">
                  <span class="monitor-list-header font-bold">Lab tests:</span>
                  {{ interaction.monitor.labTests }}
                </li>
                <li v-if="interaction.monitor.otherTests">
                  <span class="monitor-list-header font-bold">Other tests:</span>
                  {{ interaction.monitor.otherTests }}
                </li>
                <li v-if="interaction.monitor.symptoms">
                  <span class="monitor-list-header font-bold">Symptoms:</span>
                  {{ interaction.monitor.symptoms }}
                </li>
              </ul>
              <p class="monitor-list" v-else>There is nothing to monitor for this interaction.</p>
            </div>
            <div v-else>
              <h3 class="font-bold">Summary</h3>
              <long-txt :txt="interaction.summary" :maxChars="250" :expandable="false" :overflowSymb="getInteractionLink(interaction)" isHTML />
            </div>
          </div>
          <chevron-up-icon
            class="chevron-icon"
            :class="{
              'u-hide': $route.name === 'Monitor'
            }"
            title=""
          />
        </div>
        <div class="interaction-preview-content" :class="{ child: isChild }" v-else-if="interaction.side2Label && !interaction.side2Material">
          <template v-if="$route.name === 'Monitor'">
            <ul class="monitor-list" v-if="interaction.monitor.general || interaction.monitor.labTests || interaction.monitor.otherTests || interaction.monitor.symptoms">
              <li v-if="interaction.monitor.general">
                <span class="monitor-list-header font-bold">General:</span>
                {{ interaction.monitor.general }}
              </li>
              <li v-if="interaction.monitor.labTests">
                <span class="monitor-list-header font-bold">Lab tests:</span>
                {{ interaction.monitor.labTests }}
              </li>
              <li v-if="interaction.monitor.otherTests">
                <span class="monitor-list-header font-bold">Other tests:</span>
                {{ interaction.monitor.otherTests }}
              </li>
              <li v-if="interaction.monitor.symptoms">
                <span class="monitor-list-header font-bold">Symptoms:</span>
                {{ interaction.monitor.symptoms }}
              </li>
            </ul>
            <p class="monitor-list" v-else>There is nothing to monitor for this interaction.</p>
          </template>
          <template v-else>
            <label-interaction-preview v-if="materials && materials.length" :interaction="interaction" :material="materials[0]" :materialIds="materialIds" :shortRecommendation="getShortRecommendation(interaction.recommendation)" :color="getInteractionColor(interaction)" :link="link" :parent-idx="idx" />
          </template>
        </div>
        <div v-else-if="!!interaction.isMaterialGroup">
          <positive-interaction-preview @add-to-search="addToSearch" :interaction="interaction" :materials="materials" :parent-idx="idx" :isSupp="isSupp" :key="counter" @removeInteraction="removeInteraction" @interactionDone="interactionDone" @setCount="setCount" />
        </div>
        <div
          v-else
          class="interaction-preview-content"
          :class="{
            child: isChild,
            group: true
          }"
        >
          <p class="msg" v-if="interaction.isCompoundGroup === false">There are different interactions, dependent on {{ getSide2Name(interaction.name) }} use:</p>
          <div v-for="(vInteraction, index) in interaction.vInteractions" :key="index">
            <interaction-preview :interaction="vInteraction" :materials="materials" :isCompoundPart="isCompoundPart || interaction.isCompoundGroup" :isDuplicate="interaction.isCompoundGroup === false" :link="link" :idx="index" :parent-idx="idx" is-child />
          </div>
        </div>
      </template>
      <template v-if="headerCmp === 'span'" #de-activator>
        <collapse-toggle-icon />
      </template>
    </collapse>
  </section>
</template>

<script>
import { eventBus, EV_sortby_side_swaped, EV_open_signup } from '@/cms/services/eventBus.service';
import { interactionUIService } from '@/cms/services/interaction-ui.service';
import { interactionService } from '@/cms/services/interaction.service';

import Collapse from '@/client/cmps/common/Collapse';
import Tooltip from '@/client/cmps/common/Tooltip';
import LongTxt from '@/client/cmps/common/LongTxt';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';
import LabelInteractionPreview from '@/client/cmps/search-engine/LabelInteractionPreview';
import PositiveInteractionPreview from '@/client/cmps/search-engine/PositiveInteractionPreview';

import CollapseToggleIcon from '@/client/cmps/common/icons/CollapseToggleIcon';
import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight';
import LockIcon from 'vue-material-design-icons/Lock';

export default {
  name: 'InteractionPreview',
  props: {
    interaction: {
      type: Object,
      required: true
    },
    link: {
      type: Boolean,
      default: false
    },
    isChild: {
      type: Boolean,
      default: false
    },
    isPositive: {
      type: Boolean,
      default: false
    },
    materials: {
      type: Array,
      required: true
    },
    isCompoundPart: {
      type: Boolean,
      default: false
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    idx: {
      type: Number,
      required: true
    },
    parentIdx: {
      type: Number,
      required: false
    },
    exactName: {
      type: String,
      required: false
    },
    isSupp: {
      type: Boolean,
      default: false
    },
    counter: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      pathwayRefCount: 0,
      primarySideInView: null,
      initialCollapseIsVisible: false,
      newLength: null
    };
  },
  computed: {
    isScreenNarrow() {
      return this.$store.getters.isScreenNarrow;
    },
    collapsesState() {
      return this.$store.getters.openCollapses;
    },
    interactionName() {
      if (this.primarySideInView === 1) {
        return this.interaction.name;
      }
      return this.interaction.name.split(' & ').reverse().join(' & ');
    },
    materialIds() {
      return this.materials.reduce((acc, { _id, labels }) => {
        if (!acc.includes(_id)) acc.push(_id);
        labels.forEach(label => {
          if (!acc.includes(label._id)) acc.push(label._id);
        });
        return acc;
      }, []);
    },
    isGroup() {
      return !this.link || !!this.interaction.vInteractions || !!this.interaction.side2Label;
    },
    headerCmp() {
      if (!this.isAllowed) return 'span';
      return this.isGroup ? 'span' : 'router-link';
    },
    interactionURL() {
      const { interaction } = this;
      if (interaction.subject_drug) return `/interaction/drug2drug/${interaction._id}`;
      return interaction.isVirtual ? `/interaction/${interaction._id}/${interaction.side2Material._id}` : `/interaction/${interaction._id}`;
    },
    totalPathwaysRefsCount() {
      return this.$store.getters.getPathwayRefCount;
    },
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
    freeSearchesCount() {
      return this.$store.getters.getFreeSearchesCount;
    },
    managementData() {
      return this.$store.getters.getManagementData;
    },
    isShareTokenValid() {
      return this.$store.getters.getIsSharedToken;
    },
    freeTrialTime() {
      const {
        loggedInUser: { trialTime }
      } = this.$store.getters;
      const timeLeft = trialTime - Date.now();
      const daysLeft = timeLeft / (1000 * 3600 * 24);
      return daysLeft > 0 ? Math.ceil(daysLeft) : 0;
    },
    isAllowed() {
      if (this.isShareTokenValid) return true;
      let idxToShow = this.$route.name === 'Boosters' ? this.managementData?.showPositiveInteractionsNum - 1 : this.managementData?.showInteractionsNum - 1 || 0;
      if (this.loggedInUser && this.loggedInUser.type === 'subscribed') return true;
      if (this.loggedInUser && !this.loggedInUser.email_verified) {
        if (this.idx > idxToShow || this.freeSearchesCount <= 0) return false;
        return true;
      }
      if (this.loggedInUser && this.freeTrialTime <= 0) return false;
      if (!this.loggedInUser && this.freeSearchesCount <= 0) return false;

      if (this.isChild) return true;
      if (!this.loggedInUser && this.idx > idxToShow) return false;
      return true;
    }
  },
  methods: {
    addToSearch(toAdd) {
      eventBus.$emit('add-to-search', toAdd);
      // this.$emit('add-to-search', toAdd);
    },
    isLowLevelInteraction(interaction) {
      if (!interaction.interactionLevel || interaction.interactionLevel === 1) return false;
      return true;
    },
    onOpenSignUp() {
      eventBus.$emit(EV_open_signup);
    },
    onOpenSubscribe() {
      this.$router.push('/subscribe');
    },
    removeInteraction(idx) {
      this.$emit('removeInteraction', idx);
    },
    interactionDone() {
      this.$emit('interactionDone');
    },
    setCount(length) {
      this.$store.commit({ type: 'setPosSuppBoostersCount', data: { name: this.interaction.name, count: length, isSupp: this.isSupp } });
      this.newLength = length;
    },
    negativeMsgName(fullName) {
      const name = fullName.replace(' (0)', '');
      return name;
    },
    restoreCollapses() {
      if (!this.collapsesState[this.$route.name]) return;
      const route = this.isSupp ? this.collapsesState['suppBoosters'] : this.collapsesState[this.$route.name];
      Object.entries(route).forEach(([key, value]) => {
        if (this.parentIdx === undefined && this.idx === +key) {
          this.initialCollapseIsVisible = this.isGroup;
        }
        Object.keys(value).forEach(innerKey => {
          if (this.parentIdx === +key && this.idx === +innerKey) {
            this.initialCollapseIsVisible = this.isGroup;
          }
        });
      });
    },
    onCollapseToggle() {
      const cacheData = {
        key: this.isSupp ? `${this.$route.fullPath}/supps` : this.$route.fullPath,
        idx: this.idx,
        parentIdx: this.parentIdx
      };
      interactionService.cacheSearchState(cacheData);
      // this.EmitScrollElementToTop();
    },
    getSide2Name(name) {
      const side2Name = name.split(' & ')[1].trim();
      if (!this.isCompoundPart && this.$store.getters.materialNamesMap[side2Name]) {
        return this.$store.getters.materialNamesMap[side2Name][0];
      }
      return side2Name;
    },
    getRefsCount(interaction) {
      let refCount;
      if (interaction.refs) {
        if (this.totalPathwaysRefsCount[`${interaction.side1Material?.name || ''}-${interaction.side2Material?.name || ''}`]) {
          refCount = interaction.refs.length + this.totalPathwaysRefsCount[`${interaction.side1Material?.name || ''}-${interaction.side2Material?.name || ''}`];
        } else {
          refCount = interaction.refs.length + this.pathwayRefCount;
        }
      }
      return refCount ? `(${refCount})` : '';
    },
    getRefsCountTxt(interaction) {
      if (interaction.refs) {
        if (this.totalPathwaysRefsCount[`${interaction.side1Material?.name || ''}-${interaction.side2Material?.name || ''}`]) {
          return `${interaction.refs.length + this.totalPathwaysRefsCount[`${interaction.side1Material?.name | ''}-${interaction.side2Material?.name | ''}`]}`;
        }
        return `${interaction.refs.length + this.pathwayRefCount}`;
      }
      return '';
    },
    async getPathwayRefsCount() {
      const { interaction } = this;
      if (!interaction.side2Material) return 0;
      let side2Material = this.materials.find(material => material._id === interaction.side2Material._id);
      if (!side2Material) {
        side2Material = await this.$store.dispatch({
          type: 'loadMaterial',
          matId: interaction.side2Material._id
        });
      }
      const side2Pathways = side2Material?.pathways.reduce((acc, pathway) => {
        if (((pathway.type === 'enzyme' || pathway.type === 'transporter') && (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))) || (pathway.type === 'carrier' && !pathway.actions.includes('inducer') && !pathway.actions.includes('inhibitor'))) {
          acc.push(pathway);
        }

        return acc;
      }, []) || [];
      const seenRefsMap = {};
      const side2Refs = side2Pathways.reduce((acc, pathway) => {
        pathway.references.forEach(ref => {
          if (!seenRefsMap[ref]) {
            acc.push(ref);
            seenRefsMap[ref] = true;
          }
        });
        return acc;
      }, []);
      let side1Material = this.materials.find(material => material._id === interaction.side1Material._id);
      let side1PathwayRefs = [];
      if (!side1Material) {
        side1Material = await this.$store.dispatch({
          type: 'loadMaterial',
          matId: interaction.side1Material._id
        });
      }
      side1PathwayRefs = side1Material.pathways.reduce((acc, pathway) => {
        const idx = side2Pathways.findIndex(side2Pathway => side2Pathway.name?.replace('CYP', '').toUpperCase() === pathway.name?.replace('CYP', '').toUpperCase());
        if (idx !== -1) {
          const refs = interactionUIService.getRefsOrder(pathway.influence);
          refs.forEach(ref => {
            if (!seenRefsMap[ref]) {
              if (!interaction.refs.includes(ref)) {
                acc.push(ref);
              }
              seenRefsMap[ref] = true;
            }
          });
        }
        return acc;
      }, []);
      const refs = interactionUIService.getRefsOrder(side1Material.effectOnDrugMetabolism);
      refs.forEach(ref => {
        if (!seenRefsMap[ref]) {
          if (!interaction.refs.includes(ref)) {
            side1PathwayRefs.push(ref);
          }
          seenRefsMap[ref] = true;
        }
      });
      this.$store.commit({ type: 'setPathwayRefCount', data: { id: `${side1Material?.name || ''}-${side2Material?.name || ''}`, count: side1PathwayRefs.length + side2Refs.length } });
      this.$store.commit({ type: 'updateSupplementsRefsNonDups', refs: side1PathwayRefs });
      this.pathwayRefCount = side1PathwayRefs.length + side2Refs.length;
    },
    getVinteractionsCount(interaction) {
      if (!('vInteractions' in interaction)) return 0;
      let sum = interaction.vInteractions.reduce((acc, vInteraction) => {
        if (!vInteraction.vInteractions) acc++;
        else acc += vInteraction.vInteractions.length;

        return acc;
      }, 0);
      this.$store.commit({ type: 'setPosSuppBoostersCount', data: { name: interaction.name, count: sum } });
      return sum;
    },
    getInteractionLink(interaction) {
      const url = interaction.isVirtual ? `/interaction/${interaction._id}/${interaction.side2Material._id}` : `/interaction/${interaction._id}`;
      return `.
                <a class="interaction-link" href="${url}">
                    Read more...
                </a>
            `;
    },
    getLongEvidenceLevel(evidenceLevel) {
      if (!evidenceLevel) return '';
      switch (evidenceLevel.toString().toUpperCase()) {
        case 'A':
          return 'A - multi clinical or meta analysis';
        case 'B':
          return 'B - 1 clinical or cohort + pre-clinical';
        case 'C':
          return 'C - 1 clinical or cohort';
        case 'D':
          return 'D - case report';
        case 'E':
          return 'E - multi pre-clinical';
        case 'F':
          return 'F - 1 pre-clinical';
        case '1':
          return 'information formally provided in official prescribing documentation';
        case '2':
          return 'based on scientific research';
        default:
          return '';
      }
    },
    getShortRecommendation(fullRec) {
      return interactionUIService.getShortRecommendation(fullRec);
    },
    getInteractionColor({ recommendation, isNegative }) {
      if (!this.isAllowed) return '#a4b8c6';
      if (isNegative) return '#E63946';
      return interactionUIService.getInteractionColor(recommendation);
    },
    getBadgeColor({ recommendation }) {
      if (!this.isAllowed) return 'background-color: #a4b8c6';
      const count = this.newLength || this.getVinteractionsCount(this.interaction);
      if (count === 0) return 'background-color: #a4b8c6';
      const color = interactionUIService.getInteractionColor(recommendation);
      if (color === '#F6D55C') return 'background-color: #F6D55C; color: blue';
      return 'background-color: #55C595';
    },
    swapSideNames(side) {
      this.primarySideInView = side;
    },
    setIsLabelChildEmpty(isEmpty) {
      this.isLabelChildEmpty = !isEmpty;
    },
    EmitScrollElementToTop() {
      eventBus.$emit('scroll-element-to-top', this.interaction._id);
    }
  },
  async created() {
    this.getPathwayRefsCount();
    this.primarySideInView = this.$store.getters.firstInteractionSide;
    eventBus.$on(EV_sortby_side_swaped, this.swapSideNames);
    this.restoreCollapses();
  },
  beforeDestroy() {
    eventBus.$off(EV_sortby_side_swaped, this.swapSideNames);
  },
  components: {
    Collapse,
    InteractionCapsules,
    ChevronUpIcon,
    LongTxt,
    LabelInteractionPreview,
    Tooltip,
    ChevronDownIcon,
    ChevronRightIcon,
    PositiveInteractionPreview,
    CollapseToggleIcon,
    LockIcon
  }
};
</script>

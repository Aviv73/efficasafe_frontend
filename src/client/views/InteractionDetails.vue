<template>
  <section class="interaction-details" :class="{ 'not-allowed-select-txt': isNotAllowedSelect }">
    <header class="interaction-details-header">
      <div class="main-container interaction-details-header-container">
        <span class="brim-start" />
        <div class="flex-space-between">
          <span class="interaction-details-header-link no-print">
            <button class="flex-align-center" @click="$router.go(-1)">
              <template v-if="!isScreenNarrow">
                <chevron-left-icon title="" />
                Back to search
              </template>
              <template v-else>
                <img :src="require('@/client/assets/imgs/back-arrow.svg')" />
              </template>
            </button>
          </span>
          <!-- <router-link to="/" class="interaction-details-header-logo v-tour-interaction-step-4">
                        <img :src="require('@/client/assets/imgs/logo-vector.svg')" alt="Logo" />
                    </router-link> -->
          <h1 class="v-tour-interaction-step-4" v-if="side1Material && side2Material">Interaction of {{ side1Material && side1Material.name }} & {{ side2Material && side2Material.name }}</h1>
          <h1 v-else>Interaction</h1>
          <span class="interaction-details-header-actions">
            <PlayTourBtn class="v-tour-interaction-step-4" :dontOpen="isScreenNarrow" @click.native="startTour" align="right" />

            <button class="print-btn print-btn-icon no-print" title="Print" @click="printWindow()">
              <printer-icon title="" />
            </button>
            <button class="share-btn share-btn-icon no-print" title="Share" @click="isShareModalActive = true">
              <!-- <share-variant-icon title="" :size="isScreenNarrow ? 18 : 24" /> -->
              <share-variant-icon title="" :size="22" />
            </button>
          </span>
        </div>
        <span />
      </div>
    </header>
    <article class="interaction-details-content" v-if="!isLoading && ((!isVirtual && interaction) || (isVirtual && interaction && side2Material))">
      <header class="interaction-details-content-header">
        <div class="main-container" :class="{ narrowHeader: isScreenNarrow }">
          <div class="flex-center p-relative capsules-container">
            <interaction-capsules class="capsules" :name="interactionName" :color="interactionColor" :vInteractionCount="0" :localize="false" :showDraftName="false" :isLink="true" :isInteractionDetails="true" @go-to-material="goToMaterial" @openModal="ev => (this.pageLoc = ev)" on-details-page />
            <template v-if="pageLoc">
              <div v-if="!isScreenNarrow" class="capsule-title" :style="{ top: pageLoc.y + 'px', left: pageLoc.x + 'px', position: 'fixed', 'z-index': 1000 }">
                Press for more info
                <div class="arrow-down"></div>
              </div>
            </template>
            <span class="recommendation-capsule" :class="{ 'txt-dark': interactionColor === '#F6D55C' }" :style="{ 'background-color': interactionColor }" :title="interaction.recommendation">
              <component :is="recommendationIconName" :size="14" />
              <span class="clip-txt">{{ interaction.recommendation }}</span>
            </span>
            <span class="evidence-level">
              Level of evidence {{ interaction.evidenceLevel }}
              <tooltip on="hover" right>
                <template #content>
                  <div class="evidence-level-tooltip-content" v-html="refsDetailsTxt" />
                </template>
                <span class="refs">
                  <span class="refs-count">({{ combinedRefs.length }})</span>
                  <information-outline-icon :size="12" title="" />
                </span>
              </tooltip>
            </span>
          </div>

          <template v-if="isScreenNarrow">
            <div class="mobile-data-show-btns">
              <button @click="toggleMobileLevelOfEvedence">
                {{ interaction.evidenceLevel }}
                <span class="refs-count">({{ combinedRefs.length }})</span>
              </button>
              <button v-if="warnings.length" @click="toggleMobileAlerts">
                <img :src="require('@/client/assets/imgs/alert.svg')" />
              </button>
            </div>
          </template>
        </div>
      </header>
      <main class="interaction-details-details">
        <div class="main-container p-relative mobile-coloumn">
          <h2 class="recommendation-capsule mobile" :class="{ 'txt-dark': interactionColor === '#F6D55C' }" :style="{ 'background-color': interactionColor }">
            <component :is="recommendationIconName" :size="14" />
            {{ interaction.recommendation }}
          </h2>
          <warnings v-if="!isScreenNarrow && side1Material && side2Material" :side1Material="side1Material" :side2Material="side2Material" />
          <div class="note-container flex-center" v-if="!isPrimaryMaterial && interaction.note">
            <span class="note"> <span class="font-bold">Note:</span> {{ interaction.note }} </span>
          </div>
          <div class="mobile-blure" v-if="isScreenNarrow && (showMobileAlerts || showMobileEvedence)" @click="showMobileAlerts = showMobileEvedence = false"></div>

          <div class="mobile-data-modal evidence-level-mobile" v-if="showMobileEvedence && isScreenNarrow">
            <button class="close-btn" @click.stop="toggleMobileLevelOfEvedence">
              <img :src="require('@/client/assets/imgs/close-btn.svg')" />
            </button>
            <div class="modal-content">
              <span class="font-bold">Level of evidence:</span> {{ interaction.evidenceLevel }}
              <div class="sub-txt" v-html="refsDetailsTxt" />
            </div>
          </div>

          <div class="mobile-data-modal alerts-mobile" v-if="showMobileAlerts && isScreenNarrow">
            <button class="close-btn" @click.stop="toggleMobileAlerts">
              <img :src="require('@/client/assets/imgs/close-btn.svg')" />
            </button>
            <div class="modal-content">
              <h3>Alerts</h3>
              <div v-for="warning in warnings" :key="warning.title">
                <h4>
                  {{ warning.title }}
                </h4>
                <p>{{ warning.text }}</p>
              </div>
            </div>
          </div>

          <h3 v-if="interaction.summary" class="subheader regular-pointer">Summary</h3>
          <p
            class="paragraph regular-pointer summary-container"
            v-if="interaction.summary"
            v-html="formatRefs(interaction.summary)"
            v-refs-tooltip="{
              combinedRefs,
              side2Refs
            }"
          />
          <div class="monitor" v-if="interaction.monitor.labTests || interaction.monitor.otherTests || interaction.monitor.symptoms || interaction.monitor.general">
            <h3 class="subheader">What to monitor</h3>
            <div v-if="interaction.monitor.general">
              <span class="font-medium">General: </span>
              {{ interaction.monitor.general | capitalize }}
            </div>
            <div v-if="interaction.monitor.labTests">
              <span class="font-medium">Lab tests: </span>
              {{ interaction.monitor.labTests | capitalize }}
            </div>
            <div v-if="interaction.monitor.otherTests">
              <span class="font-medium">Other tests: </span>
              {{ interaction.monitor.otherTests | capitalize }}
            </div>
            <div v-if="interaction.monitor.symptoms">
              <span class="font-medium">Symptoms: </span>
              {{ interaction.monitor.symptoms | capitalize }}
            </div>
          </div>
          <collapse class="review-of-studies" v-if="interaction.reviewOfStudies" hide-de-activator allow-overflow>
            <template #header>
              <h3 class="subheader flex-align-center">
                Review of studies
                <span class="de-activator">
                  <chevron-up-icon class="opened" title="" />
                  <chevron-down-icon class="closed" title="" />
                </span>
              </h3>
            </template>
            <template #content>
              <p
                class="paragraph regular-pointer"
                v-html="formatRefs(interaction.reviewOfStudies)"
                v-refs-tooltip="{
                  combinedRefs,
                  side2Refs
                }"
              />
            </template>
          </collapse>
          <collapse class="pharmacokinetics" hide-de-activator allow-overflow>
            <template #header>
              <h3 class="subheader flex-align-center">
                Pharmacokinetics
                <span class="de-activator">
                  <chevron-up-icon class="opened" title="" />
                  <chevron-down-icon class="closed" title="" />
                </span>
                <span class="badge badge-red" v-if="releventSide1PathwaysByColors.red">
                  {{ releventSide1PathwaysByColors.red }}
                </span>
                <span class="badge badge-yellow" v-if="releventSide1PathwaysByColors.yellow">
                  {{ releventSide1PathwaysByColors.yellow }}
                </span>
                <span class="badge badge-green" v-if="releventSide1PathwaysByColors.green">
                  {{ releventSide1PathwaysByColors.green }}
                </span>
              </h3>
            </template>
            <template #content>
              <collapse hide-de-activator allow-overflow>
                <template #header>
                  <h3 class="subheader2 flex-align-center">
                    <span class="de-activator">
                      <chevron-up-icon class="opened" title="" />
                      <chevron-down-icon class="closed" title="" />
                    </span>
                    Drug metabolism
                  </h3>
                </template>
                <template #content>
                  <side2-pathways v-if="relevantSide2Pathways.length" :side2Pathways="relevantSide2Pathways" :combinedRefs="combinedRefs" :side2Refs="side2Refs" :materialName="interactionName.split(' & ')[1]" />
                  <p v-else class="side2-pathways">There is no data on {{ side2Material.name }} metabolism</p>
                </template>
              </collapse>
              <collapse hide-de-activator allow-overflow>
                <template #header>
                  <h3 class="subheader2 flex-align-center">
                    <span class="de-activator">
                      <chevron-up-icon class="opened" title="" />
                      <chevron-down-icon class="closed" title="" />
                    </span>
                    {{ interaction.side1Material.name }} effect on drug metabolism
                  </h3>
                </template>
                <template #content>
                  <side1-pathways :pathways="relevantSide1Pathways" :summary="effectOnDrugMetabolism" :materialName="interaction.side1Material.name" :unrelevantPathways="unRelevantSide2Pathways" :formatRefs="formatRefs" :combinedRefs="combinedRefs" :side2Refs="side2Refs" />
                </template>
              </collapse>
            </template>
          </collapse>
        </div>
      </main>
      <footer class="interaction-details-refs">
        <div class="main-container">
          <h3 class="subheader">References</h3>
          <reference-list :refs="combinedRefs" />
        </div>
      </footer>
    </article>
    <error-404 v-else-if="!isLoading && ((!isVirtual && !interaction) || (isVirtual && (!interaction || !side2Material)))" />
    <loader class="loader" v-else-if="isLoading" />
    <modal-wrap :isActive="isShareModalActive" @close-modal="isShareModalActive = false">
      <share-modal @close-modal="isShareModalActive = false" />
    </modal-wrap>
    <onboarding-tour />
  </section>
</template>

<script>
import { interactionUIService } from '@/cms/services/interaction-ui.service';
// import { utilService } from '@/cms/services/util.service';
import { storageService } from '@/cms/services/storage.service';
import { eventBus } from '@/cms/services/eventBus.service';

import Side2Pathways from '@/client/cmps/interaction-details/Side2Pathways';
import Side1Pathways from '@/client/cmps/interaction-details/Side1Pathways';
import ReferenceList from '@/client/cmps/interaction-details/ReferenceList';
import Warnings from '@/client/cmps/interaction-details/Warnings';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';
import Tooltip from '@/client/cmps/common/Tooltip';
import Collapse from '@/client/cmps/common/Collapse';
import ModalWrap from '@/client/cmps/common/ModalWrap';
import Error404 from '@/client/cmps/shared/Error404';
import ShareModal from '@/client/cmps/shared/modals/ShareModal';
import OnboardingTour from '@/client/cmps/search-engine/OnboardingTour';

import Loader from '@/client/cmps/common/icons/Loader';
import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft';
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';
import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';
import PrinterIcon from 'vue-material-design-icons/Printer';
import ShareVariantIcon from 'vue-material-design-icons/ShareVariant';

import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline';

import PlayTourBtn from '@/client/cmps/common/PlayTourBtn';

export default {
  side1Refs: [],
  data() {
    return {
      pageLoc: null,
      interaction: null,
      side2Material: null,
      side1Material: null,
      side1Pathways: [],
      interactionRefs: [],
      isLoading: false,
      effectOnDrugMetabolism: '',
      isShareModalActive: false,
      showParmaSide2: false,

      showMobileAlerts: false,
      showMobileEvedence: false
    };
  },
  metaInfo() {
    return {
      title: this.pageTitle
    };
  },
  watch: {
    '$route.params': {
      async handler() {
        await this.getInteractionData();
        this.sortInteractionRefs();
      },
      immediate: true
    }
  },
  computed: {
    warnings() {
      if (!this.side1Material || !this.side2Material) return [];

      return interactionUIService.createWarnings(this.side1Material, this.side2Material);
    },
    pageTitle() {
      if (!this.interaction) {
        return '';
      }

      let title = 'Interaction of ';
      if (this.interaction.side2Material) {
        title += `${this.interaction.side1Material.name} and ${this.interaction.side2Material.name}`;
      } else {
        title += `${this.interaction.side1Material.name} and ${this.interaction.side2DraftName}`;
      }
      return title;
    },
    combinedRefs() {
      return this.interactionRefs.concat(this.relevantSide2Refs, this.side1PathwayRefs);
    },
    refsDetailsTxt() {
      const { getRefsCountByType, interactionRefs } = this;
      const side2Refs = this.relevantSide2Refs.concat(this.side1PathwayRefs);

      const metaCount1 = getRefsCountByType(interactionRefs, 'meta');
      const systematicCount1 = getRefsCountByType(interactionRefs, 'systematic');
      const clinicalCount1 = getRefsCountByType(interactionRefs, 'clinical');
      const caseCount1 = getRefsCountByType(interactionRefs, 'case');
      const preclinicalCount1 = getRefsCountByType(interactionRefs, 'pre-clinical');
      const articlesCount1 = getRefsCountByType(interactionRefs, 'articles');

      const metaCount2 = getRefsCountByType(side2Refs, 'meta');
      const systematicCount2 = getRefsCountByType(side2Refs, 'systematic');
      const clinicalCount2 = getRefsCountByType(side2Refs, 'clinical');
      const caseCount2 = getRefsCountByType(side2Refs, 'case');
      const preclinicalCount2 = getRefsCountByType(side2Refs, 'pre-clinical');
      const articlesCount2 = getRefsCountByType(side2Refs, 'articles');

      let txt = `<span class="font-medium">The interaction is based on:</span>`;
      if (metaCount1)
        txt += `
                &bull; ${metaCount1} meta ${metaCount1 > 1 ? 'analyses' : 'analysis'}`;
      if (systematicCount1)
        txt += `
                &bull; ${systematicCount1} systematic review${systematicCount1 > 1 ? 's' : ''}`;
      if (clinicalCount1)
        txt += `
                &bull; ${clinicalCount1} clinical stud${clinicalCount1 > 1 ? 'ies' : 'y'}`;
      if (caseCount1)
        txt += `
                &bull; ${caseCount1} case stud${caseCount1 > 1 ? 'ies' : 'y'}`;
      if (preclinicalCount1)
        txt += `
                &bull; ${preclinicalCount1} pre-clinical stud${preclinicalCount1 > 1 ? 'ies' : 'y'}`;
      if (articlesCount1)
        txt += `
                &bull; ${articlesCount1} article${articlesCount1 > 1 ? 's' : ''}`;

      if (clinicalCount2 || preclinicalCount2 || articlesCount2 || caseCount2 || metaCount2 || systematicCount2) {
        txt += `
                    <span class="font-medium">The pharmacokinetic section is based on:</span>`;

        if (metaCount2)
          txt += `
                    &bull; ${metaCount2} meta analysis${metaCount2 > 1 ? 'es' : ''}`;
        if (systematicCount2)
          txt += `
                    &bull; ${systematicCount2} systematic review${systematicCount2 > 1 ? 's' : ''}`;
        if (clinicalCount2)
          txt += `
                    &bull; ${clinicalCount2} clinical stud${clinicalCount2 > 1 ? 'ies' : 'y'}`;
        if (caseCount2)
          txt += `
                    &bull; ${caseCount2} case stud${caseCount2 > 1 ? 'ies' : 'y'}`;
        if (preclinicalCount2)
          txt += `
                    &bull; ${preclinicalCount2} pre-clinical stud${preclinicalCount2 > 1 ? 'ies' : 'y'}`;
        if (articlesCount2)
          txt += `
                    &bull; ${articlesCount2} article${articlesCount2 > 1 ? 's' : ''}`;
      }

      return txt;
    },
    relevantSide2Refs() {
      let nextDraftIdx = 1;
      return this.relevantSide2Pathways.reduce((acc, pathway) => {
        pathway.references.forEach((pubmedId, idx) => {
          const isValidUrl = typeof pubmedId === 'string' && pubmedId.startsWith('http');
          const ref = {
            draftIdx: nextDraftIdx++,
            type: '',
            txt: pathway.fullReferences[idx],
            link: isValidUrl ? pubmedId : `https://pubmed.ncbi.nlm.nih.gov/${pubmedId}`,
            pubmedId: isValidUrl ? 0 : pubmedId
          };
          const isUnique = acc.findIndex(currRef => currRef.link === ref.link) === -1;
          if (isUnique) acc.push(ref);
        });
        return acc;
      }, []);
    },
    side2Refs() {
      return this.side2Material.pathwayRefs.filter((ref, idx, refs) => {
        return refs.findIndex(currRef => currRef.link === ref.link) === idx;
      });
    },
    isVirtual() {
      return !!this.$route.params.matId;
    },
    interactionColor() {
      return interactionUIService.getInteractionColor(this.interaction.recommendation);
    },
    interactionName() {
      if (this.isVirtual) return `${this.interaction.side1Material.name} & ${this.side2Material.name}`;
      return `${this.interaction.side1Material.name} & ${this.interaction.side2Material.name}`;
    },
    side1PathwayRefs() {
      const txt =
        this.effectOnDrugMetabolism +
        ' ' +
        this.relevantSide1Pathways.reduce((acc, pathway) => {
          acc += pathway.influence + ' ';
          return acc;
        }, '');
      const sortedRefs = interactionUIService.getSortedRefs(txt, this.$options.side1Refs);
      return sortedRefs.filter(ref => this.interactionRefs.findIndex(currRef => currRef.link === ref.link) === -1);
    },
    relevantSide2Pathways() {
      return this.side2Material.pathways.filter(
        pathway =>
          (pathway.type === 'enzyme' && (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))) ||
          (pathway.type === 'transporter' && (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))) ||
          (pathway.type === 'carrier' && !pathway.actions.includes('inducer') && !pathway.actions.includes('inhibitor'))
      );
    },
    relevantSide1Pathways() {
      return this.side1Pathways.filter(pathway => {
        const idx = this.relevantSide2Pathways.findIndex(side2Pathway => side2Pathway.name?.replace('CYP', '').toUpperCase() === pathway.name?.replace('CYP', '').toUpperCase());
        return idx !== -1 && !pathway.actions.length;
      });
    },
    releventSide1PathwaysByColors() {
      let map = { red: 0, yellow: 0, green: 0 };
      this.relevantSide1Pathways.forEach(({ influence }) => {
        let firstLine = influence.split('</p>')[0];
        if (!firstLine) return;
        firstLine = firstLine.toLowerCase();

        if (firstLine.includes('may induce') || firstLine.includes('may inhibit') || firstLine.includes('may bind')) {
          map.red++;
        } else if (firstLine.includes('is unclear')) {
          map.yellow++;
        } else if (firstLine.includes('not likely to affect')) {
          map.green++;
        }
      });
      return map;
    },
    unRelevantSide2Pathways() {
      return this.relevantSide2Pathways.filter(pathway => {
        const idx = this.side1Pathways.findIndex(side1Pathway => side1Pathway.name?.replace('CYP', '').toUpperCase() === pathway.name?.replace('CYP', '').toUpperCase());
        return idx === -1;
      });
    },
    isPrimaryMaterial() {
      const { interaction } = this;
      return interaction.side2Label && interaction.side2Label.primaryMaterialIds.includes(this.side2Material._id);
    },
    recommendationIconName() {
      switch (this.interactionColor) {
        case '#E63946':
          return 'cancel-icon';
        case '#F6D55C':
          return 'alert-circle-outline-icon';
        case '#56C596':
          return 'check-icon';
        default:
          return 'circle-outline';
      }
    },
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
    isScreenNarrow() {
      return this.$store.getters.isScreenNarrow;
    },
    isNotAllowedSelect() {
      if (!this.$store.getters.loggedInUser) return true;
      return !this.$store.getters.loggedInUser.isAllowedToSelectTxt;
    }
  },
  methods: {
    startTour() {
      this.$tours['onboarding-interaction-tour'].start();
      // this.$tours['boosters-tour'].start();
    },
    toggleMobileLevelOfEvedence() {
      this.showMobileEvedence = !this.showMobileEvedence;
    },
    toggleMobileAlerts() {
      this.showMobileAlerts = !this.showMobileAlerts;
    },

    async goToMaterial(name) {
      let material;
      if (name === this.interaction.side1Material.name || this.checkIsPartOfSide1(name)) material = this.side1Material;
      else if (this.interaction.side2Material) material = this.side2Material;
      else material = this.side2Material;

      if (material.isUnderStudy) return;
      // :to="{ path: `/material/${material._id}`, query: { q: userQuery } }"

      let routeData = this.$router.resolve({ path: `/material/${material._id}`, query: { q: name } });
      window.open(routeData.href, '_blank');
    },
    checkIsPartOfSide1(name) {
      const material = this.side1Material;
      if (material.aliases.includes(name) || material.brands.includes(name) || material.dBankAliases.includes(name)) {
        return true;
      }
      return false;
    },
    printWindow() {
      window.print();
    },
    async getInteractionData() {
      this.isLoading = true;
      const { id, matId } = this.$route.params;
      if (!this.isVirtual) {
        const interaction = await this.$store.dispatch({ type: 'loadInteraction', id });
        if (!interaction) {
          this.isLoading = false;
          return;
        }
        const [side2Material, side1Material] = await Promise.all([this.$store.dispatch({ type: 'loadMaterial', matId: interaction.side2Material._id }), this.$store.dispatch({ type: 'loadMaterial', matId: interaction.side1Material._id })]);
        this.side1Material = side1Material;
        this.side2Material = side2Material;
        this.interaction = interaction;
        this.side1Pathways = side1Material.pathways;
        this.$options.side1Refs = side1Material.refs;
        this.effectOnDrugMetabolism = side1Material.effectOnDrugMetabolism;
        this.interactionRefs = side1Material.refs.filter(ref => this.interaction.refs.includes(ref.draftIdx));
      } else {
        const [interaction, material] = await Promise.all([this.$store.dispatch({ type: 'loadInteraction', id }), this.$store.dispatch({ type: 'loadMaterial', matId })]);
        if (!interaction || !material) {
          this.isLoading = false;
          return;
        }
        const side1Material = await this.$store.dispatch({
          type: 'loadMaterial',
          matId: interaction.side1Material._id
        });
        this.interaction = interaction;
        this.side2Material = material;
        this.side1Material = side1Material;
        this.side1Pathways = side1Material.pathways;
        this.$options.side1Refs = side1Material.refs;
        this.effectOnDrugMetabolism = side1Material.effectOnDrugMetabolism;
        this.interactionRefs = side1Material.refs.filter(ref => this.interaction.refs.includes(ref.draftIdx));
      }
      this.isLoading = false;
      if (!storageService.load('did-onboarding-interaction-tour1') && !this.isScreenNarrow) {
        setTimeout(() => {
          if ((this.$route.name === 'InteractionDetails' || this.$route.name === 'VinteractionDetails') && !storageService.load('did-onboarding-interaction-tour1') && !this.isScreenNarrow) {
            this.$tours['onboarding-interaction-tour'].start();
          }
        }, 40000);
      }
    },
    sortInteractionRefs() {
      if (!this.interaction) return;
      const txt = `${this.interaction.summary} ${this.interaction.reviewOfStudies}`;
      const sortedRefs = interactionUIService.getSortedRefs(txt, this.interactionRefs);
      this.interactionRefs = sortedRefs;
      this.showParmaSide2 = true;
    },
    getRefsCountByType(refs, type) {
      let iterateFunc = null;
      switch (type) {
        case 'clinical':
          iterateFunc = ref => ref.type === 'clinical' || ref.type === 'retrospective';
          break;
        case 'pre-clinical':
          iterateFunc = ref => ref.type === 'in vitro' || ref.type === 'animal';
          break;
        case 'systematic':
          iterateFunc = ref => ref.type === 'systematic';
          break;
        case 'meta':
          iterateFunc = ref => ref.type === 'meta';
          break;
        case 'case':
          iterateFunc = ref => ref.type === 'case';
          break;
        case 'articles':
          iterateFunc = ref => ref.type === 'review' || ref.type === 'drug label' || ref.type === 'book' || ref.type === 'Book' || !ref.type;
          break;
      }

      return refs.filter(iterateFunc).length;
    },
    formatRefs(txt, isPathwaysRefs = false) {
      const openTag = '<sub>(';
      const closeTag = ')</sub>';

      if (!isPathwaysRefs && !this.interactionRefs.length) return txt;

      const parts = txt.split(openTag);
      const fixedTxt = parts
        .map(part => {
          if (!part.includes(closeTag)) return part;

          const [numsBetweenTxt, info] = part.split(closeTag);

          const numsBetween = numsBetweenTxt.split(',').filter(Boolean);
          const fixedNumsBetween = numsBetween.reduce((acc, c) => {
            const fixedCurr = c
              .split('-')
              .filter(Boolean)
              .map(draftIdxStr => {
                const draftIdx = +draftIdxStr;
                return this.combinedRefs.findIndex(ref => ref && ref.draftIdx === draftIdx) + 1;
              })
              .join('-');
            return [...acc, fixedCurr];
          }, []);
          const fixedStr = fixedNumsBetween.join(',');

          return fixedStr + closeTag + info;
        })
        .join(openTag);

      return fixedTxt;
    }
  },
  created() {
    this.$store.dispatch('notifyEndTrial');
    // eventBus.$on('start-interaction-tour', () => {
    //   this.$tours['onboarding-interaction-tour'].start();
    // });
  },
  beforeDestroy() {
    eventBus.$off('start-interaction-tour');
  },
  components: {
    ChevronLeftIcon,
    PrinterIcon,
    ShareVariantIcon,
    InteractionCapsules,
    InformationOutlineIcon,
    Tooltip,
    Collapse,
    OnboardingTour,
    ChevronDownIcon,
    ChevronUpIcon,
    Side2Pathways,
    Side1Pathways,
    ReferenceList,
    Warnings,
    Error404,
    Loader,
    ModalWrap,
    ShareModal,
    CancelIcon: () => import('vue-material-design-icons/Cancel'),
    AlertCircleOutlineIcon: () => import('vue-material-design-icons/AlertCircleOutline'),
    CheckIcon: () => import('vue-material-design-icons/Check'),
    CircleOutlineIcon: () => import('vue-material-design-icons/CircleOutline'),
    PlayTourBtn
  }
};
</script>

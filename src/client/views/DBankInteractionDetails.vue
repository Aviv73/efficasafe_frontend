<template>
  <section class="interaction-details" :class="{ 'not-allowed-select-txt': isNotAllowedSelect }">
    <header class="interaction-details-header">
      <div class="main-container interaction-details-header-container">
        <span class="brim-start" />
        <div class="flex-space-between">
          <span class="interaction-details-header-link no-print">
            <button class="flex-align-center" @click="goBack()">
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
            <!-- <PlayTourBtn class="v-tour-interaction-step-4" :dontOpen="isScreenNarrow" @click.native="startTour" align="right" /> -->

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
      <!-- <h1 class="invisible-header" v-if="interaction">Interaction between {{ interaction.subject_drug.name }} and {{ interaction.affected_drug.name }}</h1>
      <div class="interaction-details-header-container">
        <span class="brim-start" />
        <div class="flex-space-between">
          <span class="interaction-details-header-link no-print">
            <button class="flex-align-center" @click="$router.go(-1)"><chevron-left-icon title="" /><span v-if="!isScreenNarrow">Back to search</span></button>
          </span>
          <h1>{{ pageTitle }}</h1>
          <span class="interaction-details-header-actions">
            <button class="print-btn print-btn-icon no-print" title="Print" :disabled="!loggedInUser" @click="printWindow()">
              <printer-icon title="" />
            </button>
            <button class="share-btn share-btn-icon no-print" title="Share" :disabled="!loggedInUser" @click="isShareModalActive = true">
              <share-variant-icon title="" :size="22" />
            </button>
          </span>
        </div>
        <span />
      </div> -->
    </header>
    <article class="interaction-details-content" v-if="!isLoading && interaction">
      <header class="interaction-details-content-header">
        <!-- <div class="main-container">
          <div class="flex-center p-relative">
            <interaction-capsules class="capsules" :name="interactionName" :color="interactionColor" :vInteractionCount="0" :localize="false" :showDraftName="false" :isLink="true" :isInteractionDetails="true" @go-to-material="goToMaterial" @openModal="ev => (this.pageLoc = ev)" on-details-page />
            <template v-if="pageLoc">
              <div v-if="!isScreenNarrow" class="capsule-title" :style="{ top: pageLoc.offset + 5 + 'px', left: pageLoc.pageX - 20 + 'px' }">
                Press for more info
                <div class="arrow-down"></div>
              </div>
            </template>

            <span class="recommendation-capsule" :class="{ 'txt-dark': interactionColor === '#F6D55C' }" :style="{ 'background-color': interactionColor }" :title="interaction.recommendation">
              <component :is="recommendationIconName" :size="14" />
              <span class="clip-txt">{{ interaction.recommendation }}</span>
            </span>
            <span class="evidence-level">
              {{ interaction.evidence_level }}
              <tooltip on="hover" right-top>
                <template #content>
                  <div class="evidence-level-tooltip-content">
                    <p class="d-flex" v-if="interaction.evidence_level === 1">1- Information formally provided in official prescribing documentation</p>
                    <p class="d-flex" v-else-if="interaction.evidence_level === 2">2- Based on scientific research</p>
                  </div>
                </template>
                <span class="refs">
                  <span class="refs-count">({{ interactionRefs.length }})</span>
                  <information-outline-icon :size="12" title="" />
                </span>
              </tooltip>
            </span>
          </div>
        </div> -->
        <div class="main-container" :class="{ narrowHeader: isScreenNarrow }">
          <div class="flex-center p-relative capsules-container">
            <interaction-capsules class="capsules" :name="interactionName" :color="interactionColor" :vInteractionCount="0" :localize="false" :showDraftName="false" :isLink="true" :isInteractionDetails="true" @go-to-material="goToMaterial" @openModal="ev => (this.pageLoc = ev)" on-details-page />
            <template v-if="pageLoc">
              <div v-if="!isScreenNarrow" class="capsule-title" :style="{ top: pageLoc.y + 'px', left: pageLoc.x + 'px', transform: 'translateX(-50%)', position: 'fixed', 'z-index': 1000 }">
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
                  <div class="evidence-level-tooltip-content">
                    <p class="d-flex" v-if="interaction.evidence_level === 1">1- Information formally provided in official prescribing documentation</p>
                    <p class="d-flex" v-else-if="interaction.evidence_level === 2">2- Based on scientific research</p>
                  </div>
                </template>
                <span class="refs">
                  <span class="refs-count">({{ interactionRefs.length }})</span>
                  <information-outline-icon :size="12" title="" />
                </span>
              </tooltip>
            </span>
          </div>

          <template v-if="isScreenNarrow">
            <div class="mobile-data-show-btns">
              <button @click="toggleMobileLevelOfEvedence">
                {{ interaction.evidence_level }}
                <span class="refs-count">({{ interactionRefs.length }})</span>
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
          <span class="recommendation-capsule mobile drugbank" :class="{ 'txt-dark': interactionColor === '#F6D55C' }" :style="{ 'background-color': interactionColor }">
            <component :is="recommendationIconName" :size="14" />
            {{ interaction.recommendation }}
          </span>
          <div class="mobile-blure" v-if="isScreenNarrow && (showMobileAlerts || showMobileEvedence)" @click="showMobileAlerts = showMobileEvedence = false"></div>

          <div class="mobile-data-modal evidence-level-mobile" v-if="showMobileEvedence && isScreenNarrow">
            <button class="close-btn" @click.stop="toggleMobileLevelOfEvedence">
              <img :src="require('@/client/assets/imgs/close-btn.svg')" />
            </button>
            <div class="modal-content">
              <span class="font-bold">Level of evidence:</span> {{ interaction.evidenceLevel }}
              <div class="evidence-level-tooltip-content">
                <p class="d-flex" v-if="interaction.evidence_level === 1">1- Information formally provided in official prescribing documentation</p>
                <p class="d-flex" v-else-if="interaction.evidence_level === 2">2- Based on scientific research</p>
              </div>
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
          <!-- <figure class="drugbank-logo">
                        <img :src="require(`@/cms/assets/drugbank.png`)" alt="DrugBank logo" />
                        <figcaption class="caption">powered by</figcaption>
                    </figure> -->
          <!-- <div class="evidence-level-mobile"><span class="font-bold">Level of evidence:</span> {{ interaction.evidence_level }} - {{ levelOfEvidenceTxt }}</div> -->
          <h2 v-if="interaction.summary" class="subheader">Summary</h2>
          <warnings v-if="!isScreenNarrow && side1Material && side2Material" :side1Material="side1Material" :side2Material="side2Material" :isDb="true" />

          <p class="paragraph" v-if="interaction.summary" v-text="interaction.summary" />
          <h2 v-if="interaction.severity" class="subheader">Severity</h2>
          <p class="paragraph" v-if="interaction.severity" v-text="interaction.severity" />
          <h2 v-if="interaction.extended_description" class="subheader">Extended description</h2>
          <p
            class="paragraph"
            v-if="interaction.extended_description"
            v-html="getRefsToDisplay(interaction.extended_description)"
            v-refs-tooltip.dBank="{
              interactionRefs
            }"
          />
          <h2 v-if="interaction.management" class="subheader">Management</h2>
          <p
            class="paragraph"
            v-if="interaction.management"
            v-html="getRefsToDisplay(interaction.management)"
            v-refs-tooltip.dBank="{
              interactionRefs
            }"
          />
        </div>
      </main>
      <div class="drugbank-container main-container">
        <figure class="drugbank-logo">
          <figcaption class="caption">powered by</figcaption>
          <img :src="require(`@/cms/assets/drugbank.png`)" alt="DrugBank logo" />
        </figure>
      </div>
      <footer class="interaction-details-refs">
        <div class="main-container">
          <h2 class="subheader">References</h2>
          <reference-list :refs="interactionRefs" d-bank-refs />
        </div>
      </footer>
    </article>
    <error-404 v-else-if="!isLoading && !interaction" />
    <loader class="loader" v-else-if="isLoading" />
    <modal-wrap :isActive="isShareModalActive" @close-modal="isShareModalActive = false">
      <share-modal @close-modal="isShareModalActive = false" />
    </modal-wrap>
  </section>
</template>

<script>
import { drugBankService } from '@/cms/services/drug-bank.service';
import { materialService } from '@/cms/services/material.service';
import { interactionUIService } from '@/cms/services/interaction-ui.service';

import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';
import Tooltip from '@/client/cmps/common/Tooltip';
import Warnings from '@/client/cmps/interaction-details/Warnings';
import ReferenceList from '@/client/cmps/interaction-details/ReferenceList';
import Error404 from '@/client/cmps/shared/Error404';
import ModalWrap from '@/client/cmps/common/ModalWrap';
import ShareModal from '@/client/cmps/shared/modals/ShareModal';

import Loader from '@/client/cmps/common/icons/Loader';
import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft';
import PrinterIcon from 'vue-material-design-icons/Printer';
import ShareVariantIcon from 'vue-material-design-icons/ShareVariant';
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline';

export default {
  wrongRefsMap: drugBankService.getWrongRefsMap(),
  data() {
    return {
      showMobileEvedence: false,
      showMobileAlerts: false,

      pageLoc: null,
      interaction: null,
      isLoading: false,
      isShareModalActive: false,
      linkInfos: false,
      side1Material: false,
      side2Material: false
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
        this.isLoading = true;
        await this.getInteraction();
        await this.getLinks();
        this.isLoading = false;
      },
      immediate: true
    }
  },
  computed: {
    relevantSide2Pathways() {
      const res = this.side2Material.pathways.filter(pathway => {
        return (
          (pathway.type === 'enzyme' && (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))) ||
          (pathway.type === 'transporter' && (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))) ||
          (pathway.type === 'carrier' && !pathway.actions.includes('inducer') && !pathway.actions.includes('inhibitor'))
        );
      });
      return res;
    },
    relevantSide2Refs() {
      let nextDraftIdx = 1;
      const res = this.relevantSide2Pathways.reduce((acc, pathway) => {
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
      return res;
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
    warnings() {
      if (!this.side1Material || !this.side2Material) return [];

      return interactionUIService.createWarnings(this.side1Material, this.side2Material);
    },
    pageTitle() {
      if (this.interaction) {
        return `Interaction of ${this.interaction.subject_drug.name} and ${this.interaction.affected_drug.name}`;
      }

      return '';
    },
    interactionName() {
      return `${this.interaction.subject_drug.name} & ${this.interaction.affected_drug.name}`;
    },
    interactionColor() {
      return interactionUIService.getInteractionColor(this.interaction.recommendation);
    },
    searchedMaterials() {
      return this.$store.getters.materials;
    },
    interactionRefs() {
      let refIdx = 1;
      return Object.keys(this.interaction.references).reduce((acc, key) => {
        const moreRefs = this.interaction.references[key].map(({ ref_id, pubmed_id, citation, title, url }) => {
          return {
            ref_id,
            pubmed_id: pubmed_id || '',
            citation: citation || '',
            title: title || '',
            url: url || '',
            draftIdx: refIdx++
          };
        });
        acc = acc.concat(moreRefs);
        return acc;
      }, []);
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
    isNotAllowedSelect() {
      if (!this.$store.getters.loggedInUser) return true;
      return !this.$store.getters.loggedInUser.isAllowedToSelectTxt;
    },
    levelOfEvidenceTxt() {
      if (this.interaction.evidence_level === 1) return 'Information formally provided in official prescribing documentation';
      return 'Based on scientific research';
    },
    isScreenNarrow() {
      return this.$store.getters.isScreenNarrow;
    }
  },
  methods: {
    goBack() {
      if (this.$store.getters.routerHistory.length <= 1) this.$router.push('/');
      else this.$router.go(-1);
    },
    goToMaterial(name) {
      const linkInfo = this.linkInfos.find(i => i.name === name);
      let routeData = this.$router.resolve({ path: `/material/${linkInfo.id}` });
      window.open(routeData.href, '_blank');
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
    toggleMobileAlerts() {
      this.showMobileAlerts = !this.showMobileAlerts;
    },
    toggleMobileLevelOfEvedence() {
      this.showMobileEvedence = !this.showMobileEvedence;
    },
    printWindow() {
      window.print();
    },
    async getInteraction() {
      const { id } = this.$route.params;
      if (!id) return;
      this.interaction = await drugBankService.getInteraction(id);
      if (!this.interaction?.affected_drug) return;
      const [side1Material, side2Material] = await Promise.all([materialService.getByDBId(this.interaction.affected_drug.drugbank_id), materialService.getByDBId(this.interaction.subject_drug.drugbank_id)]);
      this.side1Material = side1Material;
      this.side2Material = side2Material;
    },
    async getLinks() {
      const criteria = {
        isSearchResults: true,
        q: [this.interaction.affected_drug.name, this.interaction.subject_drug.name]
      };
      const materials = await this.$store.dispatch({ type: 'getMaterials', criteria });
      this.linkInfos = materials.map(m => {
        if (this.searchedMaterials) {
          const originalMaterial = this.searchedMaterials.find(mat => mat.name === m.userQuery);
          if (originalMaterial) return { name: originalMaterial.userQuery, id: originalMaterial._id };
        }
        return { name: m.userQuery, id: m._id };
      });
    },
    getRefsToDisplay(txt) {
      // const regex = /\[[a-zA-Z][0-9]*]/g; // for matching [A12345]
      const regex = /\[(.*?)\]/g;
      const matches = txt.match(regex);
      if (!matches) return txt;
      matches.forEach(match => {
        let formatedMatch = this.replaceWrongRefs(match);
        this.interactionRefs.forEach(({ ref_id, draftIdx }) => {
          if (formatedMatch.includes(ref_id)) {
            formatedMatch = formatedMatch.replace(ref_id, draftIdx);
          } else {
            const refId = ref_id.replace(/\D/g, '');
            formatedMatch = formatedMatch.replace(refId, draftIdx);
          }
        });
        formatedMatch = formatedMatch.replace('[', '(');
        formatedMatch = formatedMatch.replace(']', ')');
        formatedMatch = `<sub>${interactionUIService.formatRefStrs(formatedMatch)}</sub>`;

        const beforeIdx = txt.indexOf(match) - 1;
        if (txt.charAt(beforeIdx) === '.') {
          txt = txt.substring(0, beforeIdx) + txt.substring(beforeIdx + 1);
          formatedMatch = ` ${formatedMatch}.`;
        }

        txt = txt.replace(match, formatedMatch);
      });
      return txt;
    },
    replaceWrongRefs(refStr) {
      const { wrongRefsMap } = this.$options;
      Object.keys(wrongRefsMap).forEach(wrongRef => {
        if (refStr.includes(wrongRef)) {
          refStr = refStr.replaceAll(wrongRef, wrongRefsMap[wrongRef]);
        }
      });
      return refStr;
    }
  },
  components: {
    ChevronLeftIcon,
    PrinterIcon,
    ShareVariantIcon,
    InteractionCapsules,
    InformationOutlineIcon,
    Tooltip,
    Warnings,
    ReferenceList,
    Error404,
    Loader,
    ModalWrap,
    ShareModal,
    CancelIcon: () => import('vue-material-design-icons/Cancel'),
    AlertCircleOutlineIcon: () => import('vue-material-design-icons/AlertCircleOutline'),
    CheckIcon: () => import('vue-material-design-icons/Check'),
    CircleOutlineIcon: () => import('vue-material-design-icons/CircleOutline')
  }
};
</script>

<template>
  <section style="width: 100%">
    <aside v-if="material" class="material-details-nav" :class="{ show: showNav }">
      <button class="drawer-btn" @click="showNav = false" v-if="isScreenNarrow"><arrow-left-icon /></button>
      <!-- <router-link to="/" class="material-details-nav-logo">
        <img :src="require('@/client/assets/imgs/flat-logo.png')" alt="Logo" />
      </router-link> -->

      <div class="material-details-nav-header">
        <img :src="require(`@/client/assets/icons/types/${getTypeImgName(material.type)}.svg`)" alt="" />
        <h3 @click="goTo('Title')">{{ material.name }}</h3>
      </div>
      <hr />
      <section class="material-details-nav-links">
        <a v-if="material.dBankDesc" @click="goTo('Background')">Background</a>
        <a @click="goTo('Interactions')">Interactions</a>
        <a v-if="material.dBankIndications && material.dBankIndications.length" @click="goTo('Medicinal uses')">Medicinal uses</a>
        <a v-if="material.pharmacology.indication" @click="goTo('Pharmacology')">Pharmacology</a>
        <a v-if="material.pharmacology.pharmacodynamics" @click="goTo('Pharmacodynamics')">Pharmacodynamics</a>
        <a v-if="material.pharmacology.absorption" @click="goTo('Absorption')">Absorption</a>
        <a v-if="material.pharmacology.mechanismOfAction" @click="goTo('Mechanism of action')">Mechanism of action</a>
        <a v-if="material.pharmacology.proteinBinding" @click="goTo('Protein binding')">Protein binding</a>
        <a v-if="material.pharmacology.metabolism" @click="goTo('Metabolism')">Metabolism</a>
        <a v-if="material.pharmacology.halfLife" @click="goTo('Half life')">Half life</a>
        <a v-if="material.pharmacology.routeOfElimination" @click="goTo('Route of elimination')">Route of elimination</a>
        <a v-if="material.pharmacology.volumeOfDistribution" @click="goTo('Volume of distribution')">Volume of distribution</a>
        <a v-if="material.pharmacology.clearance" @click="goTo('Clearance')">Clearance</a>
        <a v-if="material.structuredAdverseEffects.length" @click="goTo('Adverse effects')">Adverse effects</a>
        <a v-if="material.structuredContraIndications.length" @click="goTo('Contraindications')">Contraindications</a>
        <a v-if="material.pharmacology.toxicity" @click="goTo('Toxicity')">Toxicity</a>
        <a v-if="material.foodInteractions.length" @click="goTo('Food Interactions')">Food Interactions</a>
        <a v-if="dBankRefsToShow.length" @click="goTo('References')">References</a>
      </section>
    </aside>
    <main v-if="material" class="material-details-content">
      <button class="material-details-content-share-btn" @click="$emit('openShareModal')">
        <!-- <mobile-share-icon v-if="isScreenNarrow" title="" /> -->
        <share-variant-icon title="" :size="22" />
      </button>
      <button class="drawer-btn" @click="showNav = true" v-if="isScreenNarrow"><menu-icon title="" /></button>
      <h1 ref="Title" class="material-details-content-name">
        {{ material.name }}<span class="material-details-content-name-search" v-if="userSearch && material.name !== userSearch"> - {{ userSearch }}</span>
      </h1>

      <!-- <div v-if="aliasesToShow.length" class="material-details-content-aliases-container">
        <p v-for="alias in aliasesToShow" :key="alias">{{ alias }}</p>
      </div> -->
      <hr class="line" />
      <section v-if="material.fdaLabel" class="material-details-content-section">
        <div>
          <h3>FDA Label</h3>

          <a class="fda-link" :href="material.fdaLabel" target="_blank">{{ material.fdaLabel }}</a>
        </div>
        <hr class="line" />
      </section>
      <section v-if="material.dBankDesc" class="material-details-content-section">
        <h3 ref="Background">Background</h3>
        <p v-if="material.dBankDesc" v-html="material.dBankDesc" v-refs-tooltip-material="{ material, refCountMap }"></p>
        <hr class="line" />
      </section>
      <section class="material-details-content-section">
        <h3 ref="Interactions">Interactions</h3>
        <router-link :to="`/search?q=${originalMaterial.name}`" target="_blank" class="fda-link font14"> click here to see all of the interactions </router-link>
        <hr class="line" />
      </section>
      <section v-if="material.dBankIndications && material.dBankIndications.length" class="material-details-content-section">
        <h3 ref="Medicinal uses">Medicinal uses</h3>
        <p v-if="material.dBankIndications.length">{{ material.dBankIndications.join(', ') }}</p>
        <hr class="line" />
      </section>
      <section v-if="material.pharmacology.indication" class="material-details-content-section">
        <h3 ref="Pharmacology">Pharmacology</h3>
        <p v-html="material.pharmacology.indication" v-refs-tooltip-material="{ material, refCountMap }"></p>
        <hr class="line" />
      </section>
      <section v-if="material.pharmacology.pharmacodynamics" class="material-details-content-section">
        <h3 ref="Pharmacodynamics">Pharmacodynamics</h3>
        <p v-html="material.pharmacology.pharmacodynamics" v-refs-tooltip-material="{ material, refCountMap }"></p>
        <hr class="line" />
      </section>
      <section v-if="material.pharmacology.absorption" class="material-details-content-section">
        <h3 ref="Absorption">Absorption</h3>
        <p v-html="material.pharmacology.absorption" v-refs-tooltip-material="{ material, refCountMap }"></p>
        <hr class="line" />
      </section>
      <section v-if="material.pharmacology.mechanismOfAction" class="material-details-content-section">
        <h3 ref="Mechanism of action">Mechanism of action</h3>
        <p v-html="material.pharmacology.mechanismOfAction" v-refs-tooltip-material="{ material, refCountMap }"></p>
        <hr class="line" />
      </section>
      <section v-if="material.pharmacology.proteinBinding" class="material-details-content-section">
        <h3 ref="Protein binding">Protein binding</h3>
        <p v-html="material.pharmacology.proteinBinding" v-refs-tooltip-material="{ material, refCountMap }"></p>
        <hr class="line" />
      </section>
      <section v-if="material.pharmacology.metabolism" class="material-details-content-section">
        <h3 ref="Metabolism">Metabolism</h3>
        <p v-html="material.pharmacology.metabolism" v-refs-tooltip-material="{ material, refCountMap }"></p>
        <hr class="line" />
      </section>
      <section v-if="material.pharmacology.halfLife" class="material-details-content-section">
        <h3 ref="Half life">Half life</h3>
        <p v-html="material.pharmacology.halfLife" v-refs-tooltip-material="{ material, refCountMap }"></p>
        <hr class="line" />
      </section>
      <section v-if="material.pharmacology.routeOfElimination" class="material-details-content-section">
        <h3 ref="Route of elimination">Route of elimination</h3>
        <p v-html="material.pharmacology.routeOfElimination" v-refs-tooltip-material="{ material, refCountMap }"></p>
        <hr class="line" />
      </section>
      <section v-if="material.pharmacology.volumeOfDistribution" class="material-details-content-section">
        <h3 ref="Volume of distribution">Volume of distribution</h3>
        <p v-html="material.pharmacology.volumeOfDistribution" v-refs-tooltip-material="{ material, refCountMap }"></p>
        <hr class="line" />
      </section>
      <section v-if="material.pharmacology.clearance" class="material-details-content-section">
        <h3 ref="Clearance">Clearance</h3>
        <p v-html="material.pharmacology.clearance" v-refs-tooltip-material="{ material, refCountMap }"></p>
        <hr class="line" />
      </section>
      <section v-if="material.structuredAdverseEffects.length" class="material-details-content-section">
        <h3 ref="Adverse effects">Adverse effects</h3>
        <div class="material-details-content-aliases-container">
          <p class="item" v-for="effect in material.structuredAdverseEffects" :key="effect">{{ effect }}</p>
        </div>
        <hr class="line" />
      </section>
      <section v-if="material.structuredContraIndications.length" class="material-details-content-section">
        <h3 ref="Contraindications">Contraindications</h3>
        <div class="material-details-content-aliases-container">
          <p class="item" v-for="effect in material.structuredContraIndications" :key="effect">{{ effect }}</p>
        </div>
        <hr class="line" />
      </section>
      <section v-if="material.pharmacology.toxicity" class="material-details-content-section">
        <h3 ref="Toxicity">Toxicity</h3>
        <p v-html="material.pharmacology.toxicity" v-refs-tooltip-material="{ material, refCountMap }"></p>
        <hr class="line" />
      </section>
      <section v-if="material.foodInteractions.length" class="material-details-content-section">
        <h3 ref="Food Interactions">Food Interactions</h3>
        <p v-for="effect in material.foodInteractions" :key="effect">{{ effect }}</p>
        <hr class="line" />
      </section>
      <section v-if="dBankRefsToShow.length" class="material-details-content-refs">
        <h4 ref="References">References</h4>
        <div v-for="ref in dBankRefsToShow" :key="ref.ref_id" class="ref-container">
          <p class="ref-idx dBank-ref-idx">{{ ref.ref_id }}</p>
          <div class="txt-container">
            <p v-if="ref.citation" class="txt">{{ ref.citation }}</p>
            <a v-if="ref.pubmed_id" class="link clip-txt" target="_blank" :href="`https://pubmed.ncbi.nlm.nih.gov/${ref.pubmed_id}`">https://pubmed.ncbi.nlm.nih.gov/{{ ref.pubmed_id }}</a>
            <a v-if="ref.url" class="link clip-txt" target="_blank" :href="ref.url">{{ ref.url }}</a>
          </div>
        </div>
      </section>
    </main>
  </section>
</template>

<script>
import { materialUIService } from '@/cms/services/material-ui.service';

import MenuIcon from 'vue-material-design-icons/Menu';
import ArrowLeftIcon from 'vue-material-design-icons/ArrowLeft';
// import MobileShareIcon from '@/client/cmps/common/icons/MobileShareIcon';
import ShareVariantIcon from 'vue-material-design-icons/ShareVariant';

export default {
  props: {
    originalMaterial: {
      type: Object,
      required: true
    },
    searchedMaterialName: {
      type: String
    }
  },
  data() {
    return {
      material: null,
      showNav: false,
      refCountMap: {},
      nextRefNum: 1,
      refNumsToShow: [],
      fieldsToCheckDrug: ['dBankDesc'],
      fieldsToCheckPharmacology: ['indication', 'pharmacodynamics', 'absorption', 'mechanismOfAction', 'proteinBinding', 'metabolism', 'halfLife', 'routeOfElimination', 'volumeOfDistribution', 'clearance', 'toxicity']
    };
  },
  methods: {
    addSubRefsDrug(material) {
      material.dBankRefs.unshift({ citation: 'FDA Label', url: material.fdaLabel, ref_id: 'Label' }, { citation: 'FDA Label', url: material.fdaLabel, ref_id: 'label' }, { citation: 'FDA Label', url: material.fdaLabel, ref_id: 'FDA label' });
      this.fieldsToCheckDrug.forEach(key => {
        material[key] = material[key].replaceAll('<sub>', '');
        material[key] = material[key].replaceAll('</sub>', '');
        material[key] = material[key].replaceAll('<sup>', '');
        material[key] = material[key].replaceAll('</sup>', '');
        material[key] = this.removeUnderLines(material[key]);
        const regex = /\[(.*?)\]/g;
        const matches = material[key].match(regex);
        if (matches) {
          matches.forEach(match => {
            const matchToShow = match.substring(1, match.length - 1);
            let splited = matchToShow.split(',');
            const dBandRefRegex = new RegExp(/[A-Z][0-9]+/g);
            const isShowAsSub = splited.some(str => str === 'label' || str === 'Label' || str === 'FDA label' || dBandRefRegex.test(str));
            if (!isShowAsSub) material[key] = material[key].replaceAll(match, splited.join(' '));
            else {
              let strToShow = '';
              splited.forEach(str => {
                str = str.trim();
                if (!this.refCountMap[str]) {
                  this.refCountMap[str] = this.nextRefNum;
                  this.nextRefNum++;
                }
                strToShow = strToShow ? strToShow + ',' + this.refCountMap[str] : this.refCountMap[str];
              });
              material[key] = material[key].replaceAll(`.${match}`, ` ${match}.`);
              material[key] = material[key].replaceAll(match, `<sub class="sub-font">(${strToShow})</sub>`);
            }
          });
        }
      });
      this.fieldsToCheckPharmacology.forEach(key => {
        material.pharmacology[key] = material.pharmacology[key].replaceAll('<sub>', '');
        material.pharmacology[key] = material.pharmacology[key].replaceAll('</sub>', '');
        material.pharmacology[key] = material.pharmacology[key].replaceAll('<sup>', '');
        material.pharmacology[key] = material.pharmacology[key].replaceAll('</sup>', '');
        material.pharmacology[key] = this.removeUnderLines(material.pharmacology[key]);
        material.pharmacology[key] = this.addSubHeaders(material.pharmacology, key, true);
        const regex = /\[(.*?)\]/g;
        const matches = material.pharmacology[key].match(regex);
        if (matches) {
          matches.forEach(match => {
            const matchToShow = match.substring(1, match.length - 1);
            let splited = matchToShow.split(',');
            const dBandRefRegex = new RegExp(/[A-Z][0-9]+/g);
            const isShowAsSub = splited.some(str => str === 'label' || str === 'Label' || str === 'FDA label' || dBandRefRegex.test(str));
            if (!isShowAsSub) material.pharmacology[key] = material.pharmacology[key].replaceAll(match, splited.join(' '));
            else {
              let strToShow = '';
              splited.forEach(str => {
                str = str.trim();
                if (!this.refCountMap[str]) {
                  this.refCountMap[str] = this.nextRefNum;
                  this.nextRefNum++;
                }
                strToShow = strToShow ? strToShow + ',' + this.refCountMap[str] : this.refCountMap[str];
              });
              material.pharmacology[key] = material.pharmacology[key].replaceAll(`.${match}`, ` ${match}.`);
              material.pharmacology[key] = material.pharmacology[key].replaceAll(match, `<sub class="sub-font">(${strToShow})</sub>`);
            }
          });
        }
      });
      return material;
    },
    organizeRefs(material) {
      material = this.addSubRefsDrug(material);
      return material;
    },
    removeUnderLines(str) {
      const regex = /_{1}(.*?)_{1}/g;
      const matches = str.match(regex);
      if (matches) {
        matches.forEach(match => {
          let strToShow = match.substring(1, match.length - 1);
          str = str.replaceAll(match, strToShow);
        });
      }
      return str;
    },
    addSubHeaders(object, key, isDrug = false) {
      const subHeaderRegex = /\*{2}(.*?)\*{2}/g;
      const subHeaders = object[key].match(subHeaderRegex);
      if (subHeaders) {
        subHeaders.forEach(subHeader => {
          let justHeader = subHeader.substring(2, subHeader.length - 2);
          object[key] = object[key].replaceAll(subHeader, `<h2 class="dbank-sub-header">${justHeader}</h2>`);
        });
      }

      return isDrug ? object[key] : object;
    },
    getTypeImgName(type) {
      switch (type) {
        case 'drug':
          return 'drug';
        case 'herb':
        case 'essential oil':
          return 'herb';
        case 'vitamin':
        case 'mineral':
        case 'amino acid':
        case 'nutraceutical':
          return 'other';
        case 'food':
          return 'food';
        default:
          return 'other'
      }
    },
    goTo(refName) {
      const element = this.$refs[refName];
      const top = element.offsetTop;

      window.scrollTo(0, top - 60);
      this.showNav = false;
    }
  },
  computed: {
    userSearch() {
      return this.$route.query.q;
    },
    singleAliasesToShow() {
      let singleAlias = this.aliasesToShow.filter(alias => alias.toLowerCase() === this.material.name.toLowerCase())[0];
      if (!singleAlias) return;
      else return singleAlias;
    },
    isNotAllowedSelect() {
      if (!this.$store.getters.loggedInUser) return true;
      return !this.$store.getters.loggedInUser.isAllowedToSelectTxt;
    },
    isScreenNarrow() {
      return this.$store.getters.isScreenNarrow;
    },
    dBankRefsToShow() {
      const refsCopy = JSON.parse(JSON.stringify(this.material.dBankRefs));
      const refsToShow = refsCopy.filter(ref => this.refCountMap[ref.ref_id]);
      refsToShow.forEach(ref => {
        ref.ref_id = this.refCountMap[ref.ref_id];
      });
      refsToShow.sort((a, b) => {
        if (a.ref_id > b.ref_id) return 1;
        if (a.ref_id < b.ref_id) return -1;
        return 0;
      });
      return refsToShow;
    },
    aliasesToShow() {
      const { material } = this;
      if (material.aliases.length && material.dBankAliases.length) {
        const allAliases = material.dBankAliases.concat(material.aliases);
        const aliasesToReturn = [...new Set(allAliases)].sort((a, b) => {
          if (a.toLowerCase() < b.toLowerCase()) return -1;
          if (a.toLowerCase() > b.toLowerCase()) return 1;
          return 0;
        });
        return aliasesToReturn;
      }
      return material.aliases.length ? material.aliases.sort() : material.dBankAliases.sort();
    }
  },
  async created() {
    const materialWithRefs = await this.organizeRefs(this.originalMaterial);
    this.material = materialWithRefs;
    const nameHightMap = materialUIService.getMaterialPageHightMap();
    if (nameHightMap && nameHightMap[this.material.name]) {
      this.$nextTick(() => {
        window.scrollTo(0, nameHightMap[this.material.name]);
      });
    }
  },
  components: {
    MenuIcon,
    ArrowLeftIcon,
    // MobileShareIcon,
    ShareVariantIcon
  }
};
</script>

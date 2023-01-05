<template>
  <section class="main-index">
    <section class="index-search full">
      <div class="index-search-input main-layout">
        <AppAutoComplete @materialSelected="materialSelected" :placeholder="'Search Drug / Herb / Supplement'" />
      </div>
      <div class="index-search-material-type">
        <button :class="{ focused: materialType === 'drug' }" @click="setMaterialType('drug')">Drugs</button>
        <button :class="{ focused: materialType === 'herb' }" @click="setMaterialType('herb')">Herbs</button>
        <button :class="{ focused: materialType === 'supplement' }" @click="setMaterialType('supplement')">Supplements</button>
      </div>
    </section>
    <section class="letters-container main-layout">
      <section class="main-index-letters">
        <button :class="{ focused: letterFilter === letter, disabled: isDisabled(letter) }" :disabled="isDisabled(letter)" @click="setFilter(letter)" class="letter-btn" v-for="letter in letters" :key="letter">
          <span>{{ letter }}</span>
        </button>
      </section>
      <!-- <section v-else class="main-index-letters">
        <button @click="setFilter(letterFilter)" class="letter-btn focused">
          <span>{{ letterFilter }}</span>
        </button>
      </section> -->
      <section v-if="materialType === 'drug'" class="letters-container main-index-sub-letters">
        <button
          :class="{
            focused: subgroupFilter === letter,
            disabled: isDisabled(letter)
          }"
          :disabled="isDisabled(letter)"
          @click="setSubfilter(letter)"
          class="letter-btn"
          v-for="letter in subgroupLetters"
          :key="letter"
        >
          {{ letter }}
        </button>
      </section>
    </section>

    <div class="main-index-loader" v-if="isLoading">
      <Loader />
    </div>
    <main v-else class="index-main-content main-layout">
      <template v-if="!isMaterialUnderStudy && materials.length > 0">
        <div v-for="material in materials" :key="material._id" class="results-container" :class="{ disabled: material.isUnderStudy }">
          <router-link :is="material.isUnderStudy ? 'span' : 'router-link'" :to="{ path: `/material/${material._id}` }" target="_blank"> {{ material.name }} </router-link>
        </div>
      </template>
      <template v-if="materials.length === 0 && !isMaterialUnderStudy">
        <section class="no-results">No Materials that starts with - {{ subgroupFilter }}</section>
      </template>
    </main>
    <div v-if="isMaterialUnderStudy" class="material-under-study main-layout">
      <div class="material-under-study-container">
        <div class="material-under-study-img">
          <svg width="68" height="71" viewBox="0 0 68 71" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6.72656" y="1" width="55" height="64" rx="4" stroke="#6F818E" stroke-width="2" />
            <rect x="15.998" y="12" width="36" height="21" rx="2" fill="#EFEFEF" />
            <rect x="16.5779" y="53.8533" width="34.2934" height="4.29339" rx="2.14669" fill="#6F818E" stroke="#6F818E" stroke-width="1.70661" />
            <rect x="16.5779" y="44.8533" width="34.2934" height="4.29339" rx="2.14669" fill="#6F818E" stroke="#6F818E" stroke-width="1.70661" />
          </svg>
          <svg width="35" height="58" viewBox="0 0 35 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="7.88867" y="5.17188" width="19.551" height="3.95273" rx="1.97636" fill="#6F818E" />
            <mask id="path-2-outside-1_1873_1472" maskUnits="userSpaceOnUse" x="0.802734" y="11.7676" width="34" height="46" fill="black">
              <rect fill="white" x="0.802734" y="11.7676" width="34" height="46" />
              <path d="M2.80273 21.7676C2.80273 17.3493 6.38446 13.7676 10.8027 13.7676H24.5272C28.9455 13.7676 32.5273 17.3493 32.5273 21.7676V47.0098C32.5273 51.428 28.9455 55.0098 24.5273 55.0098H10.8027C6.38447 55.0098 2.80273 51.428 2.80273 47.0098V21.7676Z" />
            </mask>
            <path d="M2.80273 21.7676C2.80273 17.3493 6.38446 13.7676 10.8027 13.7676H24.5272C28.9455 13.7676 32.5273 17.3493 32.5273 21.7676V47.0098C32.5273 51.428 28.9455 55.0098 24.5273 55.0098H10.8027C6.38447 55.0098 2.80273 51.428 2.80273 47.0098V21.7676Z" fill="white" />
            <path
              d="M10.8027 15.7676H24.5272V11.7676H10.8027V15.7676ZM30.5273 21.7676V47.0098H34.5273V21.7676H30.5273ZM24.5273 53.0098H10.8027V57.0098H24.5273V53.0098ZM4.80273 47.0098V21.7676H0.802734V47.0098H4.80273ZM10.8027 53.0098C7.48903 53.0098 4.80273 50.3235 4.80273 47.0098H0.802734C0.802734 52.5326 5.2799 57.0098 10.8027 57.0098V53.0098ZM30.5273 47.0098C30.5273 50.3235 27.841 53.0098 24.5273 53.0098V57.0098C30.0501 57.0098 34.5273 52.5326 34.5273 47.0098H30.5273ZM24.5272 15.7676C27.841 15.7676 30.5273 18.4539 30.5273 21.7676H34.5273C34.5273 16.2447 30.0501 11.7676 24.5272 11.7676V15.7676ZM10.8027 11.7676C5.27989 11.7676 0.802734 16.2447 0.802734 21.7676H4.80273C4.80273 18.4539 7.48903 15.7676 10.8027 15.7676V11.7676Z"
              fill="#6F818E"
              mask="url(#path-2-outside-1_1873_1472)"
            />
            <rect x="7.19336" y="23.9941" width="4.39112" height="26.5859" rx="2.19556" fill="#6F818E" />
          </svg>
        </div>
        <div class="material-under-study-content">
          This material is still under construction. <br />
          FYI: We will give higher priority to this material since you searched for it.
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppAutoComplete from '@/client/cmps/shared/AppAutoComplete';
import Loader from '@/client/cmps/common/icons/Loader';
import disabledDrugs from './json/disabledDrugs.json';
import disabledHerbs from './json/disabledHerbs.json';
import disabledSuppluments from './json/disabledSuppluments.json';

export default {
  components: {
    AppAutoComplete,
    Loader
  },
  data() {
    return {
      isLoading: true,
      materials: [],
      materialType: 'drug',
      letterFilter: 'A',
      subgroupFilter: '',
      isMaterialUnderStudy: false,
      subgroupLetters: ['Aa', 'Ab', 'Ac', 'Ad', 'Ae', 'Af', 'Ag', 'Ah', 'Ai', 'Aj', 'Ak', 'Al', 'Am', 'An', 'Ao', 'Ap', 'Aq', 'Ar', 'As', 'At', 'Au', 'Av', 'Aw', 'Ax', 'Ay', 'Az']
    };
  },
  async created() {
    const { l, type, subl } = this.$route.query;
    if (l && type) {
      this.letterFilter = l;
      this.materialType = type;

      if (subl) {
        this.subgroupFilter = subl;
        this.subgroupLetters = this.setsubGroupLetters(subl.charAt(0));
      }
    }
    this.materials = await this.$store.dispatch({
      type: 'fetchMaterials',
      criteria: {
        q: subl ? this.subgroupFilter : this.letterFilter,
        type: this.materialType
      }
    });
    // this.sortMaterials(this.materials);

    this.isLoading = false;
  },
  methods: {
    isDisabled(letter) {
      if (this.materialType === 'drug') return disabledDrugs.includes(letter);
      if (this.materialType === 'herb') return disabledHerbs.includes(letter);
      if (this.materialType === 'supplement') return disabledSuppluments.includes(letter);
    },
    async setMaterialType(type) {
      this.isMaterialUnderStudy = false;
      this.materialType = type;
      // this.$router.push({
      //   query: { letterFilter: this.letterFilter, type: this.materialType }
      // });
      this.setFilter(this.letterFilter);
    },
    setsubGroupLetters(switchedLetter) {
      return this.subgroupLetters.map(letter => {
        let newLetter = letter.split('').splice(1, 1);
        newLetter.unshift(switchedLetter);
        return newLetter.join('');
      });
    },
    pushFilterToQueryParams() {
      this.$router.replace({
        path: '/index',
        query: { l: this.letterFilter, type: this.materialType, subl: this.subgroupFilter }
      });
    },
    async setFilter(letter) {
      this.isMaterialUnderStudy = false;
      if (!letter) return;
      this.letterFilter = letter;
      this.pushFilterToQueryParams();
      // this.$router.push({
      //   query: { letterFilter: this.letterFilter, type: this.materialType }
      // });
      this.subgroupLetters = this.setsubGroupLetters(letter);
      const criteria = {
        q: this.letterFilter,
        type: this.materialType
      };
      this.materials = [];
      this.isLoading = true;

      this.materials = await this.$store.dispatch({ type: 'fetchMaterials', criteria });
      this.sortMaterials(this.materials);

      this.isLoading = false;
    },
    sortMaterials(materials) {
      return materials.sort((a, b) => a.name.localeCompare(b.name));
    },
    async setSubfilter(subLetters) {
      this.isMaterialUnderStudy = false;
      this.subgroupFilter = subLetters;
      this.pushFilterToQueryParams();
      const criteria = {
        q: this.subgroupFilter,
        type: this.materialType
      };
      this.materials = [];
      this.isLoading = true;

      this.materials = await this.$store.dispatch({ type: 'fetchMaterials', criteria });
      this.sortMaterials(this.materials);
      console.log('this.materials', this.materials);

      this.isLoading = false;
    },

    async materialSelected(item) {
      this.isMaterialUnderStudy = false;
      this.isLoading = true;
      // this.materials = [];
      const material = await this.$store.dispatch({ type: 'getMaterialByName', name: item.txt });

      if (material.isUnderStudy) {
        this.isMaterialUnderStudy = true;
      } else {
        const routeData = this.$router.resolve({ path: `/material/${material._id}` });
        window.open(routeData.href, '_blank');
        // this.materials = await this.$store.dispatch({ type: 'fetchMaterials', criteria: { q: this.letterFilter, type: this.materialType } });
        // this.sortMaterials(this.materials);
      }
      this.isLoading = false;
    }
  },
  computed: {
    letters() {
      return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    },
    isScreenNarrow() {
      return this.$store.getters.isScreenNarrow;
    }
  }
};
</script>

<style></style>

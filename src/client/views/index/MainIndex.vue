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
      <template v-if="!isMaterialUnderStudy && materials.length > 0 && !isFormula">
        <div v-for="material in materials" :key="material._id" class="results-container" :class="{ disabled: material.isUnderStudy }">
          <router-link :is="material.isUnderStudy ? 'span' : 'router-link'" :to="{ path: `/material/${material._id}` }" target="_blank"> {{ material.name }} </router-link>
        </div>
      </template>
      <template v-if="!materials.length && !isMaterialUnderStudy">
        <section class="no-results">No Materials that starts with - {{ subgroupFilter }}</section>
      </template>
    </main>
    <div v-if="isMaterialUnderStudy && !isFormula" class="material-under-study main-layout">
      <div class="material-under-study-container">
        <div class="material-under-study-img">
          <img src="@/client/assets/imgs/under-study.svg" />
          <img src="@/client/assets/imgs/under-study2.svg" />
        </div>
        <div class="material-under-study-content">
          This material is still under construction. <br />
          FYI: We will give higher priority to this material since you searched for it.
        </div>
      </div>
    </div>
    <div class="material-under-study main-layout" v-if="isFormula">
      <div class="material-under-study-img">
        <img src="@/client/assets/imgs/under-study.svg" />
        <img src="@/client/assets/imgs/under-study2.svg" />
      </div>
      <div class="material-under-study-content">
        This is a formula consisting of a number of materials, so it can't be displayed.
        <br />
        It can be found in the interaction checker.
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
      isFormula: false,
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
      this.isFormula = false;

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
      this.isFormula = false;

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
      this.isLoading = false;
    },

    async materialSelected(item) {
      this.isMaterialUnderStudy = false;
      this.isFormula = false;
      this.isLoading = true;

      if (item.nestedMaterials.length || item.isCompound) {
        this.isLoading = false;
        this.isFormula = true;
        return;
      }

      const material = await this.$store.dispatch({ type: 'getMaterialByName', name: item.txt });

      if (material) {
        if (material.isUnderStudy) {
          this.isMaterialUnderStudy = true;
        } else {
          const routeData = this.$router.resolve({ path: `/material/${material._id}`, query: { q: item.txt } });
          window.open(routeData.href, '_blank');
        }
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

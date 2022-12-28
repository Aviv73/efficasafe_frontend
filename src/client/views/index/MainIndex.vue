<template>
  <section class="main-index">
    <section class="index-search full">
      <div class="index-search-input main-layout">
        <AppAutoComplete @materialSelected="materialSelected" :placeholder="'Search Drug / Herb / Supplements'" />
      </div>
      <div class="index-search-material-type">
        <button :class="{ focused: materialType === 'drug' }" @click="setMaterialType('drug')">Drugs</button>
        <button :class="{ focused: materialType === 'herb' }" @click="setMaterialType('herb')">Herbs</button>
        <button :class="{ focused: materialType === 'supplement' }" @click="setMaterialType('supplement')">Suppluments</button>
      </div>
    </section>
    <section class="main-layout">
      <section class="main-index-letters">
        <button :class="{ focused: letterFilter === letter }" @click="setFilter(letter)" class="letter-btn" v-for="letter in letters" :key="letter">
          <span>{{ letter }}</span>
        </button>
      </section>
      <!-- <section v-else class="main-index-letters">
        <button @click="setFilter(letterFilter)" class="letter-btn focused">
          <span>{{ letterFilter }}</span>
        </button>
      </section> -->
      <section v-if="materialType === 'drug'" class="main-index-sub-letters">
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

    <div class="main-index-loader" v-if="!materials.length && isLoading">
      <Loader />
    </div>
    <main v-else class="index-main-content main-layout">
      <template v-if="materials.length > 0">
        <div v-for="material in materials" :key="material._id" class="results-container" :class="{ disabled: material.isUnderStudy }">
          <router-link :is="material.isUnderStudy ? 'span' : 'router-link'" :to="{ path: `/material/${material._id}` }" target="_blank"> {{ material.name }} </router-link>
        </div>
      </template>
      <template v-else>
        <section class="no-results">No Materials that starts with - {{ subgroupFilter }}</section>
      </template>
    </main>
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
      subgroupLetters: ['Aa', 'Ab', 'Ac', 'Ad', 'Ae', 'Af', 'Ag', 'Ah', 'Ai', 'Aj', 'Ak', 'Al', 'Am', 'An', 'Ao', 'Ap', 'Aq', 'Ar', 'As', 'At', 'Au', 'Av', 'Aw', 'Ax', 'Ay', 'Az']
    };
  },
  async created() {
    const criteria = {
      q: 'A'
    };

    this.materials = await this.$store.dispatch({ type: 'fetchMaterials', criteria });
    this.sortMaterials(this.materials);

    this.isLoading = false;
  },
  methods: {
    isDisabled(letter) {
      if (this.materialType === 'drug') return disabledDrugs.includes(letter);
      if (this.materialType === 'herb') return disabledHerbs.includes(letter);
      if (this.materialType === 'supplement') return disabledSuppluments.includes(letter);
    },
    async setMaterialType(type) {
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
    async setFilter(letter) {
      if (!letter) return;
      this.letterFilter = letter;
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
      this.subgroupFilter = subLetters;
      const criteria = {
        q: this.subgroupFilter,
        type: this.materialType
      };
      this.materials = [];
      this.isLoading = true;

      this.materials = await this.$store.dispatch({ type: 'fetchMaterials', criteria });
      this.sortMaterials(this.materials);
      console.log('materials', this.materials);

      this.isLoading = false;
    },
    async materialSelected(item) {
      this.isLoading = true;
      this.materials = [];
      const material = await this.$store.dispatch({ type: 'getMaterialByName', name: item.txt });

      const routeData = this.$router.resolve({ path: `/material/${material._id}` });
      window.open(routeData.href, '_blank');
      this.isLoading = false;
      this.materials = await this.$store.dispatch({ type: 'fetchMaterials', criteria: { q: 'A' } });
      this.sortMaterials(this.materials);
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

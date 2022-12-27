<template>
  <section class="main-index">
    <section class="index-search full">
      <div class="index-search-input main-layout">
        <AppAutoComplete @materialSelected="materialSelected" :placeholder="'Smart Search'" />
      </div>
      <div class="index-search-material-type">
        <button :class="{ focused: focusedButton === 'drug' }" @click="setMaterialType('drug')">Drug</button>
        <button :class="{ focused: focusedButton === 'herb' }" @click="setMaterialType('herb')">Herb</button>
        <button :class="{ focused: focusedButton === 'supplement' }" @click="setMaterialType('supplement')">Suppluments</button>
      </div>
    </section>

    <section class="main-index-letters main-layout">
      <button @click="setFilter(letter)" class="letter-btn" v-for="letter in letters" :key="letter">
        {{ letter }}
      </button>
    </section>

    <div class="main-index-loader" v-if="!materials && isLoading">
      <Loader />
    </div>
    <main v-else class="index-main-content main-layout">
      <template>
        <div v-for="material in materials" :key="material._id" class="results-container">
          <router-link :to="{ path: `/material/${material._id}` }" target="_blank"> {{ material.name }} </router-link>
        </div>
      </template>
    </main>
  </section>
</template>

<script>
import AppAutoComplete from '@/client/cmps/shared/AppAutoComplete';
import Loader from '@/client/cmps/common/icons/Loader';

export default {
  components: {
    AppAutoComplete,
    Loader
  },
  data() {
    return {
      isLoading: true,
      materials: null,
      materialType: 'drug',
      focusedButton: 'drug'
    };
  },
  async created() {
    const criteria = {
      q: 'A'
    };
    this.isLoading = true;
    this.materials = await this.$store.dispatch({ type: 'fetchMaterials', criteria });
    console.log(this.materials);

    this.isLoading = false;
  },
  methods: {
    async setMaterialType(type) {
      this.materialType = type;
      this.focusedButton = type;
      this.setFilter();
    },
    async setFilter(letter = 'A') {
      const criteria = {
        q: letter,
        type: this.materialType
      };
      this.materials = null;
      this.isLoading = true;

      this.materials = await this.$store.dispatch({ type: 'fetchMaterials', criteria });
      console.log('materials', this.materials);

      this.isLoading = false;
    },
    async materialSelected(item) {
      //   const criteria = {
      //     q: item.txt
      //   };
      this.isLoading = true;
      this.materials = null;
      const material = await this.$store.dispatch({ type: 'getMaterialByName', name: item.txt });

      const routeData = this.$router.resolve({ path: `/material/${material._id}` });
      window.open(routeData.href, '_blank');
      this.isLoading = false;
      this.materials = await this.$store.dispatch({ type: 'fetchMaterials', criteria: { q: 'A' } });
    }
  },
  computed: {
    // materials() {
    //   return this.$store.getters.indexMaterials;
    // },
    letters() {
      return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    }
  }
};
</script>

<style></style>

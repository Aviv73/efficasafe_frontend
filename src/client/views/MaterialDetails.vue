<template>
  <section class="material-details no-print" :class="{ 'not-allowed-select-txt': isNotAllowedSelect }">
    <template v-if="!isLoading">
      <div v-if="showSignUpMsg" class="login-wrapper">
        <div class="login-container">
          <h3 class="login-req">You must be logged in to see more material pages</h3>
          <div>
            <button class="signup-btn" @click="onOpenSignup">Sign Up</button>
            or
            <button class="signup-btn" @click="onOpenLogin">Login</button>
          </div>
        </div>
        <div class="benefits-container">
          <h4 class="benefits-title">Here is why you should sign up:</h4>
          <div class="benefit">
            <img src="@/client/assets/imgs/logo-symbol-sm.png" alt="" />
            <p><span>Increase patient safety</span> via access to up to date Drug-Drug and Herb-Supplement-Drug interaction data</p>
          </div>
          <div class="benefit">
            <img src="@/client/assets/imgs/logo-symbol-sm.png" alt="" />
            <p><span>Make accurate clinical decisions</span> by leveraging extensive evidence-based information on clinical efficacy and patient safety</p>
          </div>
          <div class="benefit">
            <img src="@/client/assets/imgs/logo-symbol-sm.png" alt="" />
            <p><span>Cross check</span> multiple Drug-Drug and Herb-Supplement-Drug interactions instantly</p>
          </div>
          <div class="benefit">
            <img src="@/client/assets/imgs/logo-symbol-sm.png" alt="" />
            <p><span>Get concise recommendations, summaries, and detailed study reviews</span></p>
          </div>
          <div class="benefit">
            <img src="@/client/assets/imgs/logo-symbol-sm.png" alt="" />
            <p><span>Gain</span> valuable insights on which clinical and laboratory parameters to <span>monitor</span> per individual patient profiles/interactions</p>
          </div>
          <div class="benefit">
            <img src="@/client/assets/imgs/logo-symbol-sm.png" alt="" />
            <p><span>Optimize integrative treatment</span> via vital information on both negative and synergistic Herb-Supplement-Drug interactions</p>
          </div>
          <div class="benefit">
            <img src="@/client/assets/imgs/logo-symbol-sm.png" alt="" />
            <p><span>Save patients' pharmacological profiles.</span> Manage, save, and track updated patient drug-herb-supplement profiles and records quickly and easily</p>
          </div>
          <div class="benefit">
            <img src="@/client/assets/imgs/logo-symbol-sm.png" alt="" />
            <p><span>Empower patients</span> with reliable, referenced information to help them better understand their medications and/or supplements while identifying any potentially dangerous interactions before they occur</p>
          </div>
        </div>
      </div>
      <template v-if="material">
        <drug-details :searchedMaterialName="searchedMaterialName" @openShareModal="openShareModal" :originalMaterial="material" v-if="material.type === 'drug'" />
        <herb-details :searchedMaterialName="searchedMaterialName" @openShareModal="openShareModal" :originalMaterial="material" v-if="material.type === 'herb'" />
        <supp-details :searchedMaterialName="searchedMaterialName" @openShareModal="openShareModal" :originalMaterial="material" v-if="material.type !== 'herb' && material.type !== 'drug'" />
      </template>
    </template>
    <loader v-else class="loader" />
    <section class="links-container" v-if="interactions.length" v-show="false">
      <div class="link" v-for="(interaction, idx) in interactions" :key="`${interaction._id}${idx}`">
        <a v-if="interaction.isVirtual" :href="`/interaction/${interaction._id}/${interaction.side2Material._id}`" target="_blank">{{ interaction.name }}</a>
        <a v-else :href="`/interaction/${interaction._id}`" target="_blank">{{ interaction.name }}</a>
      </div>
    </section>
    <modal-wrap :isActive="isShareModalActive" @close-modal="isShareModalActive = false">
      <share-modal @close-modal="isShareModalActive = false" />
    </modal-wrap>
  </section>
</template>

<script>
import { materialUIService } from '@/cms/services/material-ui.service';
import { interactionUIService } from '@/cms/services/interaction-ui.service';
// import {storageService} from '@/cms/services/storage.service';
import { eventBus, EV_open_signup, EV_open_login } from '@/cms/services/eventBus.service';

import Loader from '@/client/cmps/common/icons/Loader';
import ShareModal from '@/client/cmps/shared/modals/ShareModal';
import ModalWrap from '@/client/cmps/common/ModalWrap';
import drugDetails from '@/client/cmps/material-details/MaterialDrugDetails';
import herbDetails from '@/client/cmps/material-details/MaterialHerbDetails';
import suppDetails from '@/client/cmps/material-details/MaterialSuppDetails';

export default {
  data() {
    return {
      material: null,
      isLoading: true,
      showSignUpMsg: false,
      isShareModalActive: false,
      interactions: [],
      searchedMaterialName: ''
    };
  },
  metaInfo() {
    return {
      title: this.pageTitle
    };
  },
  methods: {
    savePageHight() {
      materialUIService.setMaterialPageHightMap({ name: this.material.name, hight: window.pageYOffset });
    },
    openShareModal() {
      this.isShareModalActive = true;
    },
    onOpenSignup() {
      eventBus.$emit(EV_open_signup);
    },
    onOpenLogin() {
      eventBus.$emit(EV_open_login);
    },
    getInteractionColor({ recommendation }) {
      return interactionUIService.getInteractionColor(recommendation);
    },
    async getInteractions(mat) {
      const material = [mat];
      const ids = material.reduce((acc, { _id, labels }) => {
        if (!acc.includes(_id)) acc.push(_id);
        labels.forEach(label => {
          if (!acc.includes(label._id)) acc.push(label._id);
        });
        return acc;
      }, []);
      const filterBy = {
        isSearchResults: true,
        isMaterialPage: true,
        page: 0,
        id: ids,
        materialCount: 1
      };
      const { interactions } = await this.$store.dispatch({ type: 'getInteractions', filterBy });
      const interactionsToShow = [];
      interactions.forEach(async int => {
        if (int.side2Label) {
          const criteria = { labelId: int.side2Label._id };
          const relatedMaterials = await this.$store.dispatch({ type: 'getMaterials', criteria });
          relatedMaterials.forEach(relatedMaterial => {
            const vInteraction = this.createVInteraction(int, relatedMaterial);
            interactionsToShow.push(vInteraction);
          });
        } else interactionsToShow.push(int);
      });
      return interactionsToShow;
    },
    createVInteraction(originalInteraction, material) {
      const vInteraction = JSON.parse(JSON.stringify(originalInteraction));
      vInteraction.isVirtual = true;
      vInteraction.side2Material = {
        name: material.name,
        type: material.type,
        _id: material._id
      };
      vInteraction.name = `${vInteraction.side1Material.name} & ${vInteraction.side2Material.name}`;
      delete vInteraction.side2Label;
      return vInteraction;
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
    isNotAllowedSelect() {
      if (!this.$store.getters.loggedInUser) return true;
      return !this.$store.getters.loggedInUser.isAllowedToSelectTxt;
    },
    pageTitle() {
      if (this.material) {
        return this.material.name;
      }

      return '';
    }
  },
  async mounted() {
    // In mounted because the loader is not showing until the function is done
    const { id } = this.$route.params;
    const { name } = this.$route.query;
    this.searchedMaterialName = name;

    const material = await this.$store.dispatch({ type: 'loadMaterial', matId: id });
    if (!material.isShowPage) return this.$router.push('/404');
    this.material = material;
    this.isLoading = false;
    document.addEventListener('scroll', this.savePageHight);

    this.interactions = await this.getInteractions(material);
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.savePageHight);
  },
  components: {
    Loader,
    ShareModal,
    ModalWrap,
    drugDetails,
    herbDetails,
    suppDetails
  }
};
</script>

import Vue from 'vue';
import Vuex from 'vuex';
import { userStore } from './modules/user.store';
import { materialStore } from './modules/material.store';
import { labelStore } from './modules/label.store';
import { interactionStore } from './modules/interaction.store';
import { archiveStore } from './modules/archive.store';
import { atcStore } from './modules/atc.store';
import { drugBankStore } from './modules/drug-bank.store';
import { featuredInteractionStore } from './modules/featured-interaction.store';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    materialNamesMap: null,
    isScreenNarrow: null
  },
  getters: {
    isScreenNarrow(state) {
      return state.isScreenNarrow;
    },
    materialNamesMap(state) {
      return state.materialNamesMap;
    },
    materialRealName: (state) => (userQuery) => {
      return Object.entries(state.materialNamesMap).find(entry => entry[1].includes(userQuery));
    },
    queryApearanceCount: (state) => (query) => {
      return Object.values(state.materialNamesMap).reduce((acc, currQueries) => {
        currQueries.forEach(currQuery => {
          if (currQuery === query) acc++;
        });
        return acc;
      }, 0);
    }
  },
  mutations: {
    makeMaterialNamesMap(state, { materials }) {
      state.materialNamesMap = materials.reduce((acc, material) => {
        if (!acc[material.name]) acc[material.name] = [material.userQuery];
        else acc[material.name].push(material.userQuery);
        return acc;
      }, {});
    },
    setIsScreenNarrow(state) {
      state.isScreenNarrow = window.innerWidth < 900;
    }
  },
  plugins: [
    (store) => {
      store.commit({ type: 'setIsScreenNarrow' });
      window.addEventListener('resize', () => {
        store.commit({ type: 'setIsScreenNarrow' });
      });
    }
  ],
  modules: {
    userStore,
    materialStore,
    labelStore,
    interactionStore,
    archiveStore,
    atcStore,
    drugBankStore,
    featuredInteractionStore
  }
})

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
    materialNamesMap: null
  },
  getters: {
    materialNamesMap(state) {
      return state.materialNamesMap;
    }
  },
  mutations: {
    makeMaterialNamesMap(state, { materials }) {
      state.materialNamesMap = materials.reduce((acc, material) => {
        acc[material.name] = material.userQuery;
        return acc;
      }, {});
    }
  },
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

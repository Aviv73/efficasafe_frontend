import Vue from 'vue';
import Vuex from 'vuex';
import { userStore } from './modules/user.store';
import { materialStore } from './modules/material.store';
import { labelStore } from './modules/label.store';
import { interactionStore } from './modules/interaction.store';
import { archiveStore } from './modules/archive.store';
import { atcStore } from './modules/atc.store';
import { drugBankStore } from './modules/drug-bank.store';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: false
  },
  getters: {
    isLoading(state) {
      return state.isLoading;
    }
  },
  mutations: {
    toggleIsLoading(state) {
      state.isLoading = !state.isLoading;
    }
  },
  modules: {
    userStore,
    materialStore,
    labelStore,
    interactionStore,
    archiveStore,
    atcStore,
    drugBankStore
  }
})

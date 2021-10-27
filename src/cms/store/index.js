import Vue from 'vue';
import Vuex from 'vuex';
import { storageService } from '../services/storage.service';
import { userStore } from './modules/user.store';
import { materialStore } from './modules/material.store';
import { labelStore } from './modules/label.store';
import { interactionStore } from './modules/interaction.store';
import { archiveStore } from './modules/archive.store';
import { atcStore } from './modules/atc.store';
import { drugBankStore } from './modules/drug-bank.store';
import { featuredInteractionStore } from './modules/featured-interaction.store';

import { manageService } from '@/cms/services/manage.service'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    materialNamesMap: null,
    isScreenNarrow: null,
    hasFailedTasks: false,
    posSuppIds: [],
    freeSearchesCount: null,
    selectedPaymentPlan: null,
    managementData: null,
    initialLoading: false
  },
  getters: {
    hasFailedTasks(state) {
      return state.hasFailedTasks;
    },
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
    },
    getPosSuppLength(state){
      return state.posSuppIds.length
    },
    getFreeSearchesCount(state) {
      return state.freeSearchesCount
    },
    getSelectedPaymentPlan(state){
      return state.selectedPaymentPlan 
    },
    getManagementData(state){
      return state.managementData
    },
    getInitialLoading(state){
      return state.initialLoading
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
    },
    setHasFailedTasks(state, { hasTasks }) {
      state.hasFailedTasks = hasTasks;
    },
    setPosSuppIds(state, { ids }){
      ids.forEach(id => {
        if(!state.posSuppIds.includes(id)) state.posSuppIds.push(id)
      })
    },
    resetPosSupp(state){
      state.posSuppIds = []
    },
    setFreeSearchesCount(state){
      if(!storageService.load('searches-left') && storageService.load('searches-left') !== 0){
        storageService.store('searches-left', state.managementData.freeSearchesNum)
      }
      state.freeSearchesCount = storageService.load('searches-left')
    },
    reduceFreeSearches(state){
      if(state.freeSearchesCount === 0) return
      state.freeSearchesCount -= 1
      storageService.store('searches-left', state.freeSearchesCount)
    },
    setSelectedPaymentPlan(state, { SelectedPlan }){
      state.selectedPaymentPlan = SelectedPlan
    },
    setManagementData(state, { manage }){
      state.managementData = manage
    },
    initialLoadingDone(state){
      state.initialLoading = true
    }
  },
  actions:{
    async pullManagementData({ commit }){
      const manage = await manageService.list();
      commit({ type: 'setManagementData', manage });
    },
    async updateManagementData({ commit }, { manage }){
      const newManage = await manageService.update(manage);
      commit({ type: 'setManagementData', newManage });
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

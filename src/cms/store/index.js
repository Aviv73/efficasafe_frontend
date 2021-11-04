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
import { statisticsService } from '@/cms/services/statistics.service'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    materialNamesMap: null,
    isScreenNarrow: null,
    hasFailedTasks: false,
    posSuppIds: [],
    posBoostersCountMap:{},
    posBoostersCount: 0,
    posSuppBoostersCountMap:{},
    posSuppBoostersCount: 0,
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
    },
    getPosBoostersCount(state){
      return state.posBoostersCount
    },
    getPosSuppBoostersCount(state){
      return state.posSuppBoostersCount
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
      state.posBoostersCountMap = {}
      state.posBoostersCount = 0
      state.posSuppBoostersCountMap = {}
      state.posSuppBoostersCount = 0
    },
    setPosSuppBoostersCount(state, {data}){
      if(data.name.includes('&')) return
      state.posBoostersCountMap[data.name] = data.count
      state.posBoostersCount =  Object.values(state.posBoostersCountMap).reduce((acc, num) => {
          acc += num
          return acc
      }, 0)
      const material = materialStore.state.materials.find(mat => mat.name === data.name)
      if(material && material.type !== 'drug'){
        state.posSuppBoostersCountMap[data.name] = data.count
        state.posSuppBoostersCount =  Object.values(state.posSuppBoostersCountMap).reduce((acc, num) => {
            acc += num
            return acc
        }, 0)
      }
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
    },
    async countSearches(action, { query }){
      await statisticsService.addSearch(query)
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

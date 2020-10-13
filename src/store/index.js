import Vue from 'vue'
import Vuex from 'vuex'
import { userStore } from './modules/user.store'
import { materialStore } from './modules/material.store'
import { labelStore } from './modules/label.store'
import { interactionStore } from './modules/interaction.store'
import { archiveStore } from './modules/archive.store'
import { referenceStore } from './modules/reference.store'
import { atcStore } from './modules/atc.store'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    userStore,
    materialStore,
    labelStore,
    interactionStore,
    archiveStore,
    referenceStore,
    atcStore
  }
})

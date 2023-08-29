import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/cms/store'
// import Home from '../views/Home';
// import materialApp from '../views/material/MaterialApp';
// import materialEdit from '../views/material/MaterialEdit';
// import materialDetails from '../views/material/MaterialDetails';
// import LabelApp from '../views/label/LabelApp';
// import labelEdit from '../views/label/LabelEdit';
// import labelDetails from '../views/label/LabelDetails';
// import UserApp from '../views/user/UserApp';
// import UserEdit from '../views/user/UserEdit';
// import interactionApp from '../views/interaction/InteractionApp';
// import interactionEdit from '../views/interaction/InteractionEdit';
// import interactionDetails from '../views/interaction/InteractionDetails';
// import vInteractionDetails from '@/cms/views/interaction/VinteractionDetails';
// import featuredInteractionApp from '@/cms/views/featured-interaction/FeaturedInteractionApp';
// import DrugBankWtmApp from '@/cms/views/drug-bank-wtm/DrugBankWtmAppKeepAlive';
// import featuredInteractionEdit from '@/cms/views/featured-interaction/FeaturedInteractionEdit';
// import archiveApp from '../views/archive/ArchiveApp';
// import DataIntegrity from '@/cms/views/DataIntegrity';
// import searchEngine from '@/cms/views/SearchEngine';
// import resultList from '@/cms/cmps/search-engine/ResultList';
// import dBankResultList from '@/cms/cmps/search-engine/DBankResultList';
// import dBankInteractionDetails from '@/cms/views/DBankInteractionDetails';
// import UploadData from '@/cms/views/UploadData';
// import Management from '@/cms/views/Management';
// import Statistics from '@/cms/views/Statistics';
// import Formulas from '@/cms/views/Formulas';
// import Coupon from '@/cms/views/Coupon';
const Home = () => import(/* webpackChunkName: "home" */ '../views/Home')
const Management = () => import(/* webpackChunkName: "management" */ '@/cms/views/Management')
const Statistics = () => import(/* webpackChunkName: "statistics" */ '@/cms/views/Statistics')
const Coupon = () => import(/* webpackChunkName: "coupon" */ '@/cms/views/Coupon')
const materialApp = () => import(/* webpackChunkName: "material" */ '../views/material/MaterialApp')
const materialEdit = () => import(/* webpackChunkName: "material" */ '../views/material/MaterialEdit')
const materialDetails = () => import(/* webpackChunkName: "material" */ '../views/material/MaterialDetails')
const LabelApp = () => import(/* webpackChunkName: "label" */ '../views/label/LabelApp')
const labelEdit = () => import(/* webpackChunkName: "label" */ '../views/label/LabelEdit')
const labelDetails = () => import(/* webpackChunkName: "label" */ '../views/label/LabelDetails')
const UserApp = () => import(/* webpackChunkName: "user" */ '../views/user/UserApp')
const UserEdit = () => import(/* webpackChunkName: "user" */ '../views/user/UserEdit')
const interactionApp = () => import(/* webpackChunkName: "interaction" */ '../views/interaction/InteractionApp')
const interactionEdit = () => import(/* webpackChunkName: "interaction" */ '../views/interaction/InteractionEdit')
const interactionDetails = () => import(/* webpackChunkName: "interaction" */ '../views/interaction/InteractionDetails')
const vInteractionDetails = () => import(/* webpackChunkName: "interaction" */ '@/cms/views/interaction/VinteractionDetails')
const featuredInteractionApp = () => import(/* webpackChunkName: "featured-interaction" */ '@/cms/views/featured-interaction/FeaturedInteractionApp')
const DrugBankWtmApp = () => import(/* webpackChunkName: "drug-bank-wtm" */ '@/cms/views/drug-bank-wtm/DrugBankWtmAppKeepAlive')
const featuredInteractionEdit = () => import(/* webpackChunkName: "featured-interaction" */ '@/cms/views/featured-interaction/FeaturedInteractionEdit')
const archiveApp = () => import(/* webpackChunkName: "archive" */ '../views/archive/ArchiveApp')
const DataIntegrity = () => import(/* webpackChunkName: "data-integrity" */ '@/cms/views/DataIntegrity')
const searchEngine = () => import(/* webpackChunkName: "search" */ '@/cms/views/SearchEngine')
const resultList = () => import(/* webpackChunkName: "search" */ '@/cms/cmps/search-engine/ResultList')
const dBankResultList = () => import(/* webpackChunkName: "search" */ '@/cms/cmps/search-engine/DBankResultList')
const dBankInteractionDetails = () => import(/* webpackChunkName: "dbank-interaction" */ '@/cms/views/DBankInteractionDetails')
const UploadData = () => import(/* webpackChunkName: "upload" */ '@/cms/views/UploadData')
const Formulas = () => import(/* webpackChunkName: "formulas" */ '@/cms/views/Formulas')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/management',
    name: 'Management',
    component: Management,
    meta: { allowed: ['admin'] },
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
    meta: { allowed: ['admin'] },
  },
  {
    path: '/coupon',
    name: 'Coupon',
    component: Coupon,
    meta: { allowed: ['admin'] },
  },
  {
    path: '/material',
    name: 'Materials',
    component: materialApp,
    meta: { allowed: ['admin', 'editor'] },
  },
  {
    path: '/material/edit/:id?',
    name: 'MaterialEdit',
    component: materialEdit,
    meta: { allowed: ['admin', 'editor'] },
  },
  {
    path: '/material/:id',
    name: 'MaterialDetails',
    component: materialDetails,
    meta: { allowed: ['admin', 'editor'] },
  },
  {
    path: '/label',
    name: 'Labels',
    component: LabelApp,
    meta: { allowed: ['admin', 'editor', 'assistantEditor'] },
  },
  {
    path: '/label/edit/:id?',
    name: 'LabelEdit',
    component: labelEdit,
    meta: { allowed: ['admin', 'editor', 'assistantEditor'] },
  },
  {
    path: '/label/:id',
    name: 'LabelDetails',
    component: labelDetails,
    meta: { allowed: ['admin', 'editor', 'assistantEditor'] },
  },
  {
    path: '/user',
    name: 'Users',
    component: UserApp,
    meta: { allowed: ['admin', 'sales'] },
  },
  {
    path: '/user/edit/:id',
    name: 'UserEdit',
    component: UserEdit,
    meta: { allowed: ['admin', 'sales'] },
  },
  {
    path: '/interaction',
    name: 'Interactions',
    component: interactionApp,
    meta: { allowed: ['admin', 'editor'] },
  },
  {
    path: '/interaction/edit/:id?',
    name: 'InteractionsEdit',
    component: interactionEdit,
    meta: { allowed: ['admin', 'editor'] },
  },
  {
    path: '/interaction/:id/:matId',
    name: 'vInteractionsDetails',
    component: vInteractionDetails,
    meta: { allowed: ['admin', 'editor'] },
  },
  {
    path: '/interaction/:id',
    name: 'InteractionsDetails',
    component: interactionDetails,
    meta: { allowed: ['admin', 'editor'] },
  },
  {
    path: '/featured-interaction',
    name: 'FeaturedInteraction',
    component: featuredInteractionApp,
    meta: { allowed: ['admin', 'editor', 'assistantEditor'] },
  },
  {
    path: '/drug-bank-wtm',
    name: 'DrugBankWtmApp',
    component: DrugBankWtmApp,
    meta: { allowed: ['admin', 'editor', 'assistantEditor'] },
    keepAlive: true,
  },
  {
    path: '/featured-interaction/edit/:id',
    name: 'FeaturedInteractionEdit',
    component: featuredInteractionEdit,
    meta: { allowed: ['admin', 'editor', 'assistantEditor'] },
  },
  {
    path: '/featured-interaction/:id',
    name: 'FeaturedInteractionDetails',
    component: dBankInteractionDetails,
    meta: { allowed: ['admin', 'editor', 'assistantEditor'] },
  },
  {
    path: '/archive',
    name: 'Archives',
    component: archiveApp,
    meta: { allowed: ['admin'] },
  },
  {
    path: '/archive/label/:id',
    name: 'ArchiveLabelDetails',
    component: labelDetails,
    meta: { allowed: ['admin'] },
  },
  {
    path: '/archive/interaction/:id',
    name: 'ArchiveInteractionDetails',
    component: interactionDetails,
    meta: { allowed: ['admin'] },
  },
  {
    path: '/archive/material/:id',
    name: 'ArchiveMaterialDetails',
    component: materialDetails,
    meta: { allowed: ['admin'] },
  },
  {
    path: '/data-integrity',
    name: 'DataIntegrity',
    component: DataIntegrity,
    meta: { allowed: ['admin', 'editor'] },
  },
  {
    path: '/search',
    component: searchEngine,
    meta: { allowed: ['admin', 'editor'] },
    children: [
      {
        path: '',
        name: 'Results',
        component: resultList,
        meta: { allowed: ['admin', 'editor'] },
      },
      {
        path: 'drug-bank',
        name: 'DBankResults',
        component: dBankResultList,
        meta: { allowed: ['admin', 'editor'] },
      },
    ],
  },
  {
    path: '/d-bank-interaction/:id',
    name: 'DBankInteractionDetails',
    component: dBankInteractionDetails,
    meta: { allowed: ['admin', 'editor'] },
  },
  {
    path: '/upload-data',
    name: 'UploadData',
    component: UploadData,
    meta: { allowed: ['admin', 'editor'] },
  },
  {
    path: '/formulas',
    name: 'Formulas',
    component: Formulas,
    meta: { allowed: ['admin', 'editor'] },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: '/cms/',
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (!store.state.userStore.loggedInUser) {
    await store.dispatch('getUserInfo')
  }
  const { loggedInUser } = store.state.userStore
  if (loggedInUser && (loggedInUser.role === 'admin' || loggedInUser.role === 'editor' || loggedInUser.role === 'sales' || loggedInUser.role === 'assistantEditor')) {
    if (to.meta.allowed) {
      if (!to.meta.allowed.includes(loggedInUser.role)) {
        next({ name: 'Home' })
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    window.location.replace(`${window.location.origin}/404`)
  }
})

export default router

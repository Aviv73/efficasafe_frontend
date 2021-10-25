import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/cms/store';
import Home from '../views/Home';
import materialApp from '../views/material/MaterialApp';
import materialEdit from '../views/material/MaterialEdit';
import materialDetails from '../views/material/MaterialDetails';
import LabelApp from '../views/label/LabelApp';
import labelEdit from '../views/label/LabelEdit';
import labelDetails from '../views/label/LabelDetails';
import UserApp from '../views/user/UserApp';
import UserEdit from '../views/user/UserEdit';
import interactionApp from '../views/interaction/InteractionApp';
import interactionEdit from '../views/interaction/InteractionEdit';
import interactionDetails from '../views/interaction/InteractionDetails';
import vInteractionDetails from '@/cms/views/interaction/VinteractionDetails';
import featuredInteractionApp from '@/cms/views/featured-interaction/FeaturedInteractionApp';
import featuredInteractionEdit from '@/cms/views/featured-interaction/FeaturedInteractionEdit';
import archiveApp from '../views/archive/ArchiveApp';
import DataIntegrity from '@/cms/views/DataIntegrity';
import searchEngine from '@/cms/views/SearchEngine';
import resultList from '@/cms/cmps/search-engine/ResultList';
import dBankResultList from '@/cms/cmps/search-engine/DBankResultList';
import dBankInteractionDetails from '@/cms/views/DBankInteractionDetails';
import UploadData from '@/cms/views/UploadData';
import Management from '@/cms/views/Management';
import Coupon from '@/cms/views/Coupon';


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/management',
    name: 'Management',
    component: Management,
    meta: { allowed: ['admin'] }
  },
  {
    path: '/coupon',
    name: 'Coupon',
    component: Coupon,
    meta: { allowed: ['admin'] }
  },
  {
    path: '/material',
    name: 'Materials',
    component: materialApp,
    meta: { allowed: ['admin', 'editor']}
  },
  {
    path: '/material/edit/:id?',
    name: 'MaterialEdit',
    component: materialEdit,
    meta: { allowed: ['admin', 'editor'] }
  },
  {
    path: '/material/:id',
    name: 'MaterialDetails',
    component: materialDetails,
    meta: { allowed: ['admin', 'editor'] }
  },
  {
    path: '/label',
    name: 'Labels',
    component: LabelApp,
    meta: { allowed: ['admin', 'editor', 'assistantEditor'] }
  },
  {
    path: '/label/edit/:id?',
    name: 'LabelEdit',
    component: labelEdit,
    meta: { allowed: ['admin', 'editor', 'assistantEditor'] }
  },
  {
    path: '/label/:id',
    name: 'LabelDetails',
    component: labelDetails,
    meta: { allowed: ['admin', 'editor', 'assistantEditor'] }
  },
  {
    path: '/user',
    name: 'Users',
    component: UserApp,
    meta: { allowed: ['admin', 'sales'] }
  },
  {
    path: '/user/edit/:id',
    name: 'UserEdit',
    component: UserEdit,
    meta: { allowed: ['admin', 'sales'] }
  },
  {
    path: '/interaction',
    name: 'Interactions',
    component: interactionApp,
    meta: { allowed: ['admin', 'editor'] }
  },
  {
    path: '/interaction/edit/:id?',
    name: 'InteractionsEdit',
    component: interactionEdit,
    meta: { allowed: ['admin', 'editor'] }
  },
  {
    path: '/interaction/:id/:matId',
    name: 'vInteractionsDetails',
    component: vInteractionDetails,
    meta: { allowed: ['admin', 'editor'] }
  },
  {
    path: '/interaction/:id',
    name: 'InteractionsDetails',
    component: interactionDetails,
    meta: { allowed: ['admin', 'editor'] }
  },
  {
    path: '/featured-interaction',
    name: 'FeaturedInteraction',
    component: featuredInteractionApp,
    meta: { allowed: ['admin', 'editor', 'assistantEditor'] }
  },
  {
    path: '/featured-interaction/edit/:id',
    name: 'FeaturedInteractionEdit',
    component: featuredInteractionEdit,
    meta: { allowed: ['admin', 'editor', 'assistantEditor'] }
  },
  {
    path: '/featured-interaction/:id',
    name: 'FeaturedInteractionDetails',
    component: dBankInteractionDetails,
    meta: { allowed: ['admin', 'editor', 'assistantEditor'] }
  },
  {
    path: '/archive',
    name: 'Archives',
    component: archiveApp,
    meta: { allowed: ['admin'] }
  },
  {
    path: '/archive/label/:id',
    name: 'ArchiveLabelDetails',
    component: labelDetails,
    meta: { allowed: ['admin'] }
  },
  {
    path: '/archive/interaction/:id',
    name: 'ArchiveInteractionDetails',
    component: interactionDetails,
    meta: { allowed: ['admin'] }
  },
  {
    path: '/archive/material/:id',
    name: 'ArchiveMaterialDetails',
    component: materialDetails,
    meta: { allowed: ['admin'] }
  },
  {
    path: '/data-integrity',
    name: 'DataIntegrity',
    component: DataIntegrity,
    meta: { allowed: ['admin', 'editor'] }
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
        meta: { allowed: ['admin', 'editor'] }
      },
      {
        path: 'drug-bank',
        name: 'DBankResults',
        component: dBankResultList,
        meta: { allowed: ['admin', 'editor'] }
      }
    ]
  },
  {
    path: '/d-bank-interaction/:id',
    name: 'DBankInteractionDetails',
    component: dBankInteractionDetails,
    meta: { allowed: ['admin', 'editor'] }
  },
  {
    path: '/upload-data',
    name: 'UploadData',
    component: UploadData,
    meta: { allowed: ['admin', 'editor'] }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/cms/',
  routes
})

router.beforeEach(async (to, from, next) => {
  await store.dispatch('getUserInfo');
  const { loggedInUser } = store.state.userStore;
  if (loggedInUser && (loggedInUser.role === 'admin' || loggedInUser.role === 'editor' || loggedInUser.role === 'sales' || loggedInUser.role === 'assistantEditor')) {
    if (to.meta.allowed) {
      if(!to.meta.allowed.includes(loggedInUser.role)){
        next({ name: 'Home' });
      }else{
        next();
      }
    } else {
      next();
    }
  } else {
    window.location.replace(`${window.location.origin}/404`);
  }
});

export default router;

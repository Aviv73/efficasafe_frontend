import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/cms/store';
import Home from '../views/Home';
import LoginPage from '../views/LoginPage';
import materialApp from '../views/material/MaterialApp';
import materialEdit from '../views/material/MaterialEdit';
import materialDetails from '../views/material/MaterialDetails';
import LabelApp from '../views/label/LabelApp';
import labelEdit from '../views/label/LabelEdit';
import labelDetails from '../views/label/LabelDetails';
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

Vue.use(VueRouter);

const routes = [
  {
    path: '/cms',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/cms/material',
    name: 'Materials',
    component: materialApp,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/material/edit/:id?',
    name: 'MaterialEdit',
    component: materialEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/material/:id',
    name: 'MaterialDetails',
    component: materialDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/label',
    name: 'Labels',
    component: LabelApp,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/label/edit/:id?',
    name: 'LabelEdit',
    component: labelEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/label/:id',
    name: 'LabelDetails',
    component: labelDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/interaction',
    name: 'Interactions',
    component: interactionApp,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/interaction/edit/:id?',
    name: 'InteractionsEdit',
    component: interactionEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/interaction/:id/:matId',
    name: 'vInteractionsDetails',
    component: vInteractionDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/interaction/:id',
    name: 'InteractionsDetails',
    component: interactionDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/featured-interaction',
    name: 'FeaturedInteraction',
    component: featuredInteractionApp,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/featured-interaction/edit/:id',
    name: 'FeaturedInteractionEdit',
    component: featuredInteractionEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/featured-interaction/:id',
    name: 'FeaturedInteractionDetails',
    component: dBankInteractionDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/archive',
    name: 'Archives',
    component: archiveApp,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/cms/archive/label/:id',
    name: 'ArchiveLabelDetails',
    component: labelDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/archive/interaction/:id',
    name: 'ArchiveInteractionDetails',
    component: interactionDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/archive/material/:id',
    name: 'ArchiveMaterialDetails',
    component: materialDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/data-integrity',
    name: 'DataIntegrity',
    component: DataIntegrity,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/search',
    component: searchEngine,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Results',
        component: resultList
      },
      {
        path: 'drug-bank',
        name: 'DBankResults',
        component: dBankResultList
      }
    ]
  },
  {
    path: '/cms/d-bank-interaction/:id',
    name: 'DBankInteractionDetails',
    component: dBankInteractionDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    if (store.state.userStore.loggedInUser.role !== 'admin') {
      next({ name: 'Home' });
    } else {
      next();
    }
  }
  if (to.meta.requiresAuth) {
    if (!store.state.userStore.loggedInUser) {
      next({
        name: 'Login'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

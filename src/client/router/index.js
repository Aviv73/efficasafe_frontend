import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import SearchEngine from '../views/SearchEngine';
import InteractionDetails from '../views/InteractionDetails';
import ForgotPass from '../views/auth/ForgotPass.vue';
import ForgotPasswordEmail from '../views/auth/ForgotPasswordEmail.vue';
import VerifyEmail from '../views/auth/VerifyEmail.vue';
import DBankInteractionDetails from '../views/DBankInteractionDetails';
import UserAccount from '@/client/views/UserAccount';

import InteractionList from '@/client/cmps/search-engine/InteractionList';
import UserApp from '@/client/cmps/user-account/UserApp';
import UserEdit from '@/client/cmps/user-account/UserEdit';


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/verifyEmail/:token',
    name: 'verifyEmail',
    component: VerifyEmail
  },
  {
    path: '/emailPassword',
    name: 'emailPassword',
    component: ForgotPasswordEmail
  },
  {
    path: '/forgotPass/:token',
    name: 'ForgotPass',
    component: ForgotPass
  },
  {
    path: '/search',
    component: SearchEngine,
    children: [
      {
        path: '',
        name: 'Supp2Drug',
        component: InteractionList
      },
      {
        path: 'drug2drug',
        name: 'Drug2Drug',
        component: InteractionList
      },
      {
        path: 'positive-boosters',
        name: 'Boosters',
        component: InteractionList
      },
      {
        path: 'what-to-monitor',
        name: 'Monitor',
        component: InteractionList
      }
    ]
  },
  {
    path: '/interaction/drug2drug/:id',
    name: 'Drug2DrugInteractionDetails',
    component: DBankInteractionDetails
  },
  {
    path: '/interaction/:id',
    name: 'InteractionDetails',
    component: InteractionDetails
  },
  {
    path: '/interaction/:id/:matId',
    name: 'VinteractionDetails',
    component: InteractionDetails
  },
  {
    path: '/account',
    component: UserAccount,
    children: [
      {
        path: '',
        name: 'Searches',
        component: UserApp
      },
      {
        path: 'purchases',
        name: 'Purchases',
        component: UserApp
      },
      {
        path: 'edit',
        name: 'UserEdit',
        component: UserEdit
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: 'about' */ '../views/About')
  },
  {
    path: '/principles-and-processes',
    name: 'PrinciplesAndProcesses',
    component: () => import(/* webpackChunkName: 'principles-and-processes' */ '../views/PrinciplesAndProcesses')
  },
  {
    path: '/terms-and-conditions',
    name: 'TermsAndConditions',
    component: () => import(/* webpackChunkName: 'terms-and-conditions' */ '../views/TermsAndConditions')
  },
  {
    path: '/privacy-statement',
    name: 'PrivacyStatement',
    component: () => import(/* webpackChunkName: 'privacy-statement' */ '../views/PrivacyStatement')
  },
  {
    path: '/contact',
    name: 'ContactUs',
    component: () => import(/* webpackChunkName: 'contact-us' */ '../views/ContactUs')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkExactActiveClass: 'exact-active',
  routes
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  next();
});

export default router;

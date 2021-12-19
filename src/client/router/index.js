import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/cms/store';
import Home from '@/client/views/Home.vue';
import SearchEngine from '@/client/views/SearchEngine';
import InteractionDetails from '@/client/views/InteractionDetails';
import MaterialDetails from '@/client/views/MaterialDetails';
import ResetPassForm from '@/client/views/auth/ResetPassForm.vue';
import SendPassResetForm from '@/client/views/auth/SendPassResetForm.vue';
import VerifyEmail from '@/client/views/auth/VerifyEmail.vue';
import DBankInteractionDetails from '@/client/views/DBankInteractionDetails';
import UserAccount from '@/client/views/UserAccount';
import Logo from '@/client/views/Logo';
import ManageEmails from '@/client/views/ManageEmails';
import CookiePolicy from '@/client/views/CookiePolicy';
// import Subscribe from '@/client/views/Subscribe';
// import Payment from '@/client/views/Payment';
// import PaymentFailed from '@/client/views/PaymentFailed';
// import Success from '@/client/views/Success';

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
    path: '/logo',
    name: 'Logo',
    component: Logo
  },
  {
    path: '/cookie-policy',
    name: 'CookiePolicy',
    component: CookiePolicy
  },
  // {
  //   path: '/subscribe',
  //   name: 'Subscribe',
  //   component: Subscribe,
  //   meta: {
  //     blockSubscribed: true
  //   }
  // },
  // {
  //   path: '/payment',
  //   name: 'Payment',
  //   component: Payment,
  //   meta: {
  //     blockSubscribed: true
  //   }
  // },
  // {
  //   path: '/payment-failed',
  //   name: 'paymentFailed',
  //   component: PaymentFailed
  // },
  // {
  //   path: '/success',
  //   name: 'Success',
  //   component: Success
  // },
  {
    path: '/verifyEmail/:token',
    name: 'verifyEmail',
    component: VerifyEmail
  },
  {
    path: '/email-pass',
    name: 'email-pass',
    component: SendPassResetForm
  },
  {
    path: '/manage-emails',
    name: 'manage-emails',
    component: ManageEmails
  },
  {
    path: '/reset-pass/:token',
    name: 'ResetPassForm',
    component: ResetPassForm
  },
  {
    path: '/search',
    component: SearchEngine,
    children: [
      {
        path: '/search',
        name: 'Results',
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
    path: '/material/:id',
    name: 'MaterialDetails',
    component: MaterialDetails
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
        component: UserApp,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'purchases',
        name: 'Purchases',
        component: UserApp,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'edit',
        name: 'UserEdit',
        component: UserEdit,
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: ''
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
    path: '/we-are-better-hebrew',
    name: 'WeAreBetterHebrew',
    component: () => import(/* webpackChunkName: 'we-are-better-hebrew' */ '../views/WeAreBetterHebrew')
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
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: () => import(/* webpackChunkName: 'contact-us' */ '../views/PageNotFound'),
    meta: {
      requiresAuth: false
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkExactActiveClass: 'exact-active',
  routes
});

router.beforeEach(async (to, from, next) => {
  store.dispatch('getUserInfo');
  store.dispatch('getUserSearches');
  if(store.getters.loggedInUser && store.getters.loggedInUser.type === 'subscribed'){
    const user = JSON.parse(JSON.stringify(store.getters.loggedInUser))
    if(user.purchases.length && typeof user.purchases[0].until === 'number' && user.purchases[0].until < Date.now()){
      user.purchases[0].until = 'Done'
      user.type = 'registered'
      user.trialTime = null
      await store.dispatch({ type: 'updateLoggedInUser', user });
      user.type = 'was subscribed'
      await this.$store.dispatch({ type: 'updateAutoPilotContact', user});
    }
  }
  if (to.meta.requiresAuth) {
    if (store.getters.loggedInUser) next();
    else next({ name: 'Home' });
  }
  if(to.meta.blockSubscribed){
    if (store.getters.loggedInUser && store.getters.loggedInUser.type === 'subscribed') next({ name: 'Home' });
  }
  window.scrollTo(0, 0);
  next();
});

export default router;

import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/cms/store'
// import Home from '@/client/views/Home.vue'
// import SearchEngine from '@/client/views/SearchEngineKeepAlive'
// import InteractionDetails from '@/client/views/InteractionDetails'
// import MaterialDetails from '@/client/views/MaterialDetails'
// import ResetPassForm from '@/client/views/auth/ResetPassForm.vue'
// import SendPassResetForm from '@/client/views/auth/SendPassResetForm.vue'
// import VerifyEmail from '@/client/views/auth/VerifyEmail.vue'
// import Failed from '@/client/views/Failed.vue'
// import DBankInteractionDetails from '@/client/views/DBankInteractionDetails'
// import UserAccount from '@/client/views/UserAccount'
// import Logo from '@/client/views/Logo'
// import ManageEmails from '@/client/views/ManageEmails'
// import CookiePolicy from '@/client/views/CookiePolicy'
// import Subscribe from '@/client/views/Subscribe'
// import PaymentFailed from '@/client/views/PaymentFailed'
// import Features from '@/client/views/Features'
// import Success from '@/client/views/Success'
// import BonusTrialTime from '@/client/views/BonusTrialTime'
// import Whiteboard from '@/client/views/Whiteboard'

import InteractionList from '@/client/cmps/search-engine/InteractionList'
import UserApp from '@/client/cmps/user-account/UserApp'
// import UserEdit from '@/client/cmps/user-account/UserEdit'
// import MainIndex from '@/client/views/index/MainIndex'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/client/views/Home.vue'),
  },
  {
    path: '/logo',
    name: 'Logo',
    component: () => import(/* webpackChunkName: "logo" */ '@/client/views/Logo.vue'),
  },
  {
    path: '/cookie-policy',
    name: 'CookiePolicy',
    // component: CookiePolicy
    component: () => import(/* webpackChunkName: 'cookiePolicy' */ '@/client/views/CookiePolicy.vue'),
  },
  {
    path: '/subscribe',
    name: 'Subscribe',
    component: () => import(/* webpackChunkName: 'subscribe' */ '@/client/views/Subscribe.vue'),
    meta: {
      blockSubscribed: true,
    },
  },
  {
    path: '/payment-failed',
    name: 'paymentFailed',
    component: () => import(/* webpackChunkName: "paymentFailed" */ '@/client/views/PaymentFailed.vue'),
  },
  {
    path: '/features',
    name: 'features',
    component: () => import(/* webpackChunkName: "features" */ '@/client/views/Features.vue'),
  },
  {
    path: '/success',
    name: 'Success',
    component: () => import(/* webpackChunkName: "success" */ '@/client/views/Success.vue'),
  },
  {
    path: '/bonus-trial-time',
    name: 'BonusTrialTime',
    component: () => import(/* webpackChunkName: "bonusTrialTime" */ '@/client/views/BonusTrialTime.vue'),
  },
  {
    path: '/whiteboard',
    name: 'Whiteboard',
    component: () => import(/* webpackChunkName: "whiteboard" */ '@/client/views/Whiteboard.vue'),
  },
  {
    path: '/verifyEmail/:token',
    name: 'verifyEmail',
    component: () => import(/* webpackChunkName: "verifyEmail" */ '@/client/views/auth/VerifyEmail.vue'),
  },
  {
    path: '/failed',
    name: 'failed',
    component: () => import(/* webpackChunkName: "failed" */ '@/client/views/Failed.vue'),
  },
  {
    path: '/email-pass',
    name: 'email-pass',
    component: () => import(/* webpackChunkName: "emailPass" */ '@/client/views/auth/SendPassResetForm.vue'),
  },
  {
    path: '/manage-emails',
    name: 'manage-emails',
    component: () => import(/* webpackChunkName: "manageEmails" */ '@/client/views/ManageEmails.vue'),
  },
  {
    path: '/reset-pass/:token',
    name: 'ResetPassForm',
    component: () => import(/* webpackChunkName: "resetPass" */ '@/client/views/auth/ResetPassForm.vue'),
  },
  {
    path: '/search',
    // component: SearchEngine,
    component: () => import(/* webpackChunkName: "searchEngine" */ '@/client/views/SearchEngineKeepAlive'),
    keepAlive: true,
    children: [
      {
        path: '/search',
        name: 'Results',
        component: InteractionList,
        // component: () => import(/* webpackChunkName: "searchEngine" */ '@/client/cmps/search-engine/InteractionList'),
      },
      {
        path: 'positive-boosters',
        name: 'Boosters',
        component: InteractionList,
      },
      {
        path: 'what-to-monitor',
        name: 'Monitor',
        component: InteractionList,
      },
    ],
  },
  {
    path: '/interaction/drug2drug/:id',
    name: 'Drug2DrugInteractionDetails',
    component: () => import(/* webpackChunkName: "drug2DrugInteractionDetails" */ '@/client/views/DBankInteractionDetails.vue'),
  },
  {
    path: '/interaction/:id',
    name: 'InteractionDetails',
    component: () => import(/* webpackChunkName: "interactionDetails" */ '@/client/views/InteractionDetails.vue'),
  },
  {
    path: '/material/:id',
    name: 'MaterialDetails',
    component: () => import(/* webpackChunkName: "materialDetails" */ '@/client/views/MaterialDetails.vue'),
    meta: {
      isGetUser: true,
    },
  },
  {
    path: '/interaction/:id/:matId',
    name: 'VinteractionDetails',
    component: () => import(/* webpackChunkName: "vinteractionDetails" */ '@/client/views/InteractionDetails.vue'),
  },
  {
    path: '/account',
    component: () => import(/* webpackChunkName: "userAccount" */ '@/client/views/UserAccount.vue'),
    children: [
      {
        path: '',
        name: 'Searches',
        component: UserApp,
        meta: {
          requiresAuth: true,
          isGetUser: true,
        },
      },
      {
        path: 'purchases',
        name: 'Purchases',
        component: UserApp,
        meta: {
          requiresAuth: true,
          isGetUser: true,
        },
      },
      {
        path: 'edit',
        name: 'UserEdit',
        component: () => import(/* webpackChunkName: "userEdit" */ '@/client/cmps/user-account/UserEdit.vue'),
        meta: {
          requiresAuth: true,
          isGetUser: true,
        },
      },
    ],
  },
  {
    path: '/index',
    name: 'index',
    component: () => import(/* webpackChunkName: "mainIndex" */ '@/client/views/index/MainIndex.vue'),
  },
  {
    path: '',
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: 'about' */ '../views/About'),
  },
  {
    path: '/inspiration2022',
    name: 'Inspiration',
    component: () => import(/* webpackChunkName: 'we-are-better-hebrew' */ '../views/inspiration'),
  },
  {
    path: '/broshim',
    name: 'Broshim',
    component: () => import(/* webpackChunkName: 'we-are-better-hebrew' */ '../views/inspiration'),
  },
  {
    path: '/we-are-better',
    name: 'WeAreBetter',
    component: () => import(/* webpackChunkName: 'we-are-better-hebrew' */ '../views/WeAreBetter'),
  },
  {
    path: '/we-are-better-hebrew',
    name: 'WeAreBetterHebrew',
    component: () => import(/* webpackChunkName: 'we-are-better-hebrew' */ '../views/WeAreBetterHebrew'),
  },
  {
    path: '/principles-and-processes',
    name: 'PrinciplesAndProcesses',
    component: () => import(/* webpackChunkName: 'principles-and-processes' */ '../views/PrinciplesAndProcesses'),
  },
  {
    path: '/terms-and-conditions',
    name: 'TermsAndConditions',
    component: () => import(/* webpackChunkName: 'terms-and-conditions' */ '../views/TermsAndConditions'),
  },
  {
    path: '/privacy-statement',
    name: 'PrivacyStatement',
    component: () => import(/* webpackChunkName: 'privacy-statement' */ '../views/PrivacyStatement'),
  },
  {
    path: '/contact',
    name: 'ContactUs',
    component: () => import(/* webpackChunkName: 'contact-us' */ '../views/ContactUs'),
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: 'contact-us' */ '../views/PageNotFound'),
    meta: {
      requiresAuth: false,
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkExactActiveClass: 'exact-active',
  routes,
})

router.beforeEach(async (to, from, next) => {
  await store.dispatch('getUserInfo')
  if (to.meta.isGetUser) {
    next(addUtmToUrlQuery(to, from, store))
  }
  if (to.meta.requiresAuth) {
    if (store.getters.loggedInUser) next(addUtmToUrlQuery(to, from, store))
    else next({ name: 'Home' })
  }
  if (to.meta.blockSubscribed) {
    // if (store.getters.loggedInUser && store.getters.loggedInUser.type === 'subscribed') next({ name: 'Home' });
    if (store.getters.loggedInUser && store.getters.loggedInUser.purchases?.find((c) => c.until === 'Onging')) next({ name: 'Home' })
  }
  window.scrollTo(0, 0)
  next(addUtmToUrlQuery(to, from, store))
})

router.afterEach((to) => {
  window.dataLayer.push({ event: 'customPage', virtualPagePath: to.fullPath })
})

export default router

function addUtmToUrlQuery(to, from, store) {
  // if (Date) return undefined;
  const loggedInUser = store.getters.loggedInUser
  if (!loggedInUser) return
  const utmVal = { utm_source: loggedInUser.organization, utm_medium: loggedInUser._id }
  // `${loggedInUser.organization || 'UNKNOWN_ORGANIZATION'}-${loggedInUser._id}`
  if (compareObj(utmVal, to.query)) return
  return { ...to, query: { ...(to.query || {}), ...utmVal } }
}

function compareObj(obj = {}, compareTo = {}) {
  for (let key in obj) {
    if (compareTo[key] !== obj[key]) return false
  }
  return true
}

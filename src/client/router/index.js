import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import SearchEngine from '../views/SearchEngine';
import InteractionDetails from '../views/InteractionDetails';
import ForgotPass from '../views/auth/ForgotPass.vue'
import ForgotPasswordEmail from '../views/auth/ForgotPasswordEmail.vue'
import VerifyEmail from '../views/auth/VerifyEmail.vue'

import InteractionList from '@/client/cmps/search-engine/InteractionList';


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
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: 'about' */ '../views/About.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkExactActiveClass: 'exact-active',
  routes
});

export default router;

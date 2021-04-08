import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import SearchEngine from '../views/SearchEngine';

import Supplement2DrugPage from '@/client/cmps/search-engine/Supplement2DrugPage';
import Drug2DrugPage from '@/client/cmps/search-engine/Drug2DrugPage';
import BoostersPage from '@/client/cmps/search-engine/BoostersPage';
import MonitorPage from '@/client/cmps/search-engine/MonitorPage';


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/search',
    component: SearchEngine,
    children: [
      {
        path: '',
        name: 'Supp2Drug',
        component: Supplement2DrugPage
      },
      {
        path: 'drug2drug',
        name: 'Drug2Drug',
        component: Drug2DrugPage
      },
      {
        path: 'positive-boosters',
        name: 'Boosters',
        component: BoostersPage
      },
      {
        path: 'what-to-monitor',
        name: 'Monitor',
        component: MonitorPage
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

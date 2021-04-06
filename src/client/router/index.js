import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import SearchEngine from '../views/SearchEngine';

import ResultList from '@/client/cmps/search-engine/ResultList';
import DBankResultList from '@/client/cmps/search-engine/DBankResultList';


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
        name: 'ResultList',
        component: ResultList
      },
      {
        path: 'drug2drug',
        name: 'DBankResultList',
        component: DBankResultList
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

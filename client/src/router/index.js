import Vue from 'vue';
import VueRouter from 'vue-router';

import { getToken } from '@/helpers/helper';
import { R_AUTHENTICATION } from '@/router/routes';

// routes
import start from '@/router/routes/start';
import singleTransaction from '@/router/routes/single-transaction';
import authentication from '@/router/routes/authentication';
import linkedTransactions from '@/router/routes/linked-transactions';
import subscriptions from '@/router/routes/subscriptions';

const Main = () => import(/* webpackChunkName: "Main" */ '@/views/Main');

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/start',
    component: Main,
    children: [
      singleTransaction,
      linkedTransactions,
      subscriptions,
    ],
  },
  start,
  authentication,
  {
    path: '*',
    redirect: '/auth',
  },
];

const router = new VueRouter({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes,
});

router.beforeResolve((to, from, next) => {
  if (to.meta?.checkRoute) {
    const token = getToken();
    if (!token && to.name !== R_AUTHENTICATION) {
      next({
        name: R_AUTHENTICATION,
      });
      return;
    }
    if (token && router.app.$store.state?.application?.hasUnsavedChanges) {
      // eslint-disable-next-line
      const answer = window.confirm('Do you really want to leave? You have unsaved changes.');
      if (answer) {
        next();
        router.app.$store.dispatch('setChangesState', false);
      } else {
        next(false);
      }
      return;
    }
  }
  next();
});

export default router;

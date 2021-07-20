import {
  R_CREATE_SUBSCRIPTIONS,
  R_SUBSCRIPTIONS,
} from '../routes';

const Subscriptions = () => import(/* webpackChunkName: "Subscriptions" */ '@/views/Subscriptions');
const CreateSubscriptionView = () => import(/* webpackChunkName: "CreateSubscriptionView" */ '@/views/CreateSubscriptionView');

export default {
  name: R_SUBSCRIPTIONS,
  path: '/subscriptions',
  redirect: '/subscriptions',
  component: {
    render(c) {
      return c('router-view');
    },
  },
  children: [
    {
      path: '',
      meta: {
        checkRoute: true,
      },
      component: Subscriptions,
    },
    {
      name: R_CREATE_SUBSCRIPTIONS,
      path: 'create',
      meta: {
        checkRoute: true,
      },
      component: CreateSubscriptionView,
    },
  ],
};

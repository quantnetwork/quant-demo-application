import {
  R_LINKED_TRANSACTIONS,
} from '../routes';

const LinkedTransactions = () => import(/* webpackChunkName: "LinkedTransactions" */ '@/views/LinkedTransactions');

export default {
  name: R_LINKED_TRANSACTIONS,
  path: '/linked-transactions',
  meta: {
    checkRoute: true,
  },
  component: LinkedTransactions,
};

import {
  R_SINGLE_TRANSACTION,
} from '../routes';

const SingleTransaction = () => import(/* webpackChunkName: "SingleTransaction" */ '@/views/SingleTransaction');

export default {
  name: R_SINGLE_TRANSACTION,
  path: '/single-transaction',
  meta: {
    checkRoute: true,
  },
  component: SingleTransaction,
};

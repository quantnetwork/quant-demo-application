import { R_AUTHENTICATION } from '../routes';

const Authentication = () => import(/* webpackChunkName: "Authentication" */ '@/views/Authentication');

export default {
  name: R_AUTHENTICATION,
  path: '/auth',
  component: Authentication,
};

import { R_START } from '../routes';

const Start = () => import(/* webpackChunkName: "Start" */ '@/views/Start');

export default {
  name: R_START,
  path: '/start',
  component: Start,
};

import baseService from '@/services/baseService';

const url = process.env.VUE_APP_SUBSCRIPTION_UPDATE_API;

export default () => baseService({ url });

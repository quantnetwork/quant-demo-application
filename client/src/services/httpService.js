import baseService from '@/services/baseService';

const url = process.env.VUE_APP_API_HOST;

export default (version = 'v2') => baseService({ url: `${url}/${version}` });

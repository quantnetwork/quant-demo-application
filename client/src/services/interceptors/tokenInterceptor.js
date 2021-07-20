import { getToken } from '@/helpers/helper';

const tokenInterceptor = (config) => {
  const token = getToken();
  // eslint-disable-next-line no-param-reassign
  config.headers.common.authorization = `Bearer ${token}`;
  return config;
};

export default tokenInterceptor;

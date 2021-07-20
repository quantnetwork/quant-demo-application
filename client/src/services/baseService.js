import axios from 'axios';
import tokenInterceptor from '@/services/interceptors/tokenInterceptor';
import authInterceptor from '@/services/interceptors/authInterceptor';
import errorsInterseptor from '@/services/interceptors/errorsInterseptor';

export default ({ url }) => {
  const instance = axios.create({
    baseURL: url,
    headers: { Pragma: 'no-cache' },
  });
  instance.interceptors.request.use(tokenInterceptor);
  instance.interceptors.response.use((response) => response, authInterceptor);
  instance.interceptors.response.use((response) => response, errorsInterseptor);
  return instance;
};

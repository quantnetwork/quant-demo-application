import router from '@/router';
import Vue from 'vue';

const authInterceptor = (error) => {
  if (error.response && error.response.status === 401) {
    // redirect
    router.push('/auth').then(() => {
      Vue.notify({
        group: 'top-center',
        type: 'warn',
        text: 'You OAuth Token has expired. Please fill in a new token to restart the transactions.',
        duration: 5000,
      });
    });
  }
  return Promise.reject(error);
};

export default authInterceptor;

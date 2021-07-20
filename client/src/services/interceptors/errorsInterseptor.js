import Vue from 'vue';

const errorsInterceptor = (error) => {
  if (!error.response || error.response.status !== 401) {
    Vue.notify({
      group: 'top-center',
      type: 'error',
      text: 'Something went wrong',
      duration: 5000,
    });
  }
  return Promise.reject(error);
};

export default errorsInterceptor;

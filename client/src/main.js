import Notifications from 'vue-notification';
import Vue from 'vue';
import router from '@/router';
import store from '@/store';
import App from './App';

// include bootstrap modules
import './setup/bootstrapSetup';
// include validator rules
import './setup/veeValidateSetup';
// include clipboard
import './setup/clipboardSetup';

Vue.config.productionTip = false;

Vue.use(Notifications);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

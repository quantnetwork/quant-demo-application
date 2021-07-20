import Vue from 'vue';
import Vuex from 'vuex';

// modules
import application from '@/store/modules/application';
import transactions from '@/store/modules/transactions';
import singleTransaction from '@/store/modules/singleTransaction';
import linkedTransaction from '@/store/modules/linkedTransaction';
import subscriptions from '@/store/modules/subscriptions';
import createSocketPlugin from '@/store/plugins/socketStorePlugin';
import socket from '@/socket';

const socketPlugin = createSocketPlugin(socket);

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  modules: {
    application,
    transactions,
    singleTransaction,
    subscriptions,
    linkedTransaction,
  },
  plugins: [
    socketPlugin,
  ],
});

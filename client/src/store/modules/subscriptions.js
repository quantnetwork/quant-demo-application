import httpCTOR from '@/services/httpService';
import * as types from '@/store/mutationTypes';
import STATUS_TYPES from '@/constants/statuses/statusType';
import { DELETED } from '@/constants/transaction/transactionStatusTypes';

const http = httpCTOR();

const state = {
  subscriptionList: [],
  updatedSubscriptionsList: [],
};

const actions = {
  async getSubscriptions({ commit }) {
    await http.get('webhook/subscriptions', {
      data: {},
    })
      .then(({ data }) => {
        const filteredSubscriptions = data
          .filter(({ subscriptionDetails }) => subscriptionDetails?.status.value !== DELETED)
          .sort((a, b) => new Date(b.subscribedTime) - new Date(a.subscribedTime));
        commit(types.SAVE_SUBSCRIPTION_LIST, filteredSubscriptions);
      })
      .catch(() => {});
  },
  async createSubscription({ dispatch }, body) {
    await http.post('webhook/subscription', body)
      .then(() => {
        dispatch('showNotification', {
          type: STATUS_TYPES.success,
          message: 'Transaction(s) subscribed successfully!',
        });
      })
      .catch(() => Promise.reject());
  },

  async updateSubscriptionList({ dispatch }, {
    index,
    transactionId,
    showDetails,
  }) {
    await dispatch('getTransactionDetailsAction', transactionId)
      .then(({ data }) => {
        if (data) {
          dispatch('addDetailsToSubscriptionList', {
            index,
            transactionId,
            showDetails,
            technology: data.location?.technology,
            statuses: data.transactionHistory?.status.map((s) => s.value),
            timeStamp: data.transactionHistory?.status.map((s) => s.timestamp),
            status: data.status.value,
          });
        }
      })
      .catch(() => {});
  },

  async unsubscribeSubscription({ dispatch }, subId) {
    await http.delete(`webhook/subscription/${subId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {},
    })
      .then(() => {
        dispatch('showNotification', {
          type: STATUS_TYPES.success,
          message: 'Transaction unsubscribed successfully!',
        });
      })
      .catch(() => Promise.reject());
  },
  addDetailsToSubscriptionList({ commit }, data) {
    commit(types.ADD_DETAILS_SUBSCRIPTION_LIST, data);
  },
  async updateStatusesSubscription({ commit }, data) {
    commit(types.UPDATE_STATUSES_SUBSCRIPTION, data);
    commit(types.UPDATE_SUBSCRIPTION, {
      subscriptionId: data.subscriptionId,
      isUpdated: true,
    });
  },
  removeFromUpdatedSubscriptions({ commit }, subscriptionId) {
    commit(types.REMOVE_FROM_UPDATED_SUBSCRIPTIONS, subscriptionId);
    commit(types.UPDATE_SUBSCRIPTION, {
      subscriptionId,
      isUpdated: false,
    });
  },
  resetSubscriptionsList({ commit }) {
    commit(types.RESET_SUBSCRIPTIONS);
  },
};

const getters = {
  updatedSubscriptionsCount: (state) => state.updatedSubscriptionsList?.length || 0,
};

const mutations = {
  [types.SAVE_SUBSCRIPTION_LIST](state, subs) {
    if (state.updatedSubscriptionsList?.length) {
      state.subscriptionList = subs.map((s) => {
        const findUpdatedSub = state.updatedSubscriptionsList
          .find((el) => el.subscriptionId === s.subscriptionId);
        if (findUpdatedSub) {
          return {
            ...s,
            isUpdated: true,
          };
        }
        return s;
      });
      return;
    }
    state.subscriptionList = subs;
  },
  [types.ADD_DETAILS_SUBSCRIPTION_LIST](state, details) {
    state.subscriptionList = state.subscriptionList.map((el, index) => {
      if (el.subscriptionDetails.ids[0] === details.transactionId && index === details.index) {
        return {
          ...el,
          details: {
            technology: details.technology || '',
            statuses: details.statuses,
            timeStamp: details.timeStamp,
            status: details.status,
          },
          _showDetails: details.showDetails,
        };
      }
      return el;
    });
  },
  [types.UPDATE_STATUSES_SUBSCRIPTION](state, payload) {
    state.updatedSubscriptionsList.push(payload);
  },
  [types.REMOVE_FROM_UPDATED_SUBSCRIPTIONS](state, subscriptionId) {
    state.updatedSubscriptionsList = state.updatedSubscriptionsList
      .filter((s) => s.subscriptionId !== subscriptionId);
  },
  [types.UPDATE_SUBSCRIPTION](state, { subscriptionId, isUpdated }) {
    if (state.subscriptionList.length) {
      state.subscriptionList = state.subscriptionList.map((s) => {
        if (s.subscriptionId === subscriptionId) {
          return {
            ...s,
            isUpdated,
          };
        }
        return s;
      });
    }
  },
  [types.RESET_SUBSCRIPTIONS](state) {
    state.subscriptionList = [];
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};

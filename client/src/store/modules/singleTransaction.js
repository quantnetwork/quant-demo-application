import {
  CREATE_TRANSACTION,
} from '@/constants/transaction/steps';
import * as types from '@/store/mutationTypes';

const state = {
  step: CREATE_TRANSACTION,
  createTransactionFormData: {},
  transactionSucceededData: {},
  overledgerTransaction: {},
  transactionFee: {},
  transactionFullDetailsData: {},
  apiConsoleOutputData: {},
  subscribedData: {},
  signedKey: '',
  previousStep: '',
};

const actions = {
  setStepAction({ commit }, step) {
    return commit(types.SET_TRANSACTION_PAGE_STEP, step);
  },
  resetTransactionStep({ commit }) {
    commit(types.RESET_TRANSACTION_PAGE_STEP);
  },
  resetTransactionFee({ commit }) {
    commit(types.RESET_TRANSACTION_FEE);
  },
  resetApiConsoleOutput({ commit }) {
    commit(types.RESET_API_CONSOLE_OUTPUT);
  },
  logToConsole({ commit }, {
    key,
    message,
    timeout = 0,
  }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        commit(types.ADD_API_CONSOLE_OUTPUT_DATA, { key, message });
        resolve();
      }, timeout);
    });
  },
  async createTransaction({ dispatch, commit }, params) {
    const toSaveParams = { ...params };
    const paramsToSend = { ...params };
    delete paramsToSend.auditType;
    await dispatch('createTransactionAction', paramsToSend)
      .then(({ data }) => {
        commit(types.SET_TRANSACTION_FEE, data);
        commit(types.SAVE_CREATE_TRANSACTION_FORM, toSaveParams);
      }, () => Promise.reject());
  },
  acceptTransaction({ dispatch, commit }, params) {
    return dispatch('acceptTransactionAction', params)
      .then(({ data }) => {
        commit(types.SAVE_TRANSACTION_SUCCEEDED_DATA, data);
        return Promise.resolve(data);
      }, () => Promise.reject());
  },
  getTransactionDetails({ dispatch, commit }, params) {
    return dispatch('getTransactionDetailsAction', params)
      .then(({ data }) => {
        commit(types.SAVE_TRANSACTION_DETAILS_DATA, data);
      }, () => Promise.reject());
  },
  async getFullTransactionDetails({ dispatch, commit }, transactionId) {
    const paramsToSend = { ...state.createTransactionFormData };
    delete paramsToSend.auditType;
    const params = await dispatch('prepareTransactionAction', { transactionId, body: paramsToSend });
    const { requestId } = params;
    await dispatch('executeTransactionAction', requestId)
      .then(({ data }) => {
        commit(types.SAVE_TRANSACTION_FULL_DETAILS_DATA, data);
      }, () => Promise.reject());
  },
  async subscribeTransaction({ dispatch, commit }, body) {
    await dispatch('subscribeTransactionAction', body)
      .then(({ data }) => {
        commit(types.SAVE_SUBSCRIBE_DATA, data);
      }, () => Promise.reject());
  },
  resetTransactionData({ commit }) {
    commit(types.RESET_TRANSACTION_DATA);
  },
  removeApiOutputDataByKey({ commit }, key) {
    commit(types.REMOVE_API_CONSOLE_OUTPUT_DATA_PART, key);
  },
  async signTransaction({ dispatch, commit }, params) {
    return dispatch('signTransactionAction', params)
      .then(({ data }) => {
        commit(types.SAVE_SIGNED_KEY, data);
        return data?.signed || '';
      }, () => Promise.resolve(false));
  },
  updateStatusesTransaction({ commit }, data) {
    commit(types.UPDATE_STATUSES, data);
  },
};

const mutations = {
  [types.SET_TRANSACTION_PAGE_STEP](state, step) {
    state.previousStep = state.step;
    state.step = step;
  },
  [types.SAVE_CREATE_TRANSACTION_FORM](state, data) {
    state.createTransactionFormData = data;
  },
  [types.RESET_TRANSACTION_PAGE_STEP](state) {
    state.step = CREATE_TRANSACTION;
    state.previousStep = null;
  },
  [types.RESET_TRANSACTION_FEE](state) {
    state.transactionFee = {};
  },
  [types.RESET_API_CONSOLE_OUTPUT](state) {
    state.apiConsoleOutputData = {};
  },
  [types.SET_TRANSACTION_FEE](state, params) {
    state.transactionFee = params;
  },
  [types.SAVE_TRANSACTION_SUCCEEDED_DATA](state, params) {
    state.transactionSucceededData = params;
  },
  [types.ADD_API_CONSOLE_OUTPUT_DATA](state, { key, message }) {
    if (!state.apiConsoleOutputData[key]) {
      state.apiConsoleOutputData[key] = [];
    }
    state.apiConsoleOutputData[key].push(message);
    state.apiConsoleOutputData = { ...state.apiConsoleOutputData };
  },
  [types.REMOVE_API_CONSOLE_OUTPUT_DATA_PART](state, key) {
    if (state.apiConsoleOutputData[key]) {
      delete state.apiConsoleOutputData[key];
      state.apiConsoleOutputData = { ...state.apiConsoleOutputData };
    }
  },
  [types.SAVE_TRANSACTION_DETAILS_DATA](state, params) {
    state.overledgerTransaction = params;
  },
  [types.SAVE_TRANSACTION_FULL_DETAILS_DATA](state, params) {
    state.transactionFullDetailsData = params;
  },
  [types.SAVE_SUBSCRIBE_DATA](state, params) {
    state.subscribedData = params;
  },
  [types.RESET_TRANSACTION_DATA](state) {
    state.createTransactionFormData = {};
    state.transactionFee = {};
    state.transactionSucceededData = {};
    state.overledgerTransaction = {};
    state.transactionFullDetailsData = {};
    state.apiConsoleOutputData = {};
    state.subscribedData = {};
    state.signedKey = '';
    state.previousStep = null;
  },
  [types.SAVE_SIGNED_KEY](state, { signed }) {
    state.signedKey = signed;
  },
  [types.UPDATE_STATUSES](state, payload) {
    if (payload.overledgerTransactionUpdateDetails.overledgerTransactionId
      === state.transactionSucceededData.overledgerTransactionId) {
      const { status } = payload.overledgerTransactionUpdateDetails;
      let { status: statusList } = state.overledgerTransaction.transactionHistory;
      if (statusList?.length) {
        const findStatus = statusList.find((s) => s.value === status.value);
        if (findStatus) {
          statusList = statusList.map((s) => {
            if (s.value === status.value) {
              return {
                ...status,
              };
            }
            return s;
          });
        } else {
          statusList.push(status);
        }

        statusList = statusList
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        state.overledgerTransaction = {
          ...state.overledgerTransaction,
          status: statusList[statusList.length - 1],
          transactionHistory: {
            status: statusList,
          },
        };
      }
      const objecyKeys = Object.keys(state.transactionFullDetailsData);
      if (status && objecyKeys.length) {
        state.transactionFullDetailsData = {
          ...state.transactionFullDetailsData,
          status: {
            ...status,
          },
        };
      }
    }
  },
};

export default {
  state,
  actions,
  mutations,
};

import {
  CREATE_TRANSACTION,
} from '@/constants/transaction/steps';
import * as types from '@/store/mutationTypes';

const defaultData = {
  createTransactionFormData: {},
  transactionSucceededData: {},
  overledgerTransaction: {},
  transactionFee: {},
  transactionFullDetailsData: {},
  apiConsoleOutputData: {},
  subscribedData: {},
  auditType: '',
  signedKey: '',
};

const state = {
  step: CREATE_TRANSACTION,
  transactions: [
    JSON.parse(JSON.stringify(defaultData)),
  ],
  currentTransactionIndex: 0,
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
  createTransaction({ dispatch, commit }, params) {
    const toSaveParams = { ...params };
    const paramsToSend = { ...params };
    delete paramsToSend.auditType;
    return dispatch('createTransactionAction', paramsToSend, { root: true })
      .then(({ data }) => {
        commit(types.SET_TRANSACTION_FEE, data);
        commit(types.SAVE_CREATE_TRANSACTION_FORM, toSaveParams);
      }, () => Promise.reject());
  },
  acceptTransaction({ dispatch, commit }, params) {
    return dispatch('acceptTransactionAction', params, { root: true })
      .then(({ data }) => {
        commit(types.SAVE_TRANSACTION_SUCCEEDED_DATA, data);
        return Promise.resolve(data);
      }, () => Promise.reject());
  },
  getTransactionDetails({ dispatch, commit }, params) {
    return dispatch('getTransactionDetailsAction', params, { root: true })
      .then(({ data }) => {
        commit(types.SAVE_TRANSACTION_DETAILS_DATA, data);
      }, () => Promise.reject());
  },
  async getFullTransactionDetails({ dispatch, commit }, transactionId) {
    const paramsToSend = {
      ...state.transactions[state.currentTransactionIndex].createTransactionFormData,
    };
    delete paramsToSend.auditType;
    const params = await dispatch('prepareTransactionAction', { transactionId, body: paramsToSend }, { root: true });
    const { requestId } = params;
    return dispatch('executeTransactionAction', requestId, { root: true })
      .then(({ data }) => {
        commit(types.SAVE_TRANSACTION_FULL_DETAILS_DATA, data);
      }, () => Promise.reject());
  },
  subscribeTransaction({ dispatch, commit }, body) {
    return dispatch('subscribeTransactionAction', body, { root: true })
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
  moveToAudit({ commit }) {
    commit(types.MOVE_TO_AUDIT);
  },
  signTransaction({ dispatch, commit }, params) {
    return dispatch('signTransactionAction', params, { root: true })
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
    state.transactions[state.currentTransactionIndex].createTransactionFormData = data;
    state.transactions = [...state.transactions];
  },
  [types.RESET_TRANSACTION_PAGE_STEP](state) {
    state.previousStep = '';
    state.step = CREATE_TRANSACTION;
  },
  [types.RESET_TRANSACTION_FEE](state) {
    state.transactions[state.currentTransactionIndex].transactionFee = {};
    state.transactions = [...state.transactions];
  },
  [types.RESET_API_CONSOLE_OUTPUT](state) {
    state.transactions[state.currentTransactionIndex].apiConsoleOutputData = {};
    state.transactions = [...state.transactions];
  },
  [types.SET_TRANSACTION_FEE](state, params) {
    state.transactions[state.currentTransactionIndex].transactionFee = params;
    state.transactions = [...state.transactions];
  },
  [types.SAVE_TRANSACTION_SUCCEEDED_DATA](state, params) {
    state.transactions[state.currentTransactionIndex].transactionSucceededData = params;
    state.transactions = [...state.transactions];
  },
  [types.ADD_API_CONSOLE_OUTPUT_DATA](state, { key, message }) {
    if (!state.transactions[state.currentTransactionIndex].apiConsoleOutputData[key]) {
      state.transactions[state.currentTransactionIndex].apiConsoleOutputData[key] = [];
    }
    state.transactions[state.currentTransactionIndex].apiConsoleOutputData[key].push(message);
    state.transactions[state.currentTransactionIndex].apiConsoleOutputData = {
      ...state.transactions[state.currentTransactionIndex].apiConsoleOutputData,
    };
    state.transactions = [...state.transactions];
  },
  [types.REMOVE_API_CONSOLE_OUTPUT_DATA_PART](state, key) {
    if (state.transactions[state.currentTransactionIndex].apiConsoleOutputData[key]) {
      delete state.transactions[state.currentTransactionIndex].apiConsoleOutputData[key];
      state.transactions[state.currentTransactionIndex].apiConsoleOutputData = {
        ...state.transactions[state.currentTransactionIndex].apiConsoleOutputData,
      };
      state.transactions = [...state.transactions];
    }
  },
  [types.SAVE_TRANSACTION_DETAILS_DATA](state, params) {
    state.transactions[state.currentTransactionIndex].overledgerTransaction = params;
    state.transactions = [...state.transactions];
  },
  [types.SAVE_TRANSACTION_FULL_DETAILS_DATA](state, params) {
    state.transactions[state.currentTransactionIndex].transactionFullDetailsData = params;
    state.transactions = [...state.transactions];
  },
  [types.SAVE_SUBSCRIBE_DATA](state, params) {
    state.transactions[state.currentTransactionIndex].subscribedData = params;
    state.transactions = [...state.transactions];
  },
  [types.RESET_TRANSACTION_DATA](state) {
    state.transactions = [
      JSON.parse(JSON.stringify(defaultData)),
    ];
    state.currentTransactionIndex = 0;
  },
  [types.MOVE_TO_AUDIT](state) {
    state.transactions.push(JSON.parse(JSON.stringify(defaultData)));
    state.currentTransactionIndex = 1;
  },
  [types.SAVE_SIGNED_KEY](state, { signed }) {
    state.transactions[state.currentTransactionIndex].signedKey = signed;
  },
  [types.UPDATE_STATUSES](state, payload) {
    const {
      overledgerTransactionId:
      payloadOverledgerTransactionId,
    } = payload.overledgerTransactionUpdateDetails;
    const { overledgerTransactionId } = state.transactions[state.currentTransactionIndex]
      .transactionSucceededData;
    if (payloadOverledgerTransactionId === overledgerTransactionId) {
      const { status } = payload.overledgerTransactionUpdateDetails;
      let { status: statusList } = state
        .transactions[state.currentTransactionIndex].overledgerTransaction.transactionHistory;
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

        state.transactions[state.currentTransactionIndex].overledgerTransaction = {
          ...state.transactions[state.currentTransactionIndex].overledgerTransaction,
          status: statusList[statusList.length - 1],
          transactionHistory: {
            status: statusList,
          },
        };
      }

      const objectKeys = Object.keys(state.transactions[state.currentTransactionIndex]
        .transactionFullDetailsData);
      if (status && objectKeys.length) {
        state.transactions[state.currentTransactionIndex].transactionFullDetailsData = {
          ...state.transactions[state.currentTransactionIndex].transactionFullDetailsData,
          status: {
            ...status,
          },
        };
      }
      state.transactions = [...state.transactions];
    }
  },
};

export default {
  state,
  actions,
  mutations,
  namespaced: true,
};

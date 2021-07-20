import Vue from 'vue';
import * as types from '@/store/mutationTypes';

const state = {
  hasUnsavedChanges: false,
};

const actions = {
  showNotification(context, {
    type, message, title, timeout = 5000,
  }) {
    Vue.notify({
      group: 'top-center',
      type,
      title,
      text: message,
      duration: timeout,
    });
  },
  setChangesState({ commit }, value) {
    commit(types.SET_CHANGES_STATE, value);
  },
};

const mutations = {
  [types.SET_CHANGES_STATE](state, value) {
    state.hasUnsavedChanges = value;
  },
};

export default {
  state,
  actions,
  mutations,
};

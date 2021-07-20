import httpCTOR from '@/services/httpService';
import subUpdateServiceCTOR from '@/services/subscriptionUpdateService';

const http = httpCTOR();
const subUpdateService = subUpdateServiceCTOR();

const state = {
};

const actions = {
  async createTransactionAction(context, params) {
    return http.post('preparation/transaction', params);
  },
  async acceptTransactionAction(context, params) {
    return http.post('execution/transaction', params);
  },
  async getTransactionDetailsAction(context, overledgerTransactionId) {
    return http.get(`monitoreditemdata/${overledgerTransactionId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {},
    });
  },
  async prepareTransactionAction(context, { transactionId, body }) {
    return http.post(`preparation/search/transaction${transactionId ? `?transactionId=${transactionId}` : ''}`, body)
      .then(({ data }) => Promise.resolve(data));
  },
  async executeTransactionAction(context, requestId) {
    return http.post(`execution/search/transaction${requestId ? `?requestId=${requestId}` : ''}`, {});
  },
  async subscribeTransactionAction(context, params) {
    return http.post('webhook/subscription', params);
  },
  async signTransactionAction(context, params) {
    return subUpdateService.post('sign', params);
  },
};

export default {
  state,
  actions,
};

import httpCTOR from '@/services/httpService';
import subUpdateServiceCTOR from '@/services/subscriptionUpdateService';

const http = httpCTOR();
const subUpdateService = subUpdateServiceCTOR();

const state = {
};

const actions = {
  createTransactionAction(context, params) {
    return http.post('preparation/transaction', params);
  },
  acceptTransactionAction(context, params) {
    return http.post('execution/transaction', params);
  },
  getTransactionDetailsAction(context, overledgerTransactionId) {
    return http.get(`monitoreditemdata/${overledgerTransactionId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {},
    });
  },
  prepareTransactionAction(context, { transactionId, body }) {
    return http.post(`preparation/search/transaction${transactionId ? `?transactionId=${transactionId}` : ''}`, body)
      .then(({ data }) => Promise.resolve(data));
  },
  executeTransactionAction(context, requestId) {
    return http.post(`execution/search/transaction${requestId ? `?requestId=${requestId}` : ''}`, {});
  },
  subscribeTransactionAction(context, params) {
    return http.post('webhook/subscription', params);
  },
  signTransactionAction(context, params) {
    return subUpdateService.post('sign', params);
  },
};

export default {
  state,
  actions,
};

import convertDate from '@/helpers/convertDate';
import {
  slice,
  mapOverledgerTransactionDataMethod,
  timeStempMapper,
  capitalizeFirstLetter,
} from '@/helpers/helper';
import {
  FAILED, SUCCESSFUL,
} from '@/constants/transaction/transactionStatusTypes';
import { CURRENCY_CODE } from '@/constants/currency/currencyFields';
import * as steps from '@/constants/transaction/steps';

const transactionComputed = {
  computed: {
    mappedTransactionSucceededData() {
      return {
        requestId: this.transactionSucceededData.requestId,
        overledgerTransactionId: this.transactionSucceededData.overledgerTransactionId,
        transactionId: this.transactionSucceededData.transactionId,
        statusValue: capitalizeFirstLetter(this.transactionSucceededData.status.value),
        transactionDateTime: convertDate(this.transactionSucceededData.status.timestamp),
      };
    },
    mappedTransactionDataForMessage() {
      const {
        overledgerTransactionId,
        requestId,
        transactionId,
        status,
      } = this.transactionSucceededData;
      return {
        overledgerRequestId: requestId,
        overledgerTransactionId,
        dltTransactionId: slice(transactionId),
        transactionStatus: status.value,
      };
    },
    mappedOverledgerTransactionData() {
      return mapOverledgerTransactionDataMethod(this.overledgerTransaction);
    },
    mappedTransactionFullData() {
      // displayed requestId, fee, overledgerTransactionId from state, not from this api
      // amount, timestamp - wrong values come
      const {
        location,
        status,
        transaction,
        timestamp,
      } = this.transactionFullDetailsData;

      const transactionDateTime = timeStempMapper(timestamp);
      const { totalPaymentAmount, destination, fee } = transaction;

      const {
        requestId,
        overledgerTransactionId,
      } = this.transactionSucceededData;

      const paymentAmount = location.technology === CURRENCY_CODE.ETH
        ? totalPaymentAmount[0] : destination[0].payment;

      const { amount: feeAmount, unit: feeUnit } = this.transactionFee.dltFee || {};

      return {
        ...this.transactionFullDetailsData,
        requestId,
        transactionId: overledgerTransactionId,
        overledgerTransactionId,
        dltType: location?.technology || '-',
        dlnType: location?.network || '-',
        paymentAmount: {
          amount: paymentAmount.amount,
          unit: paymentAmount.unit,
        },
        fee: fee || {
          amount: feeAmount,
          unit: feeUnit,
        } || {},
        status: {
          ...status,
          value: capitalizeFirstLetter(status.value),
        },
        transactionDateTime,
      };
    },
    mappedSubscribedSuccessfullyData() {
      // todo
      return this.subscribedData?.length ? this.subscribedData[0] : {};
    },
    hasSubscriptionId() {
      return Boolean(this.mappedSubscribedSuccessfullyData.subscriptionId);
    },
    isStatusFailed() {
      return this.overledgerTransaction.status?.value === FAILED;
    },
    isStatusSuccessful() {
      return this.overledgerTransaction.status?.value === SUCCESSFUL;
    },
    mappedTransactionFeeData() {
      return {
        amount: this.transactionFee.dltFee.amount,
        unit: this.transactionFee.dltFee.unit,
        requestId: this.transactionFee.requestId,
      };
    },
    showBackBtnInCreateSubscribe() {
      return this.previousStep === steps.TRANSACTION_DETAILS
        || this.previousStep === steps.TRANSACTION_FULL_DETAILS;
    },
  },
};

export default transactionComputed;

import { CONSOLE_OUTPUT_CLOSE_DELAY } from '@/constants/consoleOutput/outputFields';
import * as steps from '@/constants/transaction/steps';
import {
  acceptTransactionMessages,
  createTransactionMessages,
  subscribeToTransactionMessages,
  transactionDetailsMessages,
  transactionFullDetailsMessages,
} from '@/constants/consoleOutput/messages';
import convertDate from '@/helpers/convertDate';
import { wrapInTag } from '@/helpers/consoleOutput';
import { capitalizeFirstLetter } from '@/helpers/helper';

const transactionMethods = {
  methods: {
    async handleCreateTransaction(form) {
      const key = this.generateNewMessageOutputKey;
      this.setLoading('Preparing Transaction');
      this.setChangesState(false);
      await this.logToConsole({
        key,
        message: 'De-ciphering signed API call...',
      });
      this.createTransaction(form)
        .then(async () => {
          this.setStepAction(steps.TRANSACTION_FEE);
          await this.generateCreateTransactionMessages(key);
          await this.finishOutputAfterTimeout();
        })
        .catch(() => {
          this.removeApiOutputDataByKey(key);
          this.finishOutput();
        });
    },
    closeRejectTransactionModal() {
      this.showRejectPopup = false;
    },
    handleRejectTransaction() {
      this.showRejectPopup = true;
    },
    confirmRejectTransaction() {
      this.handleCreateNewTransaction();
      this.closeRejectTransactionModal();
      this.resetTransactionFee();
    },
    setLoading(loadingText) {
      this.loading = true;
      this.loadingText = loadingText;
      this.isConsoleOutputExpanded = true;
    },
    resetLoading() {
      this.loading = false;
      this.loadingText = '';
    },
    finishOutputAfterTimeout() {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.loading = false;
          this.loadingText = '';
          this.isConsoleOutputExpanded = false;
          resolve();
        }, CONSOLE_OUTPUT_CLOSE_DELAY);
      });
    },
    finishOutput() {
      this.resetLoading();
      this.isConsoleOutputExpanded = false;
    },
    async handleDetailsView() {
      const key = this.generateNewMessageOutputKey;
      if (this.transactionSucceededData.overledgerTransactionId) {
        this.setLoading('Retrieving Overledger Transaction Details');
        await this.logToConsole({
          key,
          message: 'Searching Overledger for transaction...',
        });
        this.getTransactionDetails(this.transactionSucceededData.overledgerTransactionId)
          .then(async () => {
            this.setStepAction(steps.TRANSACTION_DETAILS);
            await this.generateRetrieveTransactionDetailsMessages(key);
            await this.finishOutputAfterTimeout();
          })
          .catch(() => {
            this.removeApiOutputDataByKey(key);
            this.finishOutput();
          });
      }
    },
    async handleFullDetails() {
      const key = this.generateNewMessageOutputKey;
      this.setLoading('Retrieving Full Transaction Details');
      await this.logToConsole({
        key,
        message: 'Searching Overledger for corresponding DLT Transaction ID...',
      });
      this.getFullTransactionDetails(this.transactionSucceededData.transactionId)
        .then(async () => {
          this.setStepAction(steps.TRANSACTION_FULL_DETAILS);
          await this.generateRetrieveFullTransactionDetailsMessages(key);
          await this.finishOutputAfterTimeout();
        })
        .catch(() => {
          this.removeApiOutputDataByKey(key);
          this.finishOutput();
        });
    },
    async generateCreateTransactionMessages(key) {
      await this.printConsoleMessages(
        key,
        createTransactionMessages(this.mappedTransactionFeeData.unit),
      );
    },
    async generateAcceptTransactionMessages(key) {
      const {
        overledgerRequestId,
        overledgerTransactionId,
        dltTransactionId,
        transactionStatus,
      } = this.mappedTransactionDataForMessage;
      const transactionData = {
        OverledgerRequestID: overledgerRequestId,
        OverledgerTransactionID: overledgerTransactionId,
        DLTTransactionID: dltTransactionId,
        TransactionStatus: capitalizeFirstLetter(transactionStatus),
      };
      await this.printConsoleMessages(
        key,
        acceptTransactionMessages(transactionData),
      );
    },
    async generateRetrieveTransactionDetailsMessages(key) {
      await this.printConsoleMessages(
        key,
        transactionDetailsMessages(),
      );
    },
    async generateRetrieveFullTransactionDetailsMessages(key) {
      const { overledgerTransactionId, dltTransactionId } = this.mappedTransactionDataForMessage;
      const transactionInformation = {
        OverledgerTransactionID: overledgerTransactionId,
        DLTTransactionID: dltTransactionId,
      };
      await this.printConsoleMessages(
        key,
        transactionFullDetailsMessages(transactionInformation),
      );
    },
    async generateSubscribeToTransactionMessages(key) {
      const { overledgerTransactionId } = this.transactionSucceededData;

      const statuses = this.subscribedData.map((data) => {
        const { value, timestamp } = data.subscriptionDetails.status;
        return `${capitalizeFirstLetter(value)}     ${convertDate(timestamp)}`;
      });

      const statusInformation = `{\n  ${statuses.join('\n')}\n}`;

      await this.printConsoleMessages(
        key,
        subscribeToTransactionMessages(overledgerTransactionId, statusInformation),
      );
    },
    async printConsoleMessages(key, messageArray) {
      // todo - await in for of problem
      // eslint-disable-next-line no-restricted-syntax
      for (const createMessage of messageArray) {
        const {
          timeout,
          messageFirstPart,
          messageSecondPart,
          message,
        } = createMessage;
        // eslint-disable-next-line no-await-in-loop
        await this.logToConsole(wrapInTag(key, timeout, {
          message,
          messageFirstPart,
          messageSecondPart,
        }));
      }
    },
    redirectToCreateSubscription() {
      this.setStepAction(steps.TRANSACTION_CREATE_SUBSCRIPTION);
    },
    async handleSubscribeToTransaction(callbackUrl) {
      const key = this.generateNewMessageOutputKey;
      const { overledgerTransactionId, location } = this.transactionSucceededData;
      const subscriptionParams = {
        type: 'overledgerTransactionId',
        ids: [
          overledgerTransactionId,
        ],
        callbackUrl,
        withDetails: false,
      };
      this.setLoading('Subscribing');
      await this.logToConsole({
        key,
        message: `Sending tracking request to ${location.technology} Node`,
      });
      await this.subscribeTransaction(subscriptionParams)
        .then(async () => {
          this.setStepAction(steps.SUBSCRIPTION_CREATED_SUCCESSFULLY);
          await this.generateSubscribeToTransactionMessages(key);
          await this.finishOutputAfterTimeout();
        })
        .catch(() => {
          this.removeApiOutputDataByKey(key);
          this.finishOutput();
        });
    },
    handleCreateNewTransaction() {
      this.setStepAction(steps.CREATE_TRANSACTION);
    },
    async handleAcceptTransaction() {
      const key = this.generateNewMessageOutputKey;
      this.setLoading('Executing Transaction');
      await this.logToConsole({
        key,
        message: 'Signing native DLT payload...',
      });
      const signedKey = await this.signTransaction(this.transactionFee);
      if (!signedKey) {
        this.removeApiOutputDataByKey(key);
        this.finishOutput();
        return Promise.reject();
      }
      return this.acceptTransaction({
        requestId: this.transactionFee.requestId,
        signed: signedKey,
      })
        .then(async (data) => {
          this.setStepAction(steps.TRANSACTION_SUCCEEDED);
          await this.generateAcceptTransactionMessages(key);
          await this.finishOutputAfterTimeout();
          return Promise.resolve(data);
        })
        .catch(() => {
          this.removeApiOutputDataByKey(key);
          this.finishOutput();
        });
    },
    async redirectToAuditPage(overledgerTransactionId) {
      const key = this.generateNewMessageOutputKey;
      this.setLoading('Starting Audit Transaction');
      await this.logToConsole({
        key,
        message: 'Searching Overledger for transaction...',
      });
      this.redirectToAuditWithConsoleOutput(overledgerTransactionId, key)
        .then(async () => {
          await this.finishOutputAfterTimeout();
          await this.redirectToAuditSetAction();
        })
        .catch(() => {
          this.removeApiOutputDataByKey(key);
          this.finishOutput();
        });
    },
    redirectBack() {
      if (this.previousStep === steps.TRANSACTION_DETAILS) {
        this.handleDetailsView();
      } else if (this.previousStep === steps.TRANSACTION_FULL_DETAILS) {
        this.handleFullDetails();
      }
    },
  },
  computed: {
    generateNewMessageOutputKey() {
      return Object.keys(this.apiConsoleOutputData).length + 1;
    },
  },
};

export default transactionMethods;

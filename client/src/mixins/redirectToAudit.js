import * as steps from '@/constants/transaction/steps';
import { mapActions } from 'vuex';

const redirectToAuditMixin = {
  methods: {
    ...mapActions('linkedTransaction', [
      'setStepAction',
      'getTransactionDetails',
      'moveToAudit',
    ]),
    redirectToAudit(overledgerTransactionId) {
      return this.getTransactionDetails(overledgerTransactionId).then(async () => {
        await this.redirectToAuditSetAction();
      }, () => {});
    },
    async redirectToAuditWithConsoleOutput(overledgerTransactionId, messageKey) {
      return this.getTransactionDetails(overledgerTransactionId)
        .then(async () => {
          await this.generateRetrieveTransactionDetailsMessages(messageKey);
        }, () => {});
    },
    async redirectToAuditSetAction() {
      await this.moveToAudit();
      await this.setStepAction(steps.CREATE_TRANSACTION);
    },
  },
};

export default redirectToAuditMixin;

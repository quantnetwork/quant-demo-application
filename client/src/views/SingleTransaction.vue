<template>
  <div>
    <div
      v-show="!loading"
      class="container-width page-container"
    >
      <create-transaction
        v-if="step === steps.CREATE_TRANSACTION"
        :button-disabled="loading"
        @submit-transaction="handleCreateTransaction"
        @unsaved-data-change="setChangesState"
      />
      <transaction-fee
        v-if="step === steps.TRANSACTION_FEE"
        :data="mappedTransactionFeeData"
        :button-disabled="loading"
        @reject-transaction="handleRejectTransaction"
        @accept-transaction="handleAcceptTransactionSingle"
      />
      <transaction-succeed
        v-if="step === steps.TRANSACTION_SUCCEEDED"
        :data="mappedTransactionSucceededData"
      >
        <template #buttons>
          <b-button
            class="button w-100 button-sm button-light mr-3"
            :disabled="loading"
            @click="handleDetailsView"
          >
            Details
          </b-button>
          <b-button
            v-if="!hasSubscriptionId"
            class="button w-100 button-sm button-dark"
            :disabled="loading"
            @click="redirectToCreateSubscription"
          >
            Subscribe
          </b-button>
        </template>
      </transaction-succeed>
      <transaction-details
        v-if="step === steps.TRANSACTION_DETAILS"
        :data="mappedOverledgerTransactionData"
      >
        <template #buttons>
          <b-button
            v-if="!isStatusFailed"
            id="full-details-btn"
            class="w-100 mr-3 button button-sm button-light"
            :disabled="loading"
            @click="handleFullDetails"
          >
            Full Details
          </b-button>
          <b-button
            v-if="!hasSubscriptionId"
            class="w-100 mr-3 button button-sm"
            :disabled="loading"
            :class="{'button-dark': !isStatusFailed, 'button-light': isStatusFailed}"
            @click="redirectToCreateSubscription"
          >
            Subscribe
          </b-button>
          <b-button
            v-if="isStatusFailed || hasSubscriptionId"
            class="w-100 button-dark button button-sm"
            :disabled="loading"
            @click="handleCreateNewTransaction"
          >
            Create New Transaction
          </b-button>
        </template>
      </transaction-details>
      <transaction-full-details
        v-if="step === steps.TRANSACTION_FULL_DETAILS"
        :data="mappedTransactionFullData"
      >
        <template #backBtn>
          <b-row class="button-back-wrapper">
            <b-col
              md="1"
              class="text-right"
            >
              <b-btn
                class="button-back"
                @click="handleDetailsView"
              >
                <span> &#706; Back</span>
              </b-btn>
            </b-col>
          </b-row>
        </template>
        <template #buttons>
          <b-button
            v-if="!hasSubscriptionId"
            class="w-100 mr-3 button-dark button button-sm"
            :disabled="loading"
            @click="redirectToCreateSubscription"
          >
            Subscribe
          </b-button>
          <b-button
            class="w-100 button-dark button button-sm"
            :disabled="loading"
            @click="handleCreateNewTransaction"
          >
            Create New Transaction
          </b-button>
        </template>
      </transaction-full-details>
      <create-subscription
        v-if="step === steps.TRANSACTION_CREATE_SUBSCRIPTION"
        :button-disabled="loading"
        @unsaved-data-change="setChangesState"
        @subscribe="handleSubscribeToTransaction"
      >
        <template
          v-if="showBackBtnInCreateSubscribe"
          #backBtn
        >
          <b-row class="button-back-wrapper">
            <b-col
              md="1"
              class="text-right"
            >
              <b-btn
                class="button-back"
                @click="redirectBack"
              >
                <span> &#706; Back</span>
              </b-btn>
            </b-col>
          </b-row>
        </template>
      </create-subscription>
      <subscription-created-successfully
        v-if="step === steps.SUBSCRIPTION_CREATED_SUCCESSFULLY"
        :data="mappedSubscribedSuccessfullyData"
      >
        <template #buttons>
          <b-button
            class="w-100 button button-light button-sm mr-3"
            :disabled="loading"
            @click="handleDetailsView"
          >
            Transaction Details
          </b-button>
          <b-button
            class="w-100 button button-dark button-sm"
            :disabled="loading"
            @click="handleCreateNewTransaction"
          >
            Create New Transaction
          </b-button>
        </template>
      </subscription-created-successfully>
    </div>
    <loading
      v-show="loading"
      :text="loadingText"
    />

    <!-- Modal -->
    <b-modal
      class="reject-modal"
      size="lg"
      :visible="showRejectPopup"
      title="Reject Transaction"
      centered
      @hidden="closeRejectTransactionModal"
    >
      <div class="d-block">
        <h5>
          Are you sure you want to reject your transaction?
          The data entered before will be lost.
        </h5>
      </div>
      <template #modal-footer>
        <div class="w-100 d-flex justify-content-md-end">
          <b-button
            variant="primary"
            size="sm"
            class="button button-sm button-light button-modal mr-3"
            @click="closeRejectTransactionModal"
          >
            Cancel
          </b-button>
          <b-button
            variant="primary"
            size="sm"
            class="button button-sm button-dark button-modal"
            @click="confirmRejectTransaction"
          >
            Reject
          </b-button>
        </div>
      </template>
    </b-modal>

    <api-output
      class="mt-lg-5"
      :is-visible="isConsoleOutputExpanded"
      :data="apiConsoleOutputData"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import * as steps from '@/constants/transaction/steps';
import CreateTransaction from '@/components/CreateTransaction';
import ApiOutput from '@/components/ApiOutput';
import TransactionSucceed from '@/components/TransactionSucceed';
import TransactionFee from '@/components/TransactionFee';
import TransactionDetails from '@/components/TransactionDetails';
import TransactionFullDetails from '@/components/TransactionFullDetails';
import CreateSubscription from '@/components/CreateSubscription';
import SubscriptionCreatedSuccessfully from '@/components/SubscriptionCreatedSuccessfully';
import Loading from '@/components/Loading';
import transactionMethods from '@/mixins/methods';
import transactionComputed from '@/mixins/computed';

export default {
  name: 'SingleTransaction',
  components: {
    TransactionSucceed,
    CreateTransaction,
    TransactionFee,
    TransactionDetails,
    TransactionFullDetails,
    ApiOutput,
    Loading,
    CreateSubscription,
    SubscriptionCreatedSuccessfully,
  },
  mixins: [transactionMethods, transactionComputed],
  data() {
    return {
      steps,
      showRejectPopup: false,
      loading: false,
      loadingText: '',
      isConsoleOutputExpanded: false,
    };
  },
  computed: {
    ...mapState({
      step: (state) => state.singleTransaction.step,
      transactionSucceededData: (state) => state.singleTransaction.transactionSucceededData,
      transactionFee: (state) => state.singleTransaction.transactionFee,
      apiConsoleOutputData: (state) => state.singleTransaction.apiConsoleOutputData,
      overledgerTransaction: (state) => state.singleTransaction.overledgerTransaction,
      transactionFullDetailsData: (state) => state.singleTransaction.transactionFullDetailsData,
      subscribedData: (state) => state.singleTransaction.subscribedData,
      previousStep: (state) => state.singleTransaction.previousStep,
    }),
  },
  watch: {
    step: {
      handler() {
        if (this.step === steps.CREATE_TRANSACTION) {
          this.resetTransactionData();
        }
        this.setChangesState(this.step === steps.TRANSACTION_FEE);
      },
    },
  },
  beforeDestroy() {
    this.resetTransactionStep();
    this.resetTransactionData();
  },
  methods: {
    ...mapActions([
      'setStepAction',
      'resetTransactionStep',
      'createTransaction',
      'resetTransactionFee',
      'acceptTransaction',
      'getTransactionDetails',
      'setChangesState',
      'logToConsole',
      'getFullTransactionDetails',
      'resetTransactionData',
      'subscribeTransaction',
      'showNotification',
      'removeApiOutputDataByKey',
      'signTransaction',
    ]),
    handleAcceptTransactionSingle() {
      this.handleAcceptTransaction().then(() => {}, () => {});
    },
  },
};
</script>

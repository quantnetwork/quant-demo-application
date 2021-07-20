<template>
  <div class="container-width">
    <b-row class="sub-row">
      <b-col
        md="12"
        class="mx-auto d-flex justify-content-center"
      >
        <h1 class="w-100 text-center mb-5">
          Subscriptions
        </h1>
      </b-col>
    </b-row>
    <b-row class="mb-5">
      <b-col
        md="4"
        class="mx-auto d-flex justify-content-center"
      >
        <b-button
          class="w-100 button button-dark button-lg"
          @click="$router.push({ name: R_CREATE_SUBSCRIPTIONS })"
        >
          Create Subscription
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table
          v-if="!loading"
          :items="mappedSubscriptionsList"
          :fields="tableFields"
          :tbody-tr-class="rowClass"
          show-empty
          class="sub-table"
          head-variant="light"
        >
          <template #cell(actions)="row">
            <b-button
              v-if="row.item.status.value !== ACTIVE"
              v-b-tooltip.hover="'Resubscribe'"
              size="sm"
              variant="transparent"
              class="mr-2"
              @click="redirectToCreateSubscriptionFromList(row.item.subscriptionDetails.ids)"
            >
              <span class="icon-resubscribe" />
            </b-button>
            <b-button
              v-b-tooltip.hover="'Unsubscribe Transaction'"
              v-b-modal.unsubscribe-modal
              size="sm"
              variant="transparent"
              class="mr-2"
              @click="openUnsubscribeModal(row.item)"
            >
              <span class="icon-email" />
            </b-button>
            <b-button
              v-b-tooltip.hover="'View Transaction'"
              v-b-modal.modal-prevent-closing
              size="sm"
              variant="transparent"
              class="mr-2"
              @click="openDetailsModal(row.item)"
            >
              <span class="icon-view" />
            </b-button>
            <b-button
              v-b-tooltip.hover="'Show Subscriptions Details'"
              size="sm"
              variant="transparent"
              @click.stop.prevent="toggleDetails(row)"
            >
              {{ row.detailsShowing ? '&#9650;' : '&#9660;' }}
            </b-button>
          </template>
          <template #row-details="row">
            <SubscriptionDetails
              :row="row.item"
            />
          </template>
        </b-table>
        <Loading v-else />
      </b-col>
    </b-row>
    <b-modal
      id="unsubscribe-modal"
      title="Unsubscribe Transaction"
      size="lg"
      ok-title="Unsubscribe"
      centered
      @hidden="transactionId = null"
    >
      <div class="d-block">
        <h5>Are you sure you want to unsubscribe from your transaction?</h5>
      </div>
      <template #modal-footer="{ cancel }">
        <div class="w-100 d-flex justify-content-md-end">
          <b-button
            variant="primary"
            size="sm"
            class="button  button-light button-modal mr-3"
            :disabled="unsubscribeDisabled"
            @click="cancel()"
          >
            Cancel
          </b-button>
          <b-button
            variant="primary"
            size="sm"
            class="button button-dark button-modal"
            :disabled="unsubscribeDisabled"
            @click="handleOk"
          >
            Unsubscribe
          </b-button>
        </div>
      </template>
    </b-modal>
    <b-modal
      id="modal-prevent-closing"
      v-model="showDetailsModal"
      title="Overledger Transaction"
      size="lg"
      ok-only
      ok-variant="secondary"
      ok-title="Close"
      centered
      lazy
    >
      <Loading v-if="detailsLoading" />
      <TransactionDetails
        v-if="mappedOverledgerTransactionData && !detailsLoading"
        :data="mappedOverledgerTransactionData"
        :show-title="false"
      />
      <template #modal-footer>
        <b-button
          variant="primary"
          size="sm"
          class="button button-light button-modal"
          @click="showDetailsModal = false"
        >
          Close
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import tableFields from '@/constants/subscriptions/tableFields';
import { R_CREATE_SUBSCRIPTIONS } from '@/router/routes';
import Loading from '@/components/Loading';
import SubscriptionDetails from '@/components/SubscriptionDetails';
import TransactionDetails from '@/components/TransactionDetails';
import { mapOverledgerTransactionDataMethod } from '@/helpers/helper';
import { ACTIVE } from '@/constants/transaction/transactionStatusTypes';

export default {
  name: 'Subscriptions',
  components: { TransactionDetails, SubscriptionDetails, Loading },
  data() {
    return {
      loading: false,
      tableFields,
      R_CREATE_SUBSCRIPTIONS,
      subscriptionId: null,
      item: null,
      overledgerTransaction: {},
      detailsLoading: false,
      unsubscribeDisabled: false,
      showDetailsModal: false,
      ACTIVE,
    };
  },
  computed: {
    ...mapState({
      items: (state) => state.subscriptions.subscriptionList,
    }),
    mappedSubscriptionsList() {
      return this.items.map((item) => ({
        ...item,
        type: 'Transaction',
        transactionId: item.subscriptionDetails.ids[0],
        status: item.subscriptionDetails.status,
        loading: false,
      }));
    },
    mappedOverledgerTransactionData() {
      return mapOverledgerTransactionDataMethod(this.overledgerTransaction);
    },
  },
  created() {
    this.getData();
  },
  beforeDestroy() {
    this.resetSubscriptionsList();
  },
  methods: {
    ...mapActions([
      'getSubscriptions',
      'updateSubscriptionList',
      'unsubscribeSubscription',
      'getTransactionDetailsAction',
      'addDetailsToSubscriptionList',
      'removeFromUpdatedSubscriptions',
      'resetSubscriptionsList',
    ]),
    async getData() {
      this.loading = true;
      await this.getSubscriptions();
      this.loading = false;
    },
    toggleDetails(row) {
      if (row.detailsShowing) {
        this.hideShowDetails(row, false);
      } else {
        this.showDetails(row);
      }
    },
    async showDetails(row) {
      this.hideShowDetails(row, true);
      this.setLoadingToItem(row.index, true);

      await this.updateSubscriptionList({
        index: row.index,
        transactionId: row.item.transactionId,
        showDetails: true,
      })
        .then(() => {
          if (row.item?.isUpdated) {
            this.removeFromUpdatedSubscriptions(row.item.subscriptionId);
          }
        })
        .finally(() => {
          this.setLoadingToItem(row.index, false);
        });
    },
    hideShowDetails(row, showDetails) {
      this.addDetailsToSubscriptionList({
        data: this.mappedSubscriptionsList,
        index: row.index,
        transactionId: row.item.transactionId,
        showDetails,
      });
    },
    setLoadingToItem(index, isLoading) {
      this.mappedSubscriptionsList[index].loading = isLoading;
    },
    async handleOk() {
      this.unsubscribeDisabled = true;
      await this.unsubscribeSubscription(this.subscriptionId);
      this.unsubscribeDisabled = false;
      this.$nextTick(() => {
        this.$bvModal.hide('unsubscribe-modal');
      });
      await this.getData();
    },
    openUnsubscribeModal({ subscriptionId }) {
      this.subscriptionId = subscriptionId;
    },
    async openDetailsModal({ subscriptionDetails, subscriptionId, isUpdated }) {
      this.detailsLoading = true;
      await this.getTransactionDetailsAction(subscriptionDetails.ids[0])
        .then(({ data }) => {
          this.overledgerTransaction = data;
          if (isUpdated) {
            this.removeFromUpdatedSubscriptions(subscriptionId);
          }
        }, () => {
          this.overledgerTransaction = null;
        })
        .finally(() => {
          this.detailsLoading = false;
        });
    },
    redirectToCreatePage({ subscriptionDetails }) {
      this.$router.push({
        name: R_CREATE_SUBSCRIPTIONS,
        params: {
          ids: subscriptionDetails.ids,
        },
      });
    },
    async redirectToCreateSubscriptionFromList(overledgerTransactionIds) {
      await this.$router.push({
        name: R_CREATE_SUBSCRIPTIONS,
        params: { ids: overledgerTransactionIds },
      });
    },
    rowClass(item, type) {
      if ((!item || type === 'row') && item?.isUpdated) {
        return 'orange-tr';
      }
      return '';
    },
  },
};
</script>

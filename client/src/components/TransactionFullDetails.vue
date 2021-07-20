<template>
  <div>
    <slot name="backBtn" />
    <b-row>
      <b-col
        md="12"
        class="mx-auto d-flex justify-content-center font-weight-bold text-center"
      >
        <h1 class="w-100 text-center">
          Overledger Transaction
        </h1>
      </b-col>
    </b-row>
    <b-row class="d-flex justify-content-center mb-3">
      <b-col
        md="12"
        class="d-flex justify-content-center align-items-center sub-id"
      >
        <h5>ID: {{ data.overledgerTransactionId }}</h5>
        <clipboard v-model="data.overledgerTransactionId" />
      </b-col>
    </b-row>
    <b-row class="d-flex justify-content-center m-t-10">
      <b-col
        md="12"
        class="d-flex justify-content-center
        align-items-center orange-opacity-bg"
      >
        <span class="mr-4">DLT: {{ data.dltType }}</span>
        <span class="mr-4">DLN: {{ data.dlnType }}</span>
        <span class="mr-4">Status: {{ data.status.value }}</span>
        <span
          v-if="data.paymentAmount"
          class="mr-3"
        >
          Amount: {{ data.paymentAmount.amount }} {{ data.paymentAmount.unit }}
        </span>
      </b-col>
    </b-row>
    <div class="bg-gray mb-4 m-t-20">
      <b-row class="align-items-center row-height">
        <b-col md="4">
          Request ID:
        </b-col>
        <b-col md="8">
          <span class="status-and-id-text">
            {{ data.requestId }}
            <clipboard v-model="data.requestId" />
          </span>
        </b-col>
      </b-row>
      <b-row class="align-items-center row-height">
        <b-col md="4">
          Transaction ID:
        </b-col>
        <b-col
          v-if="data.transactionId"
          md="8"
        >
          <span class="status-and-id-text">
            {{ slice(data.transactionId) }}
          </span>
          <clipboard v-model="data.transactionId" />
        </b-col>
        <b-col
          v-else
          md="8"
        >
          -
        </b-col>
      </b-row>
      <b-row class="align-items-center row-height">
        <b-col md="4">
          Transaction Date/Time:
        </b-col>
        <b-col md="8">
          <span class="status-and-id-text">
            {{ data.transactionDateTime }}
          </span>
        </b-col>
      </b-row>
      <b-row
        v-if="data.fee.amount || data.fee.unit"
        class="align-items-center row-height"
      >
        <b-col md="4">
          Transaction Fee:
        </b-col>
        <b-col md="8">
          <span class="status-and-id-text">
            {{ data.fee.amount }}
            {{ data.fee.unit }}
          </span>
        </b-col>
      </b-row>
    </div>

    <div class="bg-card mb-4">
      <b-card
        no-body
        class="mb-4 quant-card"
      >
        <b-card-header class="p-1">
          <b-button
            v-b-toggle.originator
            block
            variant="secondary"
          >
            Originator
          </b-button>
        </b-card-header>
        <b-collapse
          id="originator"
          visible
          role="tabpanel"
        >
          <b-card-body>
            <b-row
              v-for="(origin, key) in data.transaction.origin"
              :key="key"
            >
              <b-col md="2">
                Identifier
              </b-col>
              <b-col md="6">
                <span class="status-and-id-text">{{ origin.originId }}</span>
              </b-col>
              <b-col md="4" />
            </b-row>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card
        no-body
        class="mb-1 quant-card"
      >
        <b-card-header class="p-1">
          <b-button
            v-b-toggle.destination
            block
            variant="secondary"
          >
            Destination
          </b-button>
        </b-card-header>
        <b-collapse
          id="destination"
          visible
          role="tabpanel"
        >
          <b-card-body>
            <b-row
              v-for="(origin, key) in data.transaction.destination"
              :key="key"
              class="mb-3"
            >
              <b-col md="2">
                Identifier
              </b-col>
              <b-col md="6">
                <span class="status-and-id-text">{{ origin.destinationId }}</span>
              </b-col>
              <b-col md="4">
                <b-card
                  no-body
                  class="text-center"
                >
                  <span class="orange-opacity-bg">
                    <span>{{ origin.payment.amount }} {{ origin.payment.unit }}</span>
                  </span>
                </b-card>
              </b-col>
            </b-row>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
    <b-row
      v-if="$slots['buttons']"
      class="d-flex justify-content-center"
    >
      <b-col
        md="2"
        class="mx-auto d-flex justify-content-center font-weight-bold"
      >
        <slot name="buttons" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { slice } from '@/helpers/helper';
import Clipboard from './Clipboard';

export default {
  name: 'TransactionFullDetails',
  components: {
    Clipboard,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    slice,
  },
};
</script>

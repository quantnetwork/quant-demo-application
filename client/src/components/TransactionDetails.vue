<template>
  <div>
    <b-row>
      <b-col
        md="12"
        class="mx-auto d-flex justify-content-center font-weight-bold text-center"
      >
        <h1
          v-if="showTitle"
          class="w-100 text-center"
        >
          Overledger Transaction
        </h1>
      </b-col>
    </b-row>
    <b-row class="d-flex justify-content-center mb-3">
      <b-col
        md="12"
        class="d-flex justify-content-center align-items-center  sub-id"
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
        <span class=" mr-4"> DLT: {{ data.dltType }} </span>
        <span> DLN: {{ data.dlnType }} </span>
      </b-col>
    </b-row>
    <div class="bg-gray mb-4 m-t-20">
      <b-row class="align-items-center row-height">
        <b-col md="4">
          Request ID:
        </b-col>
        <b-col md="8">
          <span class="status-and-id-text">
            {{ data.requestId }}<clipboard v-model="data.requestId" />
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
    </div>
    <div class="d-flex justify-content-center mb-4">
      <b-row class="status-wrapper">
        <b-col
          v-for="(element, index) in data.statusHistory"
          :key="index"
          :class="element.class"
          class="text-center status"
        >
          <div class="status-border">
            <div class="status-content mr-5">
              <div class="status-text">
                {{ element.statusLabel }}
              </div>
              <div class="date-text">
                {{ element.timestamp }}
              </div>
            </div>
          </div>
          <div class="dot" />
        </b-col>
      </b-row>
    </div>
    <b-row
      v-if="$slots['buttons']"
      class="d-flex justify-content-center"
    >
      <b-col
        md="5"
        class="d-flex justify-content-center font-weight-bold"
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
  name: 'TransactionDetails',
  components: {
    Clipboard,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    slice,
  },
};
</script>

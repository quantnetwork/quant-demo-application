<template>
  <div>
    <b-row>
      <b-col
        md="12"
        class="mx-auto d-flex justify-content-center font-weight-bold text-center"
      >
        <h1 class="w-100 text-center mb-5">
          Transaction Fee Calculated
        </h1>
      </b-col>
    </b-row>
    <b-row class="bg-gray mb-4 text-center max-width fee-calculated">
      <b-col md="12">
        <h4>DLT Fee</h4>
        <h1>{{ data.amount }} {{ data.unit }}</h1>
      </b-col>
    </b-row>
    <b-row class="d-flex justify-content-center">
      <b-col
        md="2"
        class="mx-auto d-flex justify-content-center font-weight-bold"
      >
        <b-button
          class="button w-100 button-sm button-light mr-3"
          :disabled="buttonDisabled"
          @click="rejectClick"
        >
          Reject
        </b-button>
        <b-button
          class="button w-100 button-sm button-dark"
          :disabled="buttonDisabled"
          @click="acceptClick"
        >
          Accept
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'TransactionFee',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    buttonDisabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    rejectClick() {
      this.$emit('reject-transaction');
    },
    acceptClick() {
      this.$emit('accept-transaction');
    },
  },
};
</script>

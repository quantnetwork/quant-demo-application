<template>
  <b-row
    v-if="!row.loading"
    class="details-wrapper"
  >
    <b-col cols="2">
      <i :class="iconClass" />
      {{ row.details.technology }}
    </b-col>
    <b-col cols="4">
      <div
        v-for="(s,i) in row.details.statuses.slice().reverse()"
        :key="i"
      >
        <span class="table-details mr-3">Status: </span>
        <span>{{ capitalizeFirstLetter(s) }}</span>
      </div>
    </b-col>
    <b-col cols="4">
      <div
        v-for="(t,i) in row.details.timeStamp"
        :key="i"
      >
        <span class="table-details mr-3 ">Transaction Date/Time: </span>
        <span>{{ convertDate(t) }}</span>
      </div>
    </b-col>
    <b-col
      v-if="row.details.status === SUCCESSFUL"
      cols="2"
    >
      <b-button
        class="button w-100 button-dark button-audit"
        @click="redirectToAuditFromList(row.subscriptionDetails.ids[0])"
      >
        Audit
      </b-button>
    </b-col>
  </b-row>
  <Loading v-else />
</template>

<script>
import convertDate from '@/helpers/convertDate';
import dltTypeOptions from '@/constants/dltOptions/dltTypeOptions';
import { SUCCESSFUL } from '@/constants/transaction/transactionStatusTypes';
import Loading from '@/components/Loading';
import { R_LINKED_TRANSACTIONS } from '@/router/routes';
import redirectToAuditMixin from '@/mixins/redirectToAudit';
import { capitalizeFirstLetter } from '@/helpers/helper';

export default {
  name: 'SubscriptionDetails',
  components: {
    Loading,
  },
  mixins: [
    redirectToAuditMixin,
  ],
  props: {
    row: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      SUCCESSFUL,
    };
  },
  computed: {
    iconClass() {
      return dltTypeOptions.find((e) => (e.value.toLowerCase() === this.row.details.technology.toLowerCase() ? e : ''))?.icon;
    },
  },
  methods: {
    convertDate,
    capitalizeFirstLetter,
    async redirectToAuditFromList(overledgerTransactionId) {
      await this.redirectToAudit(overledgerTransactionId);
      await this.$router.push({ name: R_LINKED_TRANSACTIONS });
    },
  },
};
</script>

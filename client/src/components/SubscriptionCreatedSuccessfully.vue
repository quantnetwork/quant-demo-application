<template>
  <div>
    <b-row>
      <b-col
        md="12"
        class="mx-auto d-flex justify-content-center font-weight-bold text-center"
      >
        <h1 class="w-100 text-center mb-5">
          <span class="icon-success" />
          Subscription Created Successfully
        </h1>
      </b-col>
    </b-row>
    <div class="bg-gray mb-4 text-center sub-bg-gray">
      <b-row class="row-height align-items-center">
        <b-col md="4">
          <span>Subscription ID:</span>
        </b-col>
        <b-col md="8">
          <span class="status-and-id-text">
            {{ data.subscriptionId }}
          </span>
          <clipboard
            v-if="data.subscriptionId"
            v-model="data.subscriptionId"
          />
        </b-col>
      </b-row>
    </div>
    <b-row
      v-if="$slots['buttons']"
    >
      <b-col
        md="5"
        class="mx-auto d-flex justify-content-center font-weight-bold"
      >
        <slot name="buttons" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Clipboard from '@/components/Clipboard';

export default {
  name: 'SubscriptionCreatedSuccessfully',
  components: {
    Clipboard,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

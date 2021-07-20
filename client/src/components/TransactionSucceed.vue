<template>
  <div>
    <b-row>
      <b-col
        md="12"
        class="mx-auto d-flex justify-content-center font-weight-bold text-center"
      >
        <h1 class="w-100 text-center mb-5">
          <span class="icon-success" />
          Transaction Created Successfully
        </h1>
      </b-col>
    </b-row>
    <div class="bg-gray mb-4">
      <b-row
        v-for="(field, i) in succeedFields"
        :key="i"
        class="align-items-center row-height"
      >
        <b-col md="4">
          {{ field.label }}
        </b-col>
        <b-col
          v-if="data[field.key]"
          md="8"
        >
          <span class="status-and-id-text">
            <template v-if="field.shorten">
              {{ data[field.key] | slice }}
            </template>
            <template v-else>
              {{ data[field.key] }}
            </template>
          </span>
          <clipboard
            v-if="field.showCopy"
            v-model="data[field.key]"
          />
        </b-col>
        <b-col
          v-else
          md="8"
        >
          -
        </b-col>
      </b-row>
    </div>
    <b-row
      v-if="$slots['buttons']"
    >
      <b-col
        md="3"
        class="mx-auto d-flex justify-content-center font-weight-bold"
      >
        <slot name="buttons" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import succeedFields from '../constants/transaction/succeedFields';
import Clipboard from './Clipboard';

export default {
  name: 'TransactionSucceed',
  components: { Clipboard },
  filters: {
    slice(value) {
      if (value?.length >= 13) {
        const start = value.slice(0, 5);
        const end = value.slice(value.length - 5, value.length);
        return `${start}...${end}`;
      }
      return value;
    },
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      succeedFields,
    };
  },
};
</script>

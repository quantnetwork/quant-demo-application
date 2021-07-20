<template>
  <div>
    <slot name="backBtn" />
    <b-row class="max-width">
      <b-col
        md="12"
        class="mx-auto d-flex justify-content-center"
      >
        <h1 class="w-100 text-center">
          Create Subscription
        </h1>
      </b-col>
    </b-row>
    <b-row class="max-width">
      <b-col
        md="12"
        class="mx-auto m-b-10 p-0"
      >
        <ValidationProvider
          v-slot="{ errors }"
          ref="callback-ref"
          name="Callback URL"
          rules="required"
          tag="div"
        >
          <b-form-group
            class="quant-form-group"
            label="Callback URL:"
          >
            <b-input
              v-model.trim="callbackUrl"
              class="quant-inputs"
              name="callback"
              :class="{ 'is-invalid': errors[0] }"
              placeholder="Please Enter"
              type="text"
              @change="callbackURLChange"
            />
            <b-form-invalid-feedback
              v-if="errors[0]"
              class="error-message"
            >
              {{ errors[0] }}
            </b-form-invalid-feedback>
          </b-form-group>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="max-width">
      <b-col
        md="12"
        class="mx-auto d-flex justify-content-center font-weight-bold"
      >
        <b-button
          id="callback-btn"
          type="submit"
          class="w-100 button button-dark button-lg"
          :disabled="buttonDisabled"
          @click="handleSubmit"
        >
          Subscribe
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { ValidationProvider } from 'vee-validate';

export default {
  name: 'CreateSubscription',
  components: {
    ValidationProvider,
  },
  props: {
    buttonDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      callbackUrl: '',
    };
  },
  methods: {
    handleSubmit() {
      this.$refs['callback-ref'].validate().then(({ valid }) => {
        if (!valid) {
          return;
        }
        this.$emit('unsaved-data-change', false);
        this.$emit('subscribe', this.callbackUrl);
      });
    },
    callbackURLChange() {
      this.$emit('unsaved-data-change', !!this.callbackUrl);
    },
  },
};
</script>

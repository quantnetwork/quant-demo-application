<template>
  <div class="dark-bg-container">
    <div class="container-width page-container">
      <b-row class="max-width">
        <b-col
          md="12"
          class="mx-auto d-flex justify-content-center"
        >
          <h1 class="w-100 text-center">
            Authentication
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
            ref="token-ref"
            name="Token"
            rules="required"
            tag="div"
          >
            <b-link class="token-link">
              <span> Generate Token </span>
            </b-link>
            <b-form-group
              class="quant-form-group"
              label="OAuth Token:"
            >
              <b-input
                v-model.trim="authToken"
                class="quant-inputs"
                name="token"
                :class="{ 'is-invalid': errors[0] }"
                placeholder="Please Enter"
                type="text"
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
            id="auth-btn"
            type="submit"
            class="button w-100 button-lg button-dark"
            @click="handleSubmit"
          >
            Next
          </b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import { getToken, saveAuthToken } from '@/helpers/helper';
import { R_SINGLE_TRANSACTION } from '@/router/routes';
import { mapActions } from 'vuex';

export default {
  name: 'Authentication',
  components: {
    ValidationProvider,
  },
  data() {
    return {
      authToken: '',
      existedToken: '',
    };
  },
  created() {
    this.authToken = getToken() || '';
    this.existedToken = this.authToken;
    this.setChangesState(false);
  },
  methods: {
    ...mapActions(['setChangesState']),
    redirectToSingleTransaction() {
      this.$router.push({
        name: R_SINGLE_TRANSACTION,
      });
    },
    handleSubmit() {
      this.$refs['token-ref'].validate().then(({ valid }) => {
        if (!valid) {
          return;
        }
        if (!this.existedToken || this.existedToken !== this.authToken) {
          saveAuthToken(this.authToken);
          this.redirectToSingleTransaction();
          return;
        }
        this.redirectToSingleTransaction();
      });
    },
  },
};
</script>

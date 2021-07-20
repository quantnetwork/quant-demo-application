<template>
  <div class="dark-bg-container">
    <div class="container-width page-container">
      <b-row class="max-width">
        <b-col
          md="12"
          class="mx-auto d-flex align-items-center flex-column mt-100"
        >
          <b-navbar
            variant="faded"
            type="light"
          >
            <b-navbar-brand href="#">
              <img
                class="start-page-logo"
                src="assets/images/Quant-logo.png"
                alt="Quant-logo"
              >
            </b-navbar-brand>
          </b-navbar>
          <h1 class="w-100 text-center m-t-60 m-b-60">
            Overledger V2.0
          </h1>
          <b-button
            id="auth-btn"
            class="button w-100 button-lg button-dark"
            @click="handleStart"
          >
            Start
          </b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { R_AUTHENTICATION } from '@/router/routes';

export default {
  name: 'Start',
  methods: {
    handleStart() {
      this.$router.push({
        name: R_AUTHENTICATION,
      });
    },
  },
};
</script>

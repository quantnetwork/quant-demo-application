<template>
  <div class="container-width">
    <b-row>
      <b-col
        md="12"
        class="mx-auto d-flex justify-content-center font-weight-bold"
      >
        <h1 class="w-100 text-center">
          {{ text }}
        </h1>
      </b-col>
    </b-row>
    <b-row class="mb-4">
      <b-col
        md="3"
        class="mx-auto d-flex justify-content-center font-weight-bold"
      >
        <img
          class="loading"
          src="/assets/images/loading.gif"
          alt="Loading"
        >
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    text: {
      type: String,
      default: '',
    },
  },
};
</script>

<template>
  <b-button
    v-clipboard:copy="value"
    class="duplicate-btn"
    variant="link"
  >
    <span class="icon-duplicate" />
  </b-button>
</template>

<script>
export default {
  name: 'Clipboard',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
};
</script>

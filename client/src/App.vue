<template>
  <div
    id="app"
    class="wrapper"
  >
    <router-view class="app-main-container" />
    <notification />
  </div>
</template>

<script>
import Notification from '@/notification/Notification';

export default {
  name: 'App',
  components: {
    Notification,
  },
};
</script>

<style lang="scss">
@import "styles.scss";
</style>

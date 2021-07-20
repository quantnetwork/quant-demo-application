<template>
  <notifications
    group="top-center"
    position="top center"
    class="notification-wrapper"
  >
    <template
      slot="body"
      slot-scope="props"
    >
      <div
        :class="{
          'notif-content': props.item.type !== StatusTypes.warning,
          'warning-content': props.item.type === StatusTypes.warning,
        }"
      >
        <span
          class="mr-3"
          :class="{
            'icon-failed': props.item.type === StatusTypes.error,
            'icon-success': props.item.type === StatusTypes.success,
            'icon-info': props.item.type === StatusTypes.warning,
          }"
        />
        <span>{{ props.item.text }}</span>
      </div>
    </template>
  </notifications>
</template>

<script>
import STATUS_TYPES from '@/constants/statuses/statusType';

export default {
  name: 'Notification',
  data() {
    return {
      StatusTypes: STATUS_TYPES,
    };
  },
};
</script>

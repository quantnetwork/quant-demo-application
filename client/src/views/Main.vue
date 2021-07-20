<template>
  <div>
    <Header />
    <router-view />
  </div>
</template>

<script>
import Header from '@/components/layout/Header';
import { mapState } from 'vuex';

export default {
  name: 'Home',
  components: {
    Header,
  },
  computed: {
    ...mapState({
      hasUnsavedChanges: (state) => state.application.hasUnsavedChanges,
    }),
  },
  watch: {
    hasUnsavedChanges: {
      handler() {
        if (this.hasUnsavedChanges) {
          window.addEventListener('beforeunload', this.unloadHandler);
        } else {
          window.removeEventListener('beforeunload', this.unloadHandler);
        }
      },
    },
  },
  methods: {
    unloadHandler(e) {
      e.preventDefault();
      e.returnValue = 'Write something clever here..';
    },
  },
};
</script>

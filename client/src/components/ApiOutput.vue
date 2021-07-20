<template>
  <div
    class="api-wrapper"
    :class="{'api-open': visibleData}"
  >
    <div
      class="text-center api-output-text"
      :class="{'collapsed': !visibleData}"
      :aria-expanded="visibleData"
      aria-controls="collapse-4"
      @click="visibleData = !visibleData"
    >
      <h3>API Output</h3>
    </div>
    <b-collapse
      id="api-output"
      v-model="visibleData"
      class="mt-2 console-text"
    >
      <div
        v-for="(output, key) in data"
        :key="key"
        class="m-b-60"
      >
        <p
          v-for="(text, index) in data[key]"
          :key="index"
          v-html="text"
        />
      </div>
      <div id="down" />
    </b-collapse>
  </div>
</template>

<script>
export default {
  name: 'ApiOutput',
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      visibleData: false,
    };
  },
  watch: {
    isVisible() {
      this.visibleData = this.isVisible;
    },
  },
  updated() {
    this.scrollToBottom();
  },
  methods: {
    scrollToBottom() {
      const downElement = this.$el.querySelector('#down');
      if (downElement) {
        downElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    },
  },
};
</script>

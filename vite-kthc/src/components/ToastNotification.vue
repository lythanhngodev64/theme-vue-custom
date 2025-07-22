<template>
  <div v-if="isVisible" :class="['fixed', 'bottom-4', 'right-4', 'p-4', 'rounded-lg', 'shadow-lg', 'text-white', 'flex', 'items-center', 'z-50', notificationClass]">
    <svg v-if="type === 'success'" class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <svg v-else-if="type === 'error'" class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <svg v-else-if="type === 'warning'" class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
    <svg v-else class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>

    <span>{{ message }}</span>
    <button @click="hide" class="ml-4 text-white hover:text-gray-200">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info', // success, error, warning, info
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    duration: {
      type: Number,
      default: 3000 // milliseconds
    }
  },
  data() {
    return {
      isVisible: false,
      timeout: null
    };
  },
  computed: {
    notificationClass() {
      switch (this.type) {
        case 'success':
          return 'bg-green-500';
        case 'error':
          return 'bg-red-500';
        case 'warning':
          return 'bg-yellow-500';
        case 'info':
        default:
          return 'bg-blue-500';
      }
    }
  },
  methods: {
    show() {
      this.isVisible = true;
      if (this.duration > 0) {
        this.timeout = setTimeout(() => {
          this.hide();
        }, this.duration);
      }
    },
    hide() {
      this.isVisible = false;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.$emit('hidden'); // Emit an event when hidden
    }
  },
  watch: {
    // Watch message prop to show notification when message changes (if used this way)
    message(newVal) {
      if (newVal) {
        this.show();
      }
    }
  },
  // Optionally, to handle showing from a central manager
  mounted() {
    // You might integrate with a global event bus or provide/inject for more complex setups
  },
  beforeUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
};
</script>

<style scoped>
/* Có thể thêm transition cho hiệu ứng đẹp mắt hơn */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
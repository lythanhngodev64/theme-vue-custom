<template>
  <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-300 bg-opacity-30 backdrop-blur-sm">
    <div class="flex flex-col items-center p-6 bg-white rounded-lg shadow-xl">
      <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
      <p class="text-gray-700 text-lg font-semibold">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Đang xử lý...'
  }
});
</script>

<style scoped>
.loader {
  border-top-color: #3498db; /* Màu xanh của spinner */
  -webkit-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
}

@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
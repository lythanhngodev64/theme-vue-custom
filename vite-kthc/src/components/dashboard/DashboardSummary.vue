<template>
  <div class="dashboard-summary bg-white p-4 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
      <i v-if="icon" :class="icon" class="text-gray-500 text-xl"></i>
    </div>
    <div class="text-sm text-gray-600 mb-2">
      <span v-if="date">Đến: {{ date }}</span>
      <span v-if="period" class="font-bold">{{ period }}</span>
      <span v-if="unit" class="ml-4">ĐVT: {{ unit }}</span>
    </div>
    <div class="summary-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'fas fa-chart-pie',
  },
  date: {
    type: String,
    default: '',
  },
  unit: {
    type: String,
    default: '',
  },
  period: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
/* Component đã được tạo kiểu bằng Tailwind CSS, không cần thêm CSS tùy chỉnh */
</style>
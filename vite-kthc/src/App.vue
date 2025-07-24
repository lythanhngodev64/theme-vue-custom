<template>
  <router-view></router-view>
  <LoadingSpinner :isLoading="appLoading" :message="loadingMessage" />
</template>

<script setup>
import { ref, provide } from 'vue';
import LoadingSpinner from './components/common/LoadingSpinner.vue'; //

const appLoading = ref(false);
const loadingMessage = ref('Đang xử lý...');

// Hàm để bật/tắt loading
const showLoading = (message = 'Đang xử lý...') => {
  loadingMessage.value = message;
  appLoading.value = true;
};

const hideLoading = () => {
  appLoading.value = false;
};

// Cung cấp các hàm này cho toàn bộ ứng dụng
provide('showLoading', showLoading);
provide('hideLoading', hideLoading);
</script>

<style scoped>
  /* Đảm bảo Tailwind CSS được import ở đây hoặc trong main.js */
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /* margin-top: 60px; Có thể bỏ hoặc điều chỉnh để phù hợp với layout full màn hình */
  }
</style>
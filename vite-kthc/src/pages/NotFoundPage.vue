<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-800">404</h1>
      <p class="text-2xl text-gray-600 mb-4">Không tìm thấy trang</p>
      <p class="text-gray-500 mb-8">Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
      <router-link to="/tong-quan" class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Về trang Tổng quan
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
/* Có thể thêm CSS tùy chỉnh nếu cần */
</style>